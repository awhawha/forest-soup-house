/**
 * 照片儲存 — IndexedDB（孩子拍的材料照片、寄出的卡片、作品照）。
 * localStorage 放不下照片，所以 blob 存這裡，其它資料層只存 photoId。
 */

const DB_NAME = "soup-house-photos";
const STORE = "photos";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** 存一張照片，回傳 photoId */
export async function savePhoto(blob: Blob): Promise<string> {
  const id = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return id;
}

const urlCache = new Map<string, string>();

/** 取得照片的 object URL（有快取；找不到回傳 null） */
export async function getPhotoUrl(id: string): Promise<string | null> {
  if (urlCache.has(id)) return urlCache.get(id)!;
  try {
    const db = await openDb();
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve(req.result as Blob | undefined);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    urlCache.set(id, url);
    return url;
  } catch {
    return null;
  }
}
