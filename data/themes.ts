export interface CollectionChallenge {
  type: "choice" | "riddle" | "secret";
  prompt: string;
  options?: { text: string; finaResponse: string }[];
  riddle?: { question: string; answer: string; hint: string; finaResponse: string };
  secret?: { placeholder: string; finaResponse: string };
}

export interface ThemeIngredient {
  slug: string;
  name: string;
  description: string;
  locationSlug: string;
  locationName: string;
  collection: CollectionChallenge;
}

export interface ThemeBook {
  title: string;
  author: string;
  reason: string;
}

export interface ThemeParentNote {
  theme: string;
  skills: string[];
  talkingPoint: string;
}

export interface Theme {
  slug: string;
  title: string;
  tagline: string;
  /** 列表卡片封面；未設定時顯示佔位色塊 */
  image?: string;
  soupSlug: string;
  storyContent: string;
  /**
   * 魔法故事屋：音檔 + 雙語段落（若未填 magicParagraphsZh，則用 storyContent 依空行分段）
   * 例：/audios/herbal-patch-story.mp3
   */
  audioSrc?: string;
  magicSubtitleZh?: string;
  /** 若省略，則用 storyContent 依空行分段作為中文段落 */
  magicParagraphsZh?: string[];
  magicParagraphsEn?: string[];
  /** 魔法故事屋插圖（未設定則用列表用 image） */
  magicImageSrc?: string;
  magicImageAlt?: string;
  ingredients: ThemeIngredient[];
  adventure: { title: string; description: string };
  natureCraft: { title: string; description: string };
  books: ThemeBook[];
  badgeName: string;
  parentNote: ThemeParentNote;
}

export const themes: Theme[] = [
  {
    slug: "memory-soup",
    title: "記憶中的香香湯",
    tagline: "有沒有什麼味道，是你一聞就覺得好安心好開心的？",
    image: "/images/stories/herbal-patch-story.png",
    soupSlug: "memory-scent",
    audioSrc: "/audios/herbal-patch-story.mp3",
    magicSubtitleZh: "✨ 聽一聽《記憶中的香香湯》的魔法故事",
    magicParagraphsZh: [
      "早晨裡，小狐狸發現今天的空氣中，湯的香氣和花香味變得好淡。她甚至擔心：會不會是自己的鼻子壞掉了？",
      "貓頭鷹和小鳥陪她到花園裡找啊找，繞了好幾圈，終於在一個小角落，捉到一絲絲熟悉的香味線索。",
      "她決定煮一鍋「記憶中的香香湯」：放進最愛的一朵花、幾片香香的葉子，還有一顆小小的「記憶核果」。湯在鍋裡咕嚕咕嚕滾起來時，香氣回來了。她把湯分給兔子、小鳥和貓頭鷹，和大家一起，把味道留在今天。",
    ],
    magicParagraphsEn: [
      "One morning, the little fox noticed the soup scent and flower scent in the air had gone very quiet. She even worried—had her nose stopped working?",
      "An owl and a little bird went with her into the garden to search, round and round—until, in one small corner, they caught a thread of a familiar fragrance.",
      'She decided to cook “Scented Soup in Memory”: her favorite blossom, a few fragrant leaves, and one tiny “memory nut.” As the soup bubbled in the pot, the scent came back. She shared the bowl with a rabbit, the bird, and the owl—keeping the taste in today, together.',
    ],
    magicImageSrc: "/images/stories/herbal-patch-story.png",
    magicImageAlt:
      "橘色小狐狸穿著圍裙，在溫暖的廚房裡攪拌發著金光的湯，湯裡飄著小花與香草。",
    storyContent: `早晨裡，小狐狸發現今天的空氣中，湯的香氣和花香味變得好淡。她甚至擔心：會不會是自己的鼻子壞掉了？

貓頭鷹和小鳥陪她到花園裡找啊找，繞了好幾圈，終於在一個小角落，捉到一絲絲熟悉的香味線索。

她決定煮一鍋「記憶中的香香湯」：放進最愛的一朵花、幾片香香的葉子，還有一顆小小的「記憶核果」。湯在鍋裡咕嚕咕嚕滾起來時，香氣回來了。她把湯分給兔子、小鳥和貓頭鷹，和大家一起，把味道留在今天。`,
    ingredients: [
      {
        slug: "soft-flower",
        name: "軟綿綿小花",
        description: "像奶奶洗完棉被曬太陽後的味道，軟綿綿又暖呼呼。",
        locationSlug: "herbal-patch",
        locationName: "草藥花園",
        collection: {
          type: "choice",
          prompt: "菲娜說：這朵花聞起來像什麼？",
          options: [
            { text: "像曬過太陽的棉被，軟軟暖暖的", finaResponse: "對！就是這個！像奶奶家的棉被，讓人好安心。" },
            { text: "像雨後的泥土，濕濕涼涼的", finaResponse: "這朵也很特別，雨後的味道讓人想起很多事。" },
            { text: "像糖果，甜甜黏黏的", finaResponse: "哈哈，甜甜的也不錯！加進湯裡一定很有趣。" },
          ],
        },
      },
      {
        slug: "bread-chunk",
        name: "烤麵包香塊",
        description: "剛出爐的吐司香，會讓人想起起床時的好心情。",
        locationSlug: "ingredient-woods",
        locationName: "湯料森林",
        collection: {
          type: "riddle",
          prompt: "湯料森林裡藏著一個謎語",
          riddle: {
            question: "我住在早晨，我住在廚房，我讓人想起剛起床的味道，我是什麼？",
            answer: "麵包",
            hint: "菲娜說：想想看早餐桌上常常有什麼⋯⋯",
            finaResponse: "答對了！剛出爐的香味，是最溫暖的早晨記憶。",
          },
        },
      },
      {
        slug: "cloud-icecream",
        name: "雲朵香草冰淇淋",
        description: "甜甜的香草冰，一咬會笑出來，是夏天的記憶味道。",
        locationSlug: "brewing-shed",
        locationName: "熟成室",
        collection: {
          type: "secret",
          prompt: "熟成室的魔法需要你的記憶來召喚",
          secret: {
            placeholder: "你最喜歡的味道是⋯⋯",
            finaResponse: "謝謝你告訴我。這個味道現在也放進湯裡了。",
          },
        },
      },
    ],
    adventure: {
      title: "找一個記憶裡的味道",
      description:
        "找一個讓你想起某個人的味道——可以是食物、花、或任何東西。告訴大人那個味道讓你想起誰，以及一個關於那個人的小故事。",
    },
    natureCraft: {
      title: "香味收藏夾",
      description:
        "去外面採一片葉子或花瓣，放在書頁裡壓平。在旁邊寫下（或請大人幫你寫）：這個味道讓你想起什麼？這是你今天的香味收藏。",
    },
    books: [
      { title: "獾的禮物", author: "Susan Varley", reason: "關於記憶與思念，溫柔地說明一個人離開後留下的東西。" },
      { title: "爺爺的牆", author: "Eve Bunting", reason: "透過氣味和記憶連結兩代之間的情感。" },
      { title: "外婆的魔法廚房", author: "Ursula Wolfel", reason: "食物與記憶的連結，很適合飯後一起讀。" },
    ],
    badgeName: "香味守護者",
    parentNote: {
      theme:
        "嗅覺記憶——氣味是最古老的記憶通道，一個味道可以瞬間帶你回到很久以前的某個時刻。",
      skills: ["用語言描述感官（這個味道像⋯⋯）", "把抽象的感覺變成具體的詞", "跟大人分享自己的內心世界"],
      talkingPoint:
        "採集完材料之後，問孩子：你有沒有一個讓你想起某個人的味道？那個人是誰？不需要答案，光是這個問題就夠了。",
    },
  },
  {
    slug: "awakening-soup",
    title: "香味怎麼來的？",
    tagline: "香味不是只從一個地方來的，是大家一起分享出來的魔法。",
    soupSlug: "awakening",
    storyContent: `早上，湯湯屋的陽光照在桌上，小狐狸 Fina 把湯鍋端到窗邊，想再聞一聞昨天的香味。

她閉上眼睛，深深吸了一口氣：「嗯～好香好香……可是，這個香味是怎麼來的呢？」

火爐精靈 Poffy 飄了出來，一邊打呵欠一邊說：「香味啊？那可不是一個地方來的。要不要一起去找找？」

她們走進草藥花園，小花們在微風裡輕輕搖晃。「這朵是甜花香……這朵是清清香……」

這時，從草叢後跳出一隻毛茸茸的小松鼠——是 Milo！「你們也在聞香味嗎？我剛剛聞到一種像雲一樣的香味，會躲來躲去的喔！」

三人順著香氣走到河邊，找到一株葉子邊緣閃著光的小植物。「這是喚香葉！」小松鼠興奮地說，「香味會從它的葉脈跑出來！」

小狐狸又找到幾片甜薄荷，還有一顆小小的果子。「我要試試看，如果把它們放進湯鍋，香味會不會變出新的樣子？」

回到湯湯屋，湯開始冒泡，熱氣裡的香味慢慢飄出來。

小松鼠深深一吸：「這個味道……像是風吹過草地，再帶著一點甜甜的雲朵！」

火爐精靈點點頭：「看吧，每一種材料都有一點魔法，香味就是他們一起變出來的！」

小狐狸輕輕說：「原來香味不是從一個地方來的，是大家一起分享出來的呀。」`,
    ingredients: [
      {
        slug: "wake-leaf",
        name: "風吹喚香葉",
        description: "風吹才會香的葉子，香味輕輕地飄進鼻子裡，像是草地在打招呼。",
        locationSlug: "herbal-patch",
        locationName: "草藥花園",
        collection: {
          type: "choice",
          prompt: "菲娜說：今天的風帶來了一片葉子，你覺得它聞起來像什麼？",
          options: [
            { text: "像草地在打招呼，清清涼涼的", finaResponse: "對！就是這個味道，風帶來的禮物。" },
            { text: "像剛下完雨的泥土", finaResponse: "嗯，那是土壤的香氣，大地的氣息。" },
            { text: "像遠方傳來的花香", finaResponse: "香味真的會旅行耶！你聞到了它的故事。" },
          ],
        },
      },
      {
        slug: "sun-dried-candy",
        name: "太陽果乾糖",
        description: "太陽曬過的果乾糖，一咬開，甜甜的味道就像夏天的微笑。",
        locationSlug: "ingredient-woods",
        locationName: "湯料森林",
        collection: {
          type: "riddle",
          prompt: "Milo 在森林裡藏了一個謎語",
          riddle: {
            question: "我是太陽的禮物，曬了整個夏天才變成現在的樣子，一咬開就是甜甜的笑聲，我是什麼？",
            answer: "果乾",
            hint: "Milo 說：水果在太陽下睡了很久很久⋯⋯",
            finaResponse: "答對了！太陽把甜蜜都收進去了，現在都在你手上。",
          },
        },
      },
      {
        slug: "cool-mint",
        name: "冰涼薄荷葉",
        description: "冰冰的薄荷葉，放進嘴巴會「呼～」地冒出涼涼風，好舒服！",
        locationSlug: "soup-house",
        locationName: "湯湯屋",
        collection: {
          type: "secret",
          prompt: "Poffy 說：薄荷的魔法需要你說出一個清涼的記憶",
          secret: {
            placeholder: "有什麼東西讓你覺得清清涼涼的？",
            finaResponse: "嗯～就是這個感覺！薄荷喜歡這個記憶。",
          },
        },
      },
    ],
    adventure: {
      title: "香味偵探出動",
      description:
        "在家裡或外面，閉上眼睛聞三種不同的味道。告訴大人：每個味道讓你想到什麼顏色？什麼形狀？什麼感覺？",
    },
    natureCraft: {
      title: "香味地圖",
      description:
        "拿一張紙，在不同角落畫上你今天聞到的味道（可以用顏色或圖案來表示）。這是你的專屬香味地圖！",
    },
    books: [
      { title: "好餓的毛毛蟲", author: "Eric Carle", reason: "從小到大的變化，和孩子一起感受成長的奇妙。" },
      { title: "花婆婆", author: "Barbara Cooney", reason: "關於讓世界更美麗的心願，和感官探索。" },
      { title: "小魚散步", author: "陳致元", reason: "用孩子的眼光觀察日常，充滿感官細節。" },
    ],
    badgeName: "香味偵探",
    parentNote: {
      theme:
        "感官探索——香味不是單一來源，而是由多種元素組合而成的。這個故事鼓勵孩子學習觀察和發現。",
      skills: ["用多種感官探索同一件事物", "描述感官印象（像什麼、讓我想到什麼）", "培養好奇心和探索精神"],
      talkingPoint:
        "散步的時候，跟孩子一起聞聞看不同的東西，問他：這個味道是從哪裡來的？你覺得有幾種東西加在一起？",
    },
  },
  {
    slug: "brave-soup",
    title: "魔法湯譜初現",
    tagline: "勇氣不是不害怕，而是害怕了還是去做。",
    soupSlug: "brave",
    storyContent: `早晨的陽光透過湯湯屋的窗子灑進來，空氣裡飄著淡淡的木頭香。

小狐狸正在整理櫃子，忽然「咚！」一聲，有個厚厚的舊本子從最高的架子掉了下來。「咦？這是什麼？」

木精靈從門口探頭，笑著說：「啊，那是奶奶留下的——魔法湯譜。」

封面閃著金色的微光，第一頁出現了一張亮晶晶的食譜卡：「勇氣湯——喝了以後，心裡會變得像太陽一樣溫暖又勇敢。」

這時，門口傳來輕輕的敲門聲。是一隻小田鼠，他垂著耳朵，眼眶紅紅的。

「我……我好想去對面草地找好朋友玩，可是中間要經過一條小溪，水流好急，我好害怕，不敢過去。」

小狐狸看了看湯譜，眼睛一亮：「我們來煮一碗勇氣湯吧！」

廚房傳來「碰！」的一聲，小鴨廚助衝出來，腳下一滑，香草葉像下雪一樣嘩啦啦地撒滿地板。大家哈哈大笑。

他們按照湯譜，把紅果實、薄荷葉和暖薑放進鍋裡。湯咕嚕咕嚕地滾起來，發出開心的聲音。

小田鼠小心翼翼地啜了一口，感覺一股力量從心裡冒出來，耳朵慢慢地挺了起來。

「我……我覺得我的心裡有一點亮亮的。」小田鼠笑著說。

木精靈點點頭：「對呀，這碗湯把勇敢的感覺都煮進去了。」`,
    ingredients: [
      {
        slug: "red-fruit",
        name: "紅果實",
        description: "溫暖和能量的來源，喝下後讓心裡充滿力氣。",
        locationSlug: "herbal-patch",
        locationName: "草藥花園",
        collection: {
          type: "choice",
          prompt: "花園裡有一顆亮晶晶的紅果實，Fina 說它聞起來像什麼？",
          options: [
            { text: "像溫暖的太陽，暖呼呼的", finaResponse: "對！勇氣就是這種暖暖的感覺，從心裡長出來的。" },
            { text: "像酸酸甜甜的糖，讓人打起精神", finaResponse: "嗯！有時候勇氣就是酸酸甜甜的，需要一點點刺激。" },
            { text: "像新鮮的空氣，讓人深呼吸", finaResponse: "深呼吸就是勇氣的開始，你說得對！" },
          ],
        },
      },
      {
        slug: "mint-leaf",
        name: "薄荷葉",
        description: "冷靜和平靜的力量，能讓害怕的心情穩定下來。",
        locationSlug: "ingredient-woods",
        locationName: "湯料森林",
        collection: {
          type: "riddle",
          prompt: "森林裡藏著一個關於冷靜的謎語",
          riddle: {
            question: "當你感到害怕的時候，做這件事能讓你的心慢下來，讓你想清楚。這是什麼？",
            answer: "深呼吸",
            hint: "Fina 說：閉上眼睛，吸一口氣，再慢慢吐出來⋯⋯",
            finaResponse: "答對了！深呼吸就是薄荷葉的魔法，讓害怕變小一點。",
          },
        },
      },
      {
        slug: "warm-ginger",
        name: "暖薑",
        description: "安心和擁抱的感覺，它的溫暖能給人安全感。",
        locationSlug: "soup-house",
        locationName: "湯湯屋",
        collection: {
          type: "secret",
          prompt: "Poffy 說：告訴我，有沒有一件你做過、一開始有點害怕但後來很開心的事？",
          secret: {
            placeholder: "有一次，我很害怕但還是去做了⋯⋯",
            finaResponse: "你好勇敢！那個故事，就是最好的暖薑。",
          },
        },
      },
    ],
    adventure: {
      title: "今天的小勇敢",
      description:
        "想一件你一直想做、但有點害怕的小事（可以很小，像是跟新朋友說話、試試沒吃過的食物）。跟大人說說，然後試試看！回來告訴 Fina 你的感覺。",
    },
    natureCraft: {
      title: "勇氣護身符",
      description:
        "撿一顆小石頭，用水洗乾淨，曬乾。在上面貼一個小貼紙或用彩色筆畫一個你覺得代表勇敢的圖案。這是你的勇氣護身符，放在口袋裡帶著走。",
    },
    books: [
      { title: "大衛不可以", author: "David Shannon", reason: "關於犯錯和被愛，讓孩子知道嘗試的勇氣比完美更重要。" },
      { title: "菲菲生氣了", author: "Molly Bang", reason: "關於情緒和面對困難，如何找到自己的力量。" },
      { title: "阿文的小毯子", author: "Kevin Henkes", reason: "關於放下害怕，找到新的勇氣。" },
    ],
    badgeName: "勇氣煮湯師",
    parentNote: {
      theme: "勇氣與情緒——這個故事探討如何面對恐懼，讓孩子知道害怕是正常的，勇氣是害怕了還是去做。",
      skills: ["認識和說出自己的情緒", "理解勇氣不是不害怕", "用語言描述害怕和勇敢的感覺"],
      talkingPoint:
        "問孩子：你有沒有做過一件很害怕但後來很開心的事？大人也可以分享自己的故事——讓孩子知道大人也會害怕。",
    },
  },
  {
    slug: "night-glow-soup",
    title: "神秘的夜光湯",
    tagline: "光不只可以照亮外面，也可以讓心裡亮起來。",
    soupSlug: "night-glow",
    storyContent: `夜深了，森林裡一片安靜。月光透過湯湯屋的窗戶，在木地板上灑下銀色的光。

小狐狸 Fina 正躺在床上準備睡覺，忽然聽到廚房傳來「滴答、滴答」的聲音，還有一點淡淡的微光。

「是誰在廚房呢？」她悄悄走到廚房門口，發現湯鍋竟然在發光！不是火光的紅色，而是像螢火蟲一樣，柔柔的、藍色的光。

「咻！」一團火紅的光從火爐裡飄了出來——是火爐精靈 Poffy！「Fina，我感應到一種特別的魔法氣息！」

湯鍋裡的藍色光芒越來越亮，一道柔和的光慢慢升起。「你們好，我是 Sopo，湯鍋的守護者。當湯鍋充滿了溫暖和回憶，就會發出這樣的光。這道光是一種魔法，叫做——夜光湯。」

Poffy 帶回了一朵在黑暗中閃爍著藍色光芒的夜光花。Sopo 指向月亮葉，「它聞起來有月亮的清清香。」

小狐狸將夜光花和月亮葉放進湯鍋，泡泡都變成了一個個發光的小氣球。

最後，她用 Poffy 的光照了照湯譜，夜光符號閃閃發亮，放進去之後，「叮！」湯的顏色變得像夜晚的天空一樣，藍藍的，裡面有很多會發光的小光點。

小狐狸喝了一口，心裡亮了起來。Sopo 慢慢變回一道光，溫柔地說：「光不只可以照亮外面，也可以讓心裡亮起來喔。」`,
    ingredients: [
      {
        slug: "night-flower",
        name: "夜光花",
        description: "只在黑暗中發光，是夜光湯最主要的光的來源。",
        locationSlug: "magic-lab",
        locationName: "湯料魔法研究所",
        collection: {
          type: "choice",
          prompt: "Poffy 說：你有沒有在黑暗裡看到過什麼發光的東西？",
          options: [
            { text: "螢火蟲，在草叢裡閃閃發亮", finaResponse: "螢火蟲！牠們把黑夜變成了星星，跟夜光花一樣。" },
            { text: "夜晚的月亮，照亮了回家的路", finaResponse: "月亮的光是最溫柔的光，湯裡需要這個。" },
            { text: "家裡的小夜燈，讓人睡得安心", finaResponse: "小夜燈的光，就是那種讓心裡亮起來的感覺。" },
          ],
        },
      },
      {
        slug: "moon-leaf",
        name: "月亮葉",
        description: "有月亮清香的葉子，能讓湯的味道變得柔和、平靜。",
        locationSlug: "herbal-patch",
        locationName: "草藥花園",
        collection: {
          type: "riddle",
          prompt: "花園裡藏著一個關於月亮的謎語",
          riddle: {
            question: "我每天晚上都出現，有時圓有時彎，照亮黑夜的路，卻不說一句話。我是什麼？",
            answer: "月亮",
            hint: "Fina 說：抬頭看看夜晚的天空⋯⋯",
            finaResponse: "月亮！月亮葉就是月亮送給湯的禮物。",
          },
        },
      },
      {
        slug: "night-symbol",
        name: "夜光符號",
        description: "需要用光去照才能看見，讓湯有了神秘的魔力。",
        locationSlug: "brewing-shed",
        locationName: "熟成室",
        collection: {
          type: "secret",
          prompt: "Sopo 說：你心裡有沒有一個讓你感到溫暖的小光？",
          secret: {
            placeholder: "讓我心裡亮起來的是⋯⋯",
            finaResponse: "你說的這個，就是最特別的夜光符號。謝謝你告訴我。",
          },
        },
      },
    ],
    adventure: {
      title: "找一個讓心裡亮起來的東西",
      description:
        "今晚，在家裡找一個你覺得讓你感到溫暖或安心的東西（可以是一個玩具、一張照片、一條毯子）。告訴大人，這個東西為什麼讓你覺得心裡亮亮的。",
    },
    natureCraft: {
      title: "夜晚觀察日記",
      description:
        "天黑後，站在窗邊或外面，看看黑暗中有什麼東西在發光（月亮、路燈、星星、螢火蟲）。拿一張紙，把看到的用點點或線條畫下來，這是你的夜光地圖。",
    },
    books: [
      { title: "晚安，月亮", author: "Margaret Wise Brown", reason: "睡前最適合的故事，關於黑夜的安心感。" },
      { title: "星月", author: "David Wiesner", reason: "安靜的圖畫書，讓孩子感受夜晚的神秘與美麗。" },
      { title: "小黑魚", author: "Leo Lionni", reason: "在黑暗中找到自己的光，一起創造出更大的力量。" },
    ],
    badgeName: "夜光守護者",
    parentNote: {
      theme:
        "內在的光——光不只是物理現象，也存在於我們的心中。這個故事幫助孩子探索「安全感」和「內在力量」。",
      skills: ["認識並說出讓自己感到安心的事物", "探索黑夜的感官體驗", "建立對黑暗的好奇心而非恐懼"],
      talkingPoint: "問孩子：有沒有一件事或一個地方，讓你覺得心裡特別亮？大人也可以分享自己的答案。",
    },
  },
  {
    slug: "festival-soup",
    title: "湯湯屋的節慶湯",
    tagline: "把大家的味道加在一起，就會變成最溫暖的友誼湯。",
    soupSlug: "best-friend",
    storyContent: `森林裡，陽光灑在湯湯屋的屋頂上，今天是一年一度的「大家一起煮湯節」。

小狐狸 Fina 在門口迎接大家：「今天，我們要煮一鍋特別的湯——節慶湯！」

小松鼠 Milo 抱著一大籃亮晶晶的紅果子跑來：「這是我從花園裡摘來的，聞起來像太陽一樣溫暖！」

接著，一隻有著長長睫毛的小鹿 Luna，輕輕走到門口。她是遠方來的客人，有點害羞。「我……我帶來了這個，是家鄉的『會跳舞的花』。」那些花瓣在微風中輕輕晃動，真的像是在跳舞。

廚房裡傳來「碰！」的一聲。小鴨廚助 Tilly 衝出來，腳下一滑，香料像雪花一樣嘩啦啦地撒滿地板。「哎呀！我的微笑香料都灑了！」

Poffy 輕輕一揮，地上的香料全都飛了起來，在空中轉了幾個圈後，輕輕地飄進了湯鍋裡。

湯的顏色變得像彩虹一樣美麗。大家圍在大桌子旁，每個人都分到了一碗熱騰騰的湯。

小鹿 Luna 啜了一口，眼睛亮了起來，感覺像一個大大的擁抱，讓她一點也不覺得孤單了。

小狐狸說：「這碗湯的味道，是不是就是大家的味道加起來的呀？」大家笑著點頭。`,
    ingredients: [
      {
        slug: "sun-fruit",
        name: "太陽果",
        description: "溫暖和家的味道，讓湯擁有溫暖的能量。",
        locationSlug: "herbal-patch",
        locationName: "草藥花園",
        collection: {
          type: "choice",
          prompt: "Milo 說：你有沒有想到，朋友帶給你的感覺像什麼？",
          options: [
            { text: "像太陽，溫暖讓人開心", finaResponse: "對！好朋友就是那種讓你感覺暖暖的人。" },
            { text: "像雨後的彩虹，讓人驚喜", finaResponse: "有朋友在，每天都有彩虹！" },
            { text: "像一個大擁抱，讓人安心", finaResponse: "擁抱的感覺，就是最好的太陽果。" },
          ],
        },
      },
      {
        slug: "dancing-flower",
        name: "會跳舞的花",
        description: "代表獨特和美麗，讓湯充滿驚喜。",
        locationSlug: "ingredient-woods",
        locationName: "湯料森林",
        collection: {
          type: "riddle",
          prompt: "Luna 說：這個謎語是從她家鄉帶來的",
          riddle: {
            question: "我不用說話，也不用唱歌，但當風來的時候，我就會動起來，讓大家笑。我是什麼？",
            answer: "花",
            hint: "Luna 輕輕吹了一口氣，花瓣動了⋯⋯",
            finaResponse: "花！會跳舞的花，每一朵都是獨一無二的。就像每個朋友。",
          },
        },
      },
      {
        slug: "smile-spice",
        name: "微笑香料",
        description: "代表快樂和笑聲，讓湯充滿歡樂的氣息。",
        locationSlug: "soup-house",
        locationName: "湯湯屋",
        collection: {
          type: "secret",
          prompt: "Tilly 說：告訴我一件讓你笑出來的事（可以是很小的事）",
          secret: {
            placeholder: "最近讓我笑出來的事是⋯⋯",
            finaResponse: "哈哈哈！這個故事就是最好的微笑香料！",
          },
        },
      },
    ],
    adventure: {
      title: "你帶來什麼味道？",
      description:
        "如果你也要參加節慶湯，你會帶來什麼材料？跟大人說說，你帶來的那個東西代表你什麼樣的個性或故事。也可以問大人，他們會帶什麼來。",
    },
    natureCraft: {
      title: "友誼湯食譜",
      description:
        "拿一張紙，跟大人一起設計一個「我們家的友誼湯食譜」——每個人選一樣代表自己的材料（可以是食物、顏色、感覺），寫下來或畫下來。",
    },
    books: [
      { title: "你是我最好的朋友", author: "Sam McBratney", reason: "關於友誼的溫暖，適合睡前一起讀。" },
      { title: "不一樣的我", author: "Todd Parr", reason: "每個人都有獨特之處，加在一起更美好。" },
      { title: "傳統市場裡的一天", author: "陳致元", reason: "不同的人帶來不同的東西，共同構成美好的日常。" },
    ],
    badgeName: "友誼大廚",
    parentNote: {
      theme:
        "分享與合作——這個故事探討團結的力量，每個人的獨特貢獻加在一起，創造出比單獨更美好的東西。",
      skills: ["認識自己的獨特之處", "理解每個人的貢獻都有價值", "練習分享和接納不同的人"],
      talkingPoint:
        "問孩子：你覺得我們家每個人帶來的「味道」是什麼？你自己呢？這個問題沒有標準答案，重要的是讓孩子感受到自己的獨特性。",
    },
  },
  {
    slug: "fresh-soup",
    title: "會唱歌的薄荷",
    tagline: "靜下心來，專心聽，就能聽到世界最美的聲音。",
    soupSlug: "slowly-warm",
    storyContent: `森林裡的草藥花園，是小松鼠 Milo 最喜歡的地方。今天花園裡特別吵——小鳥們嘰嘰喳喳，蜜蜂們嗡嗡地忙著採蜜。

「太吵了啦！」Milo 抓了抓耳朵，感覺又亂又煩。

他坐在花園的角落，沮喪地垂著頭。這時，他聽到一個非常非常小、像風鈴一樣清脆的聲音。「叮…」

Milo 安靜地聽著，循著聲音找啊找，最後發現聲音是從一片薄荷葉裡傳出來的！

他立刻跑回湯湯屋。小鹿 Luna 也在，她因為耳朵靈敏，對吵雜也感到困擾。

Poffy 溫柔地說：「這是薄荷的歌，它能讓吵雜變安靜。」

小狐狸 Fina 想到一個好主意：「我們用它來煮一碗清新湯吧！」還加入了「跳舞百里香」——當它聽到安靜的聲音，就會在湯裡跳起舞來。

湯鍋裡發出很輕、很有節奏的聲音，不再是吵鬧的聲音。

Milo 喝了一口，感覺耳朵和心都變得很乾淨、很專注。

他們把湯灑在花園的泥土上。「叮！」所有的花朵和草葉都發出了自己的聲音。花園裡不再吵雜，而是一首美妙的合唱曲。

Milo 看著這一切，心裡變得安靜又快樂。`,
    ingredients: [
      {
        slug: "singing-mint",
        name: "會唱歌的薄荷",
        description: "能讓吵鬧變得安靜，幫助大家聽清楚內心的聲音。",
        locationSlug: "herbal-patch",
        locationName: "草藥花園",
        collection: {
          type: "choice",
          prompt: "Milo 說：當你靜下來，你最喜歡聽什麼聲音？",
          options: [
            { text: "雨聲，滴滴答答的", finaResponse: "雨聲！每一滴都在唱不同的歌，你的耳朵很厲害。" },
            { text: "風吹過樹葉的沙沙聲", finaResponse: "沙沙聲是大樹在說話，你聽到了它的故事。" },
            { text: "什麼都不說的安靜", finaResponse: "安靜也是一種聲音，也許是世界在深呼吸。" },
          ],
        },
      },
      {
        slug: "dancing-thyme",
        name: "跳舞百里香",
        description: "當環境安靜下來，它就會快樂地舞動，把安靜轉化成活潑的節奏。",
        locationSlug: "ingredient-woods",
        locationName: "湯料森林",
        collection: {
          type: "riddle",
          prompt: "Luna 在筆記本上寫了一個謎語",
          riddle: {
            question: "我不用腳，也能跳舞。當音樂響起，我就動起來。當一切安靜，我也慢慢停下來休息。我是什麼？",
            answer: "葉子",
            hint: "想想看，風吹來的時候，什麼東西會跟著動⋯⋯",
            finaResponse: "葉子！跳舞百里香的葉子，在安靜裡跳了最美的舞。",
          },
        },
      },
      {
        slug: "quiet-drop",
        name: "安靜露珠",
        description: "一顆收集了清晨安靜的露珠，讓湯有了最清澈的底味。",
        locationSlug: "magic-lab",
        locationName: "湯料魔法研究所",
        collection: {
          type: "secret",
          prompt: "湯料魔法研究所說：說一件你今天注意到的、很小很小的聲音",
          secret: {
            placeholder: "我今天聽到一個很小的聲音⋯⋯",
            finaResponse: "你聽到了！這個小聲音，就是最珍貴的露珠。",
          },
        },
      },
    ],
    adventure: {
      title: "一分鐘的安靜",
      description:
        "找一個舒服的地方坐下來，閉上眼睛，安靜一分鐘。只用耳朵聽。結束後，告訴大人你聽到了幾種聲音，哪一個是最小的？哪一個是最意外的？",
    },
    natureCraft: {
      title: "聲音收集罐",
      description:
        "拿一個小瓶子或罐子，在紙條上寫下（或請大人幫你寫）今天聽到的三個聲音，捲成小紙捲放進罐子裡。這是你的聲音收集罐。",
    },
    books: [
      { title: "安靜", author: "Deborah Underwood", reason: "用圖畫探索不同種類的安靜，讓孩子重新認識寂靜的美。" },
      { title: "森林裡的音樂會", author: "Robin Page", reason: "自然界的聲音，讓孩子注意生活中被忽略的聲音。" },
      { title: "小小的我", author: "佐野洋子", reason: "安靜地感受自己的存在，很適合放慢腳步的夜晚。" },
    ],
    badgeName: "靜心聆聽者",
    parentNote: {
      theme: "聆聽與專注——這個故事探討如何在吵雜中找到安靜，練習專注和情緒調節。",
      skills: ["練習靜下來的能力", "用聽覺探索環境", "把情緒從煩躁轉為平靜"],
      talkingPoint:
        "跟孩子一起做「安靜遊戲」：兩個人都不說話，看看能聽到幾種聲音。結束後分享，你們聽到一樣的嗎？",
    },
  },
  {
    slug: "honey-soup",
    title: "迷路的蜂蜜葉",
    tagline: "當眼睛找不到東西時，鼻子也能當偵探。",
    soupSlug: "forest-dew",
    storyContent: `早晨，小松鼠 Milo 在花園裡照顧一棵特別的植物——蜂蜜葉。再過一個星期，就是小蜜蜂們的採蜜節，他要用這片葉子煮一鍋蜂蜜湯！

可是，一陣調皮的風把最飽滿的蜂蜜葉吹得飛進了花園深處的灌木叢裡。「哎呀！」Milo 著急得快要哭了。

小鳥 Pipit 飛下來，立刻去找智慧的貓頭鷹 Meelo。

Meelo 耐心地說：「孩子，當我們的眼睛找不到東西時，鼻子也能當偵探！閉上眼睛，專心聞。你要找的味道，是最甜、最溫暖的。」

大家一起在灌木叢邊聞啊聞。「嗯，好臭的味道！」是卷卷臭襪怪藏了一個臭氣蘑菇。「這裡有甜甜的餅乾味！」但仔細一聞，不像蜂蜜葉。

Pipit 提醒：「小心！這些都是香氣陷阱！」

Milo 深深吸了一口氣，閉上眼睛，專心聞著。在所有亂七八糟的味道中，他聞到了一股最特別、最溫暖、最香甜的氣息。

「是這裡！」Milo 大喊，撥開灌木叢，蜂蜜葉安安靜靜地躺在那裡。

他們煮了一鍋香甜的蜂蜜湯，送到小蜜蜂的家。小蜜蜂們喝著湯，發出滿足的「嗡嗡」聲，好像在唱歌：「謝謝你們！」`,
    ingredients: [
      {
        slug: "honey-leaf",
        name: "蜂蜜葉",
        description: "甜蜜與真實的象徵，能帶來安心和力量，是蜂蜜湯的核心材料。",
        locationSlug: "herbal-patch",
        locationName: "草藥花園",
        collection: {
          type: "choice",
          prompt: "Milo 說：閉上眼睛，想想蜂蜜的味道。它讓你想到什麼？",
          options: [
            { text: "甜甜的，像夏天的陽光", finaResponse: "對！蜂蜜葉就是把陽光的甜收起來了。" },
            { text: "黏黏的，像媽媽的擁抱", finaResponse: "甜蜜的擁抱！蜂蜜葉收到你的感覺了。" },
            { text: "溫暖的，像喝下去之後從肚子裡暖起來", finaResponse: "那種從裡面暖起來的感覺，就是蜂蜜的魔法。" },
          ],
        },
      },
      {
        slug: "stinky-mushroom",
        name: "臭氣蘑菇（陷阱！）",
        description: "有強烈氣味的搗蛋鬼，會混淆你的鼻子。",
        locationSlug: "ingredient-woods",
        locationName: "湯料森林",
        collection: {
          type: "riddle",
          prompt: "Pipit 說：香氣偵探要先學會分辨陷阱！這是一個關於「假」的謎語",
          riddle: {
            question: "我看起來很可愛，聞起來很甜，但我不是你要找的東西。我是來考驗你的。我是什麼？",
            answer: "陷阱",
            hint: "Meelo 說：不是所有甜的都是你要的⋯⋯",
            finaResponse: "你識破了！真正的偵探知道，不是所有香味都是線索。",
          },
        },
      },
      {
        slug: "real-sweet",
        name: "真正的甜",
        description: "專心找到的那個味道，最真實、最有價值。",
        locationSlug: "magic-lab",
        locationName: "湯料魔法研究所",
        collection: {
          type: "secret",
          prompt: "Meelo 說：閉上眼睛，告訴我你最喜歡的甜味是什麼",
          secret: {
            placeholder: "我最喜歡的甜味是⋯⋯",
            finaResponse: "你找到了！那個味道，就是你的蜂蜜葉。",
          },
        },
      },
    ],
    adventure: {
      title: "鼻子偵探任務",
      description:
        "請大人準備三個東西讓你聞（不能看！），猜猜看是什麼。然後換你準備給大人聞。每猜對一個，就在紙上畫一顆星星。",
    },
    natureCraft: {
      title: "氣味比較實驗",
      description:
        "找三樣不同的葉子或花（或廚房的香料），把它們排成一排。用手輕輕搓一下，聞聞看有什麼不同。拿一張紙，用線條或顏色畫出每個氣味給你的感覺。",
    },
    books: [
      { title: "鼻子書", author: "Al Perkins", reason: "有趣地探索鼻子的功能，適合年紀小的孩子。" },
      { title: "夏洛的網", author: "E.B. White", reason: "關於專注和努力，堅持找到真正重要的事。" },
      { title: "小偵探艾蜜莉", author: "Sibéyran", reason: "用好奇心和觀察力解決問題，鼓勵孩子成為生活的偵探。" },
    ],
    badgeName: "香味偵探長",
    parentNote: {
      theme:
        "感官辨識與專注——這個故事探討如何排除干擾，找到真正的目標，練習感官覺察和情緒調節。",
      skills: ["運用嗅覺探索環境", "分辨和描述不同的氣味", "在干擾中保持專注"],
      talkingPoint: "跟孩子做「聞一聞猜猜看」的遊戲，然後問：你怎麼知道是這個？你的鼻子告訴你什麼？",
    },
  },
  {
    slug: "seed-soup",
    title: "石頭的秘密",
    tagline: "每一個偉大的故事，都從一個小小的開始。",
    soupSlug: "sprouting",
    storyContent: `早晨，小鳥 Pipit 像往常一樣在森林裡傳遞訊息。飛過森林入口時，他發現了一件奇怪的事——那裡有一塊長滿青苔的大石頭，今天竟然裂開了一條細縫，從縫隙裡透出淡淡的光。

 Pipit 感覺到一股溫暖的氣息，就像湯湯屋裡湯鍋冒出的香味。他立刻飛回去告訴大家。

貓頭鷹 Meelo 從「說故事樹」的枝頭飛了下來，溫厚地說：「這是遠古的守護石頭。很久很久以前，森林裡的第一碗湯，不是從材料煮出來的，而是來自一顆沉睡的——湯之種子。」

Meelo 拿出一張閃著金色光芒的「守護石頭卡」：「只有真心守護湯湯屋的人，才能讓種子甦醒。」

小狐狸接過卡片，輕輕放進石頭的縫隙裡。石頭慢慢裂開，一顆閃著金光的小小種子像星星一樣飄了出來。

Poffy 拿出一口小鍋子，Fina 把種子放進去。沒有水，也沒有材料，可是一碗香氣四溢的湯從種子裡冒了出來。

這碗湯的味道，像森林在對他們輕聲說話，像所有故事都在這碗湯裡一起醒過來。

Fina 翻開魔法湯譜，發現上面早就寫著：「所有湯的源頭，來自一顆沉睡在石頭裡的種子。當它甦醒，新的一頁就會展開。」`,
    ingredients: [
      {
        slug: "soup-seed",
        name: "湯之種子",
        description: "所有湯魔法的根源，雖然小小一顆，卻能釀出無窮的故事與能量。",
        locationSlug: "forest-post",
        locationName: "森林郵局",
        collection: {
          type: "choice",
          prompt: "Meelo 說：你覺得一顆種子裡，藏著什麼？",
          options: [
            { text: "一棵大樹，還沒長出來而已", finaResponse: "對！每顆種子裡都有一棵大樹在等待。就像每個故事的開始。" },
            { text: "一個秘密，等待有人發現", finaResponse: "種子的秘密，要等到它長大才知道。" },
            { text: "很多很多的可能，還沒決定要變成什麼", finaResponse: "可能！那是最美好的答案。種子什麼都有可能。" },
          ],
        },
      },
      {
        slug: "guardian-stone",
        name: "守護石頭碎片",
        description: "保護著湯之種子，只有用心守護的人才能讓石頭裂開。",
        locationSlug: "observation-post",
        locationName: "森林觀察站",
        collection: {
          type: "riddle",
          prompt: "Pipit 在觀察站發現了一個謎語",
          riddle: {
            question: "我很重，我很硬，但我保護著很軟的東西。我在外面，它在裡面。我是什麼？",
            answer: "石頭",
            hint: "Pipit 說：想想蛋是什麼保護的⋯⋯（提示：石頭跟蛋殼一樣的功能）",
            finaResponse: "石頭！守護石頭就是這樣，外表硬，但裡面藏著最珍貴的東西。",
          },
        },
      },
      {
        slug: "story-record",
        name: "湯譜記錄",
        description: "記下屬於你的故事，讓種子的魔法延續下去。",
        locationSlug: "soup-house",
        locationName: "湯湯屋",
        collection: {
          type: "secret",
          prompt: "Fina 說：你有沒有一個很小的開始，後來變成很重要的事？",
          secret: {
            placeholder: "有一次，從一件小事開始⋯⋯",
            finaResponse: "你說的這個，就是你的湯之種子。謝謝你告訴我。",
          },
        },
      },
    ],
    adventure: {
      title: "找一顆種子",
      description:
        "去外面找一顆種子（或果核、或任何小小的東西）。把它帶回家，放在一個你看得到的地方。每天看著它，想想：它裡面藏著什麼？如果它發芽了，會長成什麼？",
    },
    natureCraft: {
      title: "種下一顆種子",
      description:
        "找一個小容器（杯子、瓶子都可以），放進一點泥土，埋下一顆種子（豆子、花籽都可以）。每天澆一點點水，觀察它的變化。這是你的「故事種子」。",
    },
    books: [
      { title: "一顆種子", author: "Eric Carle", reason: "從種子到花的旅程，充滿希望和生命力。" },
      { title: "植物的秘密生活", author: "Peter Wohlleben", reason: "適合大一點的孩子和大人一起讀，探索植物的奇妙世界。" },
      { title: "傑克與魔豆", author: "傳統故事", reason: "一顆種子開啟的大冒險，充滿想像力。" },
    ],
    badgeName: "種子守護者",
    parentNote: {
      theme:
        "起源與希望——這個故事探索一切事物的開始，鼓勵孩子相信自己的想法和潛力，因為每個偉大的故事都從小開始。",
      skills: ["培養對自然和生命的好奇心", "理解成長需要時間和耐心", "相信小小的開始有大大的可能"],
      talkingPoint:
        "問孩子：你覺得你自己的「種子」是什麼？（可以是一個夢想、一件想做的事、一個你在學習的東西）大人也可以分享自己的答案。",
    },
  },
  {
    slug: "surprise-soup",
    title: "風中的香囊",
    tagline: "生活裡的每一個意外，都可能是驚喜的開始。",
    soupSlug: "wish",
    storyContent: `森林裡，風輕輕地吹著。小鳥 Pipit 正忙著送信，忽然看到一個色彩斑斕的小東西在空中忽上忽下，好像在跟他玩遊戲。

他追了過去，終於在一處安靜的空地上把它接住了。那是一個小小的香囊，上面繡著奇特的圖案，聞起來有好多種花香混合在一起。

Pipit 捧著香囊飛回湯湯屋，大家都被吸引了過來。

貓頭鷹 Meelo 說：「從遠方隨風而來的東西，常常會帶著奇特的魔法。打開香囊時要小心，因為驚喜有時也會淘氣。」

Fina 小心翼翼地撥開了香囊的繫帶。「呼——！」一團白色煙霧衝了出來，帶著微酸的味道。「哈啾！」大家齊聲打了個噴嚏，笑聲在湯湯屋裡響起。

煙霧散去後，香囊裡靜靜掉出一片晶瑩剔透的葉子，上頭掛著一顆像糖果一樣的露珠。

「這是驚喜葉！它能讓湯的味道變得奇妙無比，每一口都不一樣。」

大家喝了湯，每個人喝到的味道都不同——酸酸的檸檬、甜甜的蜂蜜、溫暖的擁抱。

小狐狸笑著說：「原來，驚喜就是這樣——每個人都不一樣，但一起分享，就會變得更快樂。」`,
    ingredients: [
      {
        slug: "surprise-leaf",
        name: "驚喜葉",
        description: "放進湯裡後，能讓湯的味道隨著每一口而改變，充滿意外。",
        locationSlug: "soupling-stream",
        locationName: "湯湯小河",
        collection: {
          type: "choice",
          prompt: "Pipit 說：如果你打開一個神秘的包裹，你最希望裡面是什麼？",
          options: [
            { text: "一個會發光的東西", finaResponse: "發光的驚喜！你把這個想法放進湯裡了。" },
            { text: "一封來自遠方朋友的信", finaResponse: "信件！驚喜葉也是風從遠方帶來的，就像一封信。" },
            { text: "一樣沒有見過的新奇東西", finaResponse: "新奇的東西！驚喜葉每次都會帶來不一樣的味道。" },
          ],
        },
      },
      {
        slug: "scent-bag",
        name: "香囊",
        description: "只有被風帶來時才能找到，裡面可能藏著魔法，也可能藏著淘氣。",
        locationSlug: "forest-post",
        locationName: "森林郵局",
        collection: {
          type: "riddle",
          prompt: "Meelo 說：這個謎語關於驚喜",
          riddle: {
            question: "我在你打開之前是個秘密，打開之後就不是了。但打開的那一刻，總是讓人又期待又緊張。我是什麼？",
            answer: "驚喜",
            hint: "Pipit 說：生日的時候你會拆什麼？",
            finaResponse: "驚喜！香囊就是這樣，打開之前永遠不知道裡面是什麼。",
          },
        },
      },
      {
        slug: "sneeze-cloud",
        name: "淘氣煙霧",
        description: "會讓人打噴嚏的白色小雲，帶著歡笑和酸酸的氣息。",
        locationSlug: "magic-lab",
        locationName: "湯料魔法研究所",
        collection: {
          type: "secret",
          prompt: "Poffy 說：你有沒有一次被驚喜到笑出來的經驗？",
          secret: {
            placeholder: "有一次讓我又驚訝又開心的事⋯⋯",
            finaResponse: "哈哈哈！那個驚喜，就是最好的淘氣煙霧！",
          },
        },
      },
    ],
    adventure: {
      title: "製造一個小驚喜",
      description:
        "幫家裡的一個人製造一個小驚喜——可以是畫一張卡片、偷偷幫他做一件小事、或是找一樣他喜歡的東西放在他會看到的地方。不用很大，小小的就夠了。",
    },
    natureCraft: {
      title: "驚喜香囊",
      description:
        "找一個小布袋或用手帕包起來，放進幾樣有香味的東西（乾花、橘子皮、肉桂棒）。綁起來做成香囊，送給家裡的人或放在枕頭旁邊。",
    },
    books: [
      { title: "驚喜！", author: "Sylvia van Ommen", reason: "無字圖畫書，讓孩子自己感受驚喜的過程。" },
      { title: "愛心樹", author: "Shel Silverstein", reason: "關於給予和接受，每次讀都有新的感受。" },
      { title: "跑跑鎮", author: "麥克·葛雷哥", reason: "充滿意外和驚喜的小鎮故事，讓孩子期待生活的意外。" },
    ],
    badgeName: "驚喜製造者",
    parentNote: {
      theme:
        "驚喜與未知——這個故事幫助孩子學會以開放的心態面對意外，把「不知道」變成期待而非恐懼。",
      skills: ["對未知保持好奇而非焦慮", "學習給予和讓他人快樂", "用想像力面對不確定的事情"],
      talkingPoint: "問孩子：你有沒有一次以為會不好，結果卻出乎意料的好？大人也可以分享自己的驚喜故事。",
    },
  },
  {
    slug: "adventure-soup",
    title: "湯湯屋大冒險",
    tagline: "每一種味道，都是一段冒險。加在一起，就是屬於大家的故事。",
    soupSlug: "big-adventure",
    storyContent: `湯湯屋裡，大家都回來了。

小狐狸 Fina 站在湯鍋前，開心地看著大家。「歡迎回來！」

Milo 抱著香香的草藥跑進來，Luna 帶來柔柔的花，Pipit 把香囊掛在窗邊，Meelo 靜靜放下一顆微微發光的種子。Lilo 已經把所有材料排得整整齊齊。

Poffy 輕輕吹了一口氣。火亮了起來。「來吧，我們開始煮湯。」

大家一個一個，把材料放進鍋裡。「這是我在花園找到的！」「這個聞起來最甜！」「這個會發光喔！」

咕嚕、咕嚕、咕嚕。

就在這時，小鴨廚助 Tilly 忙著幫忙，一不小心踩到湯匙，手一滑，一整把調味料掉進去了！

湯冒出一大團奇怪的泡泡，味道一下子變得亂亂的——有點太甜，又有點太酸。

Fina 靜靜地看著湯，輕輕說：「也許……冒險不是把全部都放進去。而是選一個——你最記得的味道。」

大家慢慢地笑了。每個人選了自己最記得的那一樣放進去。

這一次，湯變得清清的、暖暖的。湯裡好像出現了畫面——有在花園唱歌的薄荷、在森林找到的種子、在風裡飄來的香氣。

Poffy 輕聲說：「這不是普通的湯。這是我們的冒險。」

遠方的魔法湯譜石，慢慢亮了起來，一點一點，閃閃發光。

大家喝了湯，每個人喝到的都是自己的記憶——第一次找回香味的那天、在花園裡跑來跑去的味道、風的味道。

大家看著彼此，笑了。`,
    ingredients: [
      {
        slug: "best-memory",
        name: "最記得的味道",
        description: "從所有冒險裡，選一個你最記得的味道。",
        locationSlug: "soup-house",
        locationName: "湯湯屋",
        collection: {
          type: "choice",
          prompt: "Fina 說：你最記得我們一起找到的哪一個味道？",
          options: [
            { text: "記憶香香湯的溫暖棉被味", finaResponse: "那個味道！你把它帶回來了，謝謝你。" },
            { text: "蜂蜜葉的甜甜香氣", finaResponse: "蜂蜜葉！Milo 一定很開心你記得。" },
            { text: "風吹過來的驚喜葉香氣", finaResponse: "風的味道！它還在這裡，你聞到了。" },
          ],
        },
      },
      {
        slug: "journey-herb",
        name: "旅途草藥",
        description: "一路走來採集的，每一樣都是一個小故事。",
        locationSlug: "herbal-patch",
        locationName: "草藥花園",
        collection: {
          type: "riddle",
          prompt: "Milo 在草藥花園最後一次藏了一個謎語",
          riddle: {
            question: "我走過很多地方，每個地方都留下一點味道。把我全部加起來，就是整段旅途的故事。我是什麼？",
            answer: "記憶",
            hint: "Fina 說：不是地圖，不是照片，但它讓你永遠記得走過哪裡⋯⋯",
            finaResponse: "記憶！旅途草藥就是用記憶做成的，你答對了。",
          },
        },
      },
      {
        slug: "shared-story",
        name: "大家的故事",
        description: "把所有人的故事放在一起，就是最好的湯。",
        locationSlug: "character-grove",
        locationName: "角色角",
        collection: {
          type: "secret",
          prompt: "Fina 最後問你：這一路上，你最喜歡哪一個故事？為什麼？",
          secret: {
            placeholder: "我最喜歡的是⋯⋯因為⋯⋯",
            finaResponse: "謝謝你告訴我。你的故事，永遠是湯湯屋最珍貴的材料。",
          },
        },
      },
    ],
    adventure: {
      title: "我們的冒險湯",
      description:
        "跟大人一起回想：這段時間，你們最喜歡做的一件事是什麼？把它畫下來或說出來，貼在家裡看得到的地方。這是你們的冒險記錄。",
    },
    natureCraft: {
      title: "記憶材料罐",
      description:
        "找一個大罐子，把這段時間收集的小東西放進去——壓乾的葉子、小石頭、畫的圖、寫的字條。這是你們的記憶材料罐，每次打開都是一次回憶。",
    },
    books: [
      { title: "野獸國", author: "Maurice Sendak", reason: "一場冒險，最後回到最溫暖的地方——家。" },
      { title: "小王子", author: "Antoine de Saint-Exupéry", reason: "旅途中遇到的每一個人都教了我們一些事。" },
      { title: "再見了，湯湯屋（自己寫）", author: "你和你的孩子", reason: "這一集結束後，可以跟孩子一起寫（或畫）你們的故事。" },
    ],
    badgeName: "大冒險完成者",
    parentNote: {
      theme: "回顧與珍惜——這是最後一個故事，幫助孩子整理和珍惜一路上的經歷，學會把記憶變成禮物。",
      skills: ["回顧和整理自己的經歷", "把記憶用語言或創作表達出來", "感謝和珍惜共同的時光"],
      talkingPoint:
        "問孩子：如果要你選一件這段時間最喜歡的事，你會選什麼？大人也說說自己的答案。然後一起說：謝謝你陪我做這些事。",
    },
  },
]

export function getThemeBySlug(slug: string): Theme | undefined {
  return themes.find((t) => t.slug === slug)
}
