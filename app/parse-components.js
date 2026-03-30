// parse-components.js
// 把 Tailwind className 解析成 Figma 看得懂的 component JSON
// 用法：node parse-components.js

const fs = require("fs");

// ---- 你的 token 對應表（從 globals.css 來的）----
const TOKEN_MAP = {
  "bg-moss": { fill: "#4F7A4E" },
  "bg-moss-dark": { fill: "#36563A" },
  "bg-paper": { fill: "#F4F1EA" },
  "bg-paper-card": { fill: "#FBF8F2" },
  "text-white": { color: "#FFFFFF" },
  "text-ink-on-green": { color: "#F7F4EE" },
  "text-wood": { color: "#3F372F" },
  "text-wood-muted": { color: "#736B61" },
  "text-moss": { color: "#4F7A4E" },
  "text-moss-dark": { color: "#36563A" },
  "border-border-paper": { borderColor: "#DAD1C4" },
  "border-border-card": { borderColor: "#CFC6B8" },
};

// Tailwind spacing scale (px)
const SPACING = {
  "0": 0, "0.5": 2, "1": 4, "1.5": 6, "2": 8, "2.5": 10,
  "3": 12, "3.5": 14, "4": 16, "5": 20, "6": 24, "7": 28,
  "8": 32, "9": 36, "10": 40, "11": 44, "12": 48,
};

// Tailwind border-radius scale (px)
const RADIUS = {
  "rounded-sm": 2, "rounded": 4, "rounded-md": 6, "rounded-lg": 8,
  "rounded-xl": 12, "rounded-2xl": 16, "rounded-3xl": 24, "rounded-full": 9999,
};

// Tailwind font-size
const FONT_SIZE = {
  "text-xs": 12, "text-sm": 14, "text-base": 16,
  "text-lg": 18, "text-xl": 20, "text-2xl": 24,
};

// Tailwind font-weight
const FONT_WEIGHT = {
  "font-normal": 400, "font-medium": 500,
  "font-semibold": 600, "font-bold": 700,
};

function parseClassName(className) {
  const classes = className.split(" ").map((c) => c.trim()).filter(Boolean);
  const result = {
    fill: null,
    fillHover: null,
    textColor: null,
    textColorHover: null,
    borderColor: null,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: null,
    borderRadius: 0,
    fontSize: 16,
    fontWeight: 400,
    hasBorder: false,
  };

  for (const cls of classes) {
    // hover states
    if (cls.startsWith("hover:bg-")) {
      const key = cls.replace("hover:", "");
      result.fillHover = TOKEN_MAP[key]?.fill || null;
      continue;
    }
    if (cls.startsWith("hover:text-")) {
      const key = cls.replace("hover:", "");
      result.textColorHover = TOKEN_MAP[key]?.color || null;
      continue;
    }

    // fill
    if (TOKEN_MAP[cls]?.fill) { result.fill = TOKEN_MAP[cls].fill; continue; }
    // text color
    if (TOKEN_MAP[cls]?.color) { result.textColor = TOKEN_MAP[cls].color; continue; }
    // border color
    if (TOKEN_MAP[cls]?.borderColor) {
      result.borderColor = TOKEN_MAP[cls].borderColor;
      result.hasBorder = true;
      continue;
    }

    // border (just `border` class)
    if (cls === "border") { result.hasBorder = true; continue; }

    // border-radius
    if (RADIUS[cls] !== undefined) { result.borderRadius = RADIUS[cls]; continue; }

    // font-size
    if (FONT_SIZE[cls]) { result.fontSize = FONT_SIZE[cls]; continue; }

    // font-weight
    if (FONT_WEIGHT[cls]) { result.fontWeight = FONT_WEIGHT[cls]; continue; }

    // padding x/y
    if (cls.startsWith("px-")) {
      const val = SPACING[cls.replace("px-", "")];
      if (val !== undefined) { result.paddingLeft = val; result.paddingRight = val; }
      continue;
    }
    if (cls.startsWith("py-")) {
      const val = SPACING[cls.replace("py-", "")];
      if (val !== undefined) { result.paddingTop = val; result.paddingBottom = val; }
      continue;
    }

    // min-height
    if (cls.startsWith("min-h-[") && cls.endsWith("]")) {
      const val = parseInt(cls.replace("min-h-[", "").replace("px]", ""));
      if (!isNaN(val)) result.minHeight = val;
      continue;
    }
    if (cls === "min-h-[44px]") { result.minHeight = 44; continue; }
  }

  return result;
}

// ---- 你的 components ----
const COMPONENTS = [
  {
    name: "Button/Primary",
    label: "Click me",
    className:
      "inline-flex min-h-[44px] items-center justify-center rounded-xl bg-moss px-6 py-3 text-base font-medium text-white transition-colors hover:bg-moss-dark focus:outline-none focus:ring-2 focus:ring-moss/50 focus:ring-offset-2 focus:ring-offset-paper",
  },
  {
    name: "Button/Ghost",
    label: "Learn more →",
    className:
      "inline-flex min-h-[44px] items-center text-wood-muted transition-colors hover:text-wood focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper",
  },
];

// ---- Main ----
const output = COMPONENTS.map(({ name, label, className }) => ({
  name,
  label,
  styles: parseClassName(className),
}));

fs.writeFileSync("./components.json", JSON.stringify(output, null, 2), "utf-8");

console.log("✅ 解析完成！\n");
for (const comp of output) {
  console.log(`[${comp.name}]`);
  console.log(JSON.stringify(comp.styles, null, 2));
  console.log();
}
console.log("📄 完整 JSON 已輸出到：components.json");
