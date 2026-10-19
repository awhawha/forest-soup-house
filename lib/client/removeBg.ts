/**
 * 瀏覽器端去背 — 把拍到的材料照片變成透明背景 PNG（收藏櫃／煮湯當貼紙用）。
 * 整段在瀏覽器裡跑 ML 模型，照片不外傳，維持「照片只存本機」的隱私設計。
 *
 * 模型庫較大，故用動態 import：只有小孩真的按下拍照才載入，不拖慢首屏。
 * 第一次會下載模型（瀏覽器會快取），之後就快了。
 *
 * 速度：模型推論固定在 1024 解析度跑（庫內寫死），縮圖救不了推論，只能靠
 * 較快的量化模型 isnet_quint8（int8，手機 CPU 比 fp16 快很多）＋ 有 WebGPU
 * 就走 GPU。縮圖仍保留，讓解碼／輸出／裁邊的主執行緒工作變小。
 */

const MAX_EDGE = 768; // 貼紙頂多顯示 <200px，768 已綽綽有餘，主執行緒工作更小
const MODEL = "isnet_quint8" as const; // int8 量化：手機 CPU 上比 fp16 快、下載更小
// 有 WebGPU 就用 GPU（快數倍）；否則 CPU。失敗會在 cutoutBlob 退回 CPU
const DEVICE: "gpu" | "cpu" =
  typeof navigator !== "undefined" && "gpu" in navigator ? "gpu" : "cpu";

// 暖機：只跑一次；失敗把它清掉，允許之後再試
let warming: Promise<void> | null = null;

/**
 * 提早把去背模型下載＋初始化好（不處理圖片）。
 * 小孩一進採集頁就在背景偷偷暖機，等他真的拍照時模型已就緒，省掉「第一次」的等待。
 * 用的模型必須跟 cutoutBlob 一致，快取才會命中。
 */
export function warmupCutout(): void {
  if (warming) return;
  warming = import("@imgly/background-removal")
    .then(({ preload }) => preload({ model: MODEL, device: DEVICE }))
    .catch(() => {
      warming = null;
    });
}

// 同一張照片正在去背中就共用同一個 Promise，避免 StrictMode 雙跑／重複點擊
// 兩顆去背搶 CPU（實際更慢）
const inflight = new WeakMap<Blob, Promise<Blob>>();

/** 去背，回傳裁到主體邊界的透明背景 PNG blob；失敗時 throw（呼叫端請保留原圖當退路） */
export function cutoutBlob(file: Blob): Promise<Blob> {
  const existing = inflight.get(file);
  if (existing) return existing;
  const p = runCutout(file).finally(() => inflight.delete(file));
  inflight.set(file, p);
  return p;
}

async function runCutout(file: Blob): Promise<Blob> {
  const small = (await downscale(file, MAX_EDGE)) ?? file;
  const { removeBackground } = await import("@imgly/background-removal");

  const run = (dev: "gpu" | "cpu") =>
    quietOrt(() => removeBackground(small, { model: MODEL, device: dev, output: { format: "image/png" } }));

  let cut: Blob;
  try {
    cut = await run(DEVICE);
  } catch (err) {
    if (DEVICE === "gpu") cut = await run("cpu"); // GPU 路徑掛了就退回 CPU
    else throw err;
  }

  return (await trimTransparent(cut)) ?? cut;
}

/**
 * 去背期間暫時濾掉 ONNX Runtime 的無害雜訊（「節點沒分配到偏好執行器」之類的 warning）。
 * 這些不影響去背，但 Next dev overlay 會把 console 訊息當成紅色錯誤跳出來。其它訊息照常、結束即還原。
 */
async function quietOrt<T>(fn: () => Promise<T>): Promise<T> {
  const noisy = (args: unknown[]) =>
    args.some((a) => typeof a === "string" && (a.includes("onnxruntime") || a.includes("VerifyEachNodeIsAssignedToAnEp")));
  const orig = { warn: console.warn, error: console.error };
  const wrap = (f: (...a: unknown[]) => void) => (...a: unknown[]) => {
    if (!noisy(a)) f(...a);
  };
  console.warn = wrap(orig.warn);
  console.error = wrap(orig.error);
  try {
    return await fn();
  } finally {
    console.warn = orig.warn;
    console.error = orig.error;
  }
}

/** 把圖縮到最長邊 maxEdge（已經夠小就回傳 null，沿用原圖）；輸出 JPEG blob */
async function downscale(blob: Blob, maxEdge: number): Promise<Blob | null> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return null;
    const scale = maxEdge / Math.max(w, h);
    if (scale >= 1) return null; // 本來就夠小

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * 把透明背景 PNG 四周的透明邊裁掉，讓主體填滿畫面。
 * 不裁不行——去背後主體常只佔中間一小塊，直接顯示會「東西變得太小」。
 * 裁不動（讀不到像素／整張透明）時回傳 null，讓呼叫端沿用原圖。
 */
async function trimTransparent(blob: Blob, padRatio = 0.04): Promise<Blob | null> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return null;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);

    const { data } = ctx.getImageData(0, 0, w, h);
    const ALPHA = 12; // 低於此視為透明
    // 跳點掃描：邊界框不需像素級精準，每軸最多取樣 ~512 點，慢手機也不卡
    const step = Math.max(1, Math.floor(Math.max(w, h) / 512));
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let y = 0; y < h; y += step) {
      const row = y * w;
      for (let x = 0; x < w; x += step) {
        if (data[(row + x) * 4 + 3] > ALPHA) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < minX || maxY < minY) return null; // 整張透明
    // 補回跳點可能漏掉的邊緣
    minX = Math.max(0, minX - step);
    minY = Math.max(0, minY - step);
    maxX = Math.min(w - 1, maxX + step);
    maxY = Math.min(h - 1, maxY + step);

    // 留一點邊，主體才不會貼齊到邊緣
    const pad = Math.round(Math.max(maxX - minX, maxY - minY) * padRatio);
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad);
    maxY = Math.min(h - 1, maxY + pad);
    const cw = maxX - minX + 1;
    const ch = maxY - minY + 1;

    const out = document.createElement("canvas");
    out.width = cw;
    out.height = ch;
    const octx = out.getContext("2d");
    if (!octx) return null;
    octx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);

    return await new Promise<Blob | null>((resolve) => out.toBlob(resolve, "image/png"));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
