// /data/soups.ts
// 完整覆蓋現有檔案

export interface Soup {
  slug: string
  name: string
  mood: string
  description: string
  characterSlug?: string
  ingredients?: string[]
  image?: string
  category: "warmth" | "sensory" | "magic" | "silly" | "nature" | "emotion"
}

export const soups: Soup[] = [

  // 🍲 溫暖日常系
  { slug: "warm-sweet", name: "暖暖香甜湯", category: "warmth",
    mood: "從肚子裡暖到指尖",
    description: "菲娜說這碗湯沒有秘方，只需要一個安靜的下午和不急著去哪裡的心情。",
    characterSlug: "fina",
    ingredients: ["蜂蜜露水", "暖暖薑片", "森林肉桂"] },

  { slug: "just-right", name: "剛剛好的湯", category: "warmth",
    mood: "不多不少的一天",
    description: "有些日子什麼特別的事都沒發生，但就是覺得很好。這碗湯就是那種感覺。",
    characterSlug: "fina",
    ingredients: ["剛好的鹽", "不多不少的愛", "今天的風"] },

  { slug: "sun-dried", name: "太陽曬過的湯", category: "warmth",
    mood: "聞起來像曬過太陽的棉被",
    description: "菲娜把材料放在窗邊曬了一整個早上，湯裡因此有了光的味道。",
    characterSlug: "fina",
    ingredients: ["曬乾薄荷", "日光碎片", "溫暖空氣"] },

  { slug: "tiny-happy", name: "小小幸福湯", category: "warmth",
    mood: "幸福不用很大",
    description: "一隻蟲子、一片葉子、一個微笑——菲娜說這些都可以放進去。",
    characterSlug: "fina",
    ingredients: ["一片嫩葉", "小小驚喜", "今天的微笑"] },

  { slug: "forest-breakfast", name: "森林早餐湯", category: "warmth",
    mood: "森林醒來之前",
    description: "天還沒亮，湯的香氣比太陽更早出現在森林裡。",
    characterSlug: "fina",
    ingredients: ["晨露燕麥", "第一道光", "樹林空氣"] },

  { slug: "goodnight", name: "睡前晚安湯", category: "warmth",
    mood: "喝完就可以閉上眼睛了",
    description: "這碗湯只在睡前喝，喝了會做關於森林的夢。",
    characterSlug: "poffy",
    ingredients: ["洋甘菊花", "月光薄片", "輕輕嘆息"] },

  { slug: "gentle-hug", name: "輕輕抱抱湯", category: "warmth",
    mood: "像被輕輕抱住的感覺",
    description: "不需要說話，喝一碗就知道有人在。",
    characterSlug: "fina",
    ingredients: ["溫暖棉花雲", "輕輕的風", "在旁邊就好"] },

  { slug: "slowly-warm", name: "慢慢變暖湯", category: "warmth",
    mood: "不是馬上，是慢慢地",
    description: "菲娜說有些事不能急，湯也是。",
    characterSlug: "fina",
    ingredients: ["耐心草", "慢慢薑", "時間少許"] },

  // 🌿 氣味感官系
  { slug: "memory-scent", name: "記憶香香湯", category: "sensory",
    mood: "聞到就想起某個人",
    description: "每個人的記憶香香湯味道都不一樣，因為每個人記得的人不一樣。",
    characterSlug: "fina",
    ingredients: ["記憶碎片", "某人的味道", "很久以前的空氣"] },

  { slug: "awakening", name: "喚香湯", category: "sensory",
    mood: "把藏起來的氣味喚回來",
    description: "菲娜說有些味道只是睡著了，不是消失了。",
    characterSlug: "fina",
    ingredients: ["沉睡的香草", "喚醒露", "森林呼吸"] },

  { slug: "wind-scent", name: "風裡的香味湯", category: "sensory",
    mood: "香味跟著風走",
    description: "這碗湯要在風大的時候喝，這樣香氣才會一直變。",
    characterSlug: "poffy",
    ingredients: ["風捎來的花粉", "移動的香氣", "方向不定的葉"] },

  { slug: "lost-scent", name: "迷路氣味湯", category: "sensory",
    mood: "聞到但說不出是什麼",
    description: "有些氣味沒有名字，菲娜說那是最珍貴的那種。",
    characterSlug: "fina",
    ingredients: ["沒有名字的香", "找不到源頭的味道", "迷路的風"] },

  { slug: "first-taste", name: "第一口味道湯", category: "sensory",
    mood: "第一口永遠是最難忘的",
    description: "你還記得你第一次喝湯是什麼感覺嗎？菲娜記得。",
    characterSlug: "fina",
    ingredients: ["第一次的緊張", "新鮮好奇心", "還不知道會怎樣"] },

  { slug: "smile-scent", name: "聞一聞就笑湯", category: "sensory",
    mood: "還沒喝就先笑了",
    description: "菲娜說這碗湯的香氣會讓人不自覺地翹起嘴角。",
    characterSlug: "poffy",
    ingredients: ["快樂草", "翹嘴角的魔法", "忍不住的香"] },

  { slug: "hiding-scent", name: "躲起來的味道湯", category: "sensory",
    mood: "要仔細聞才發現",
    description: "這碗湯的香味很害羞，藏在其他味道後面，等你去找。",
    characterSlug: "fina",
    ingredients: ["害羞香草", "躲貓貓葉", "找找看"] },

  { slug: "scent-returns", name: "香味回來了湯", category: "sensory",
    mood: "以為不見了，結果回來了",
    description: "有些氣味會消失很久，但只要天氣對了就會回來。",
    characterSlug: "fina",
    ingredients: ["回來的春風", "等待的香氣", "重逢的溫度"] },

  // ✨ 魔法系
  { slug: "night-glow", name: "夜光湯", category: "magic",
    mood: "關燈才看得到它發光",
    description: "菲娜說這碗湯加了月光收集來的露水，所以夜裡會微微發亮。",
    characterSlug: "lilo",
    ingredients: ["月光露水", "發光苔蘚", "夜晚安靜"] },

  { slug: "star-fell", name: "星星掉進湯", category: "magic",
    mood: "有一顆星星不小心掉進來了",
    description: "不是每天都有，只有特別清澈的夜晚才有機會。",
    characterSlug: "lilo",
    ingredients: ["掉落的星光", "清澈夜空", "剛好在那裡"] },

  { slug: "glowing-mushroom", name: "發光蘑菇湯", category: "magic",
    mood: "蘑菇在鍋裡還在發光",
    description: "里洛在森林深處找到的，加進湯裡之後整鍋都亮了起來。",
    characterSlug: "lilo",
    ingredients: ["深林發光菇", "神秘孢子", "里洛的發現"] },

  { slug: "moon-leaf", name: "月亮葉湯", category: "magic",
    mood: "葉子長得像月亮的形狀",
    description: "只在滿月前一天採，採到的人會有好夢。",
    characterSlug: "lilo",
    ingredients: ["月形葉片", "滿月前的露", "好夢粉末"] },

  { slug: "fairy-bubble", name: "小精靈泡泡湯", category: "magic",
    mood: "泡泡裡面住著小精靈",
    description: "波飛說如果你輕輕吹，泡泡會飄到很遠的地方去送信。",
    characterSlug: "poffy",
    ingredients: ["精靈泡泡草", "輕輕的氣息", "遠方的地址"] },

  { slug: "sparkle-magic", name: "魔法閃閃湯", category: "magic",
    mood: "喝完手指會閃閃發光三秒鐘",
    description: "里洛不確定為什麼會這樣，但菲娜說這就是魔法。",
    characterSlug: "lilo",
    ingredients: ["閃光粉", "不知道為什麼的魔法", "三秒鐘"] },

  { slug: "transform", name: "咕嚕咕嚕變身湯", category: "magic",
    mood: "喝完會變成⋯⋯還不確定",
    description: "每次煮出來都不一樣，菲娜說這是因為森林每天都在變。",
    characterSlug: "fina",
    ingredients: ["變身草", "今天的森林", "未知材料"] },

  { slug: "wish", name: "願望湯", category: "magic",
    mood: "喝之前先許一個願望",
    description: "菲娜說願望不一定會成真，但說出來之後會更接近。",
    characterSlug: "fina",
    ingredients: ["說出口的願望", "星光少許", "相信的心"] },

  // 😂 搞笑臭臭系
  { slug: "stinky-tofu", name: "臭豆精亂入湯", category: "silly",
    mood: "臭豆精又跑進來了",
    description: "菲娜明明沒有放，但臭豆精每次都會自己跳進鍋裡。",
    characterSlug: "lilo",
    ingredients: ["不請自來的臭豆精", "無辜的菲娜", "不知道怎麼辦"] },

  { slug: "banana-peel", name: "香蕉皮滑倒湯", category: "silly",
    mood: "不小心滑進去的那種",
    description: "波飛說這是意外，但菲娜覺得香蕉皮是故意的。",
    characterSlug: "poffy",
    ingredients: ["神秘香蕉皮", "滑倒的聲音", "故意還是意外"] },

  { slug: "stinky-sock", name: "臭襪翻滾湯", category: "silly",
    mood: "請不要問這雙襪子從哪裡來",
    description: "里洛堅持說這樣湯才有「個性」，其他人有不同意見。",
    characterSlug: "lilo",
    ingredients: ["來源不明的襪子", "強烈個性", "捏著鼻子"] },

  { slug: "too-much", name: "不小心加太多湯", category: "silly",
    mood: "手滑了",
    description: "菲娜說下次會注意，但每次都說。",
    characterSlug: "fina",
    ingredients: ["太多鹽", "太多胡椒", "太多什麼都有"] },

  { slug: "weird-bubble", name: "噗滋噗滋怪味湯", category: "silly",
    mood: "泡泡的聲音很奇怪",
    description: "波飛說是音樂，其他人說是噪音。",
    characterSlug: "poffy",
    ingredients: ["怪聲泡泡草", "爭議性香料", "噗滋噗滋"] },

  { slug: "snail-slime", name: "黏黏蝸牛湯", category: "silly",
    mood: "就是黏黏的",
    description: "里洛研究了很久，結論是「不知道但很有趣」。",
    characterSlug: "lilo",
    ingredients: ["蝸牛（本人否認）", "黏黏的東西", "研究結論不明"] },

  { slug: "surprise-taste", name: "嚇一跳味道湯", category: "silly",
    mood: "第一口會嚇到",
    description: "菲娜說這是設計，不是意外。",
    characterSlug: "fina",
    ingredients: ["出乎意料的香料", "第二口的勇氣", "菲娜的計畫"] },

  { slug: "gets-weirder", name: "越聞越奇怪湯", category: "silly",
    mood: "越聞越不對",
    description: "波飛說這是「層次」，大家決定相信他。",
    characterSlug: "poffy",
    ingredients: ["第一層香氣", "第二層疑惑", "第三層放棄理解"] },

  // 🌼 自然森林系
  { slug: "herb-garden", name: "草藥花園湯", category: "nature",
    mood: "帶著露水的香",
    description: "菲娜每天早上在草藥花園採一把，今天的湯就從這裡開始。",
    characterSlug: "fina",
    ingredients: ["新鮮薰衣草", "迷迭香嫩枝", "早晨露水"] },

  { slug: "forest-dew", name: "森林露水湯", category: "nature",
    mood: "天亮前就要收集",
    description: "太陽出來之前，菲娜拿小瓶子一滴一滴收集葉子上的露水。",
    characterSlug: "fina",
    ingredients: ["葉尖露水", "黎明的空氣", "安靜的手"] },

  { slug: "riverside", name: "河邊漂流湯", category: "nature",
    mood: "跟著河水慢慢走",
    description: "湯湯小河漂來的材料，每天都不一樣。",
    characterSlug: "poffy",
    ingredients: ["漂來的樹枝", "河裡的石頭", "今天的驚喜"] },

  { slug: "treehouse-secret", name: "樹屋秘密湯", category: "nature",
    mood: "只有爬上去才知道",
    description: "菲娜說秘密食材要自己去找，說出來就不算秘密了。",
    characterSlug: "fina",
    ingredients: ["秘密（不能說）", "爬樹的努力", "值得的景色"] },

  { slug: "deer-guide", name: "小鹿帶路湯", category: "nature",
    mood: "跟著小鹿走",
    description: "小鹿守門人帶菲娜去了一個從來沒去過的地方。",
    characterSlug: "fina",
    ingredients: ["小鹿帶來的植物", "第一次去的地方", "驚喜材料"] },

  { slug: "squirrel-collection", name: "松鼠收藏湯", category: "nature",
    mood: "松鼠藏起來的",
    description: "松鼠說可以，但要還，而且要加利息。",
    characterSlug: "lilo",
    ingredients: ["松鼠的橡果", "借來的堅果", "還要加利息"] },

  { slug: "wind-leaves", name: "風吹葉子湯", category: "nature",
    mood: "今天的材料是風決定的",
    description: "今天的材料是風決定的，菲娜只負責煮。",
    characterSlug: "fina",
    ingredients: ["風送來的葉", "不知道哪棵樹的", "菲娜接住了"] },

  { slug: "seed-in-stone", name: "石頭裡的種子湯", category: "nature",
    mood: "石頭裂開了",
    description: "里洛說這顆種子等了很久，今天終於可以放進湯裡了。",
    characterSlug: "lilo",
    ingredients: ["等待很久的種子", "裂開的石頭", "終於的時刻"] },

  // 🎭 情緒故事系
  { slug: "brave", name: "勇氣湯", category: "emotion",
    mood: "要做一件有點怕的事之前喝",
    description: "菲娜說勇氣不是不怕，是怕了還是去做。",
    characterSlug: "fina",
    ingredients: ["深呼吸草", "還是去吧葉", "怕了也沒關係"] },

  { slug: "laughter", name: "歡笑湯", category: "emotion",
    mood: "還沒喝就先笑了",
    description: "波飛說這碗湯在煮的時候鍋子也在笑。",
    characterSlug: "poffy",
    ingredients: ["咕嚕笑聲", "忍不住的快樂", "一起笑"] },

  { slug: "a-little-sad", name: "有點難過湯", category: "emotion",
    mood: "不是很難過，就是有點",
    description: "菲娜說有點難過的時候不用假裝沒事，喝碗湯陪著你。",
    characterSlug: "fina",
    ingredients: ["有點重的心情", "陪著你的溫度", "不用說話也好"] },

  { slug: "dont-want-to-share", name: "不想分享湯", category: "emotion",
    mood: "這碗是我的",
    description: "菲娜說這個感覺完全沒問題，有時候就是想要一個人的東西。",
    characterSlug: "fina",
    ingredients: ["我的材料", "不用解釋", "就是想自己喝"] },

  { slug: "try-again", name: "再試一次湯", category: "emotion",
    mood: "沒關係，再來一次",
    description: "里洛說她的實驗失敗過一百次，所以這碗湯煮得特別好。",
    characterSlug: "lilo",
    ingredients: ["第101次的材料", "失敗的經驗", "還是要試"] },

  { slug: "best-friend", name: "好朋友湯", category: "emotion",
    mood: "兩個人一起喝才完整",
    description: "菲娜說這碗湯要分享，不然味道會少一半。",
    characterSlug: "fina",
    ingredients: ["你一半", "我一半", "加在一起剛好"] },

  { slug: "forgive", name: "原諒一下湯", category: "emotion",
    mood: "說了對不起之後",
    description: "菲娜說原諒不用馬上，但湯可以先喝。",
    characterSlug: "fina",
    ingredients: ["對不起的勇氣", "等一下沒關係", "先喝一口"] },

  { slug: "almost-there", name: "等一下就好湯", category: "emotion",
    mood: "快了，再等一下",
    description: "波飛說這碗湯是給所有正在等待的人的。",
    characterSlug: "poffy",
    ingredients: ["快到了的感覺", "再一下下", "值得等的東西"] },

  { slug: "missing-you", name: "想念的湯", category: "emotion",
    mood: "想一個人但那個人不在",
    description: "菲娜說想念也是一種愛，這碗湯幫你把它裝起來。",
    characterSlug: "fina",
    ingredients: ["想起來的味道", "不在但還記得", "裝進去的思念"] },

  { slug: "big-adventure", name: "大冒險湯", category: "emotion",
    mood: "出發前喝，回來後講故事",
    description: "菲娜每次冒險前都煮這碗，說喝了腳步會更穩。",
    characterSlug: "fina",
    ingredients: ["出發的決心", "路上的驚喜", "回來的故事"] },
];

/** Alias for components / legacy imports */
export type SoupCard = Soup;
export const soupCards = soups;