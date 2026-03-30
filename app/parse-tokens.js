// parse-tokens.js
// 把 globals.css 裡的 CSS variables 解析成結構化 JSON
// 用法：node parse-tokens.js
 
const fs = require("fs");
const path = require("path");
 
// ---- 設定 ----
const INPUT_FILE = "./globals.css"; // 你的 globals.css 路徑
const OUTPUT_FILE = "./tokens.json"; // 輸出的 JSON 路徑
 
// ---- 分組關鍵字對應 ----
// 根據你的命名規則自動分組
const GROUP_MAP = [
  { group: "surfaces", keywords: ["paper"] },
  { group: "text", keywords: ["wood", "ink"] },
  { group: "borders", keywords: ["border"] },
  { group: "greens", keywords: ["moss"] },
  { group: "accents", keywords: ["accent"] },
  { group: "gradients", keywords: ["gradient"] },
  { group: "shadows", keywords: ["shadow"] },
  { group: "fonts", keywords: ["font"] },
];
 
function detectGroup(name) {
  for (const { group, keywords } of GROUP_MAP) {
    if (keywords.some((k) => name.includes(k))) return group;
  }
  return "other";
}
 
function parseCSS(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
 
  // 只抓 :root {} 裡面的內容
  const rootMatch = content.match(/:root\s*\{([^}]+)\}/);
  if (!rootMatch) {
    console.error("找不到 :root {} block，請確認你的 CSS 格式");
    process.exit(1);
  }
 
  const rootBlock = rootMatch[1];
 
  // 抓所有 --variable-name: value; 的行
  const varRegex = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  const tokens = {};
  let match;
 
  while ((match = varRegex.exec(rootBlock)) !== null) {
    const name = match[1].trim();
    const value = match[2].trim();
 
    // 跳過 var() 引用（這些是 @theme inline 的 mapping，不是原始 token）
    if (value.startsWith("var(")) continue;
 
    const group = detectGroup(name);
 
    if (!tokens[group]) tokens[group] = {};
    tokens[group][name] = value;
  }
 
  return tokens;
}
 
function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`找不到檔案：${INPUT_FILE}`);
    console.error("請把 globals.css 放在同一個資料夾，或修改 INPUT_FILE 路徑");
    process.exit(1);
  }
 
  const tokens = parseCSS(INPUT_FILE);
 
  // 輸出 JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tokens, null, 2), "utf-8");
 
  // Console 預覽
  console.log("✅ 解析完成！\n");
  console.log("=== Token 結構預覽 ===");
  for (const [group, values] of Object.entries(tokens)) {
    console.log(`\n[${group}]`);
    for (const [name, value] of Object.entries(values)) {
      console.log(`  --${name}: ${value}`);
    }
  }
 
  console.log(`\n📄 完整 JSON 已輸出到：${OUTPUT_FILE}`);
  console.log(`共解析 ${Object.values(tokens).reduce((acc, g) => acc + Object.keys(g).length, 0)} 個 token`);
}
 
main();