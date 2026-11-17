(() => {
  const app = globalThis.Komorebi;
  const records = [
    {
      "id": "sunday-1",
      "title": "牽著手出門",
      "description": "草地上的星期天裡的一張攝影示意。",
      "capturedAt": "2026-11-15",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "sunday"
      ],
      "memoryId": "sunday",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "野餐",
        "散步"
      ],
      "image": "family",
      "alt": "一家人牽手走過草地",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "sunday-2",
      "title": "攤開野餐布",
      "description": "草地上的星期天裡的一張攝影示意。",
      "capturedAt": "2026-11-16",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "sunday"
      ],
      "memoryId": "sunday",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "野餐",
        "散步"
      ],
      "image": "picnic",
      "alt": "草地野餐示意",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "sunday-3",
      "title": "草地上的背影",
      "description": "草地上的星期天裡的一張攝影示意。",
      "capturedAt": "2026-11-17",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "sunday"
      ],
      "memoryId": "sunday",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "野餐",
        "散步"
      ],
      "image": "siblings",
      "alt": "兩個孩子手牽手走在田野",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "sunday-4",
      "title": "樹下的散步",
      "description": "草地上的星期天裡的一張攝影示意。",
      "capturedAt": "2026-11-15",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "sunday"
      ],
      "memoryId": "sunday",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "野餐",
        "散步"
      ],
      "image": "park",
      "alt": "灑滿日光的公園步道",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "sunday-5",
      "title": "回家前的合影",
      "description": "草地上的星期天裡的一張攝影示意。",
      "capturedAt": "2026-11-16",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "sunday"
      ],
      "memoryId": "sunday",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "野餐",
        "散步"
      ],
      "image": "walk",
      "alt": "大人扶著幼兒走過草地",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "first-months-1",
      "title": "睡著的午後",
      "description": "小柚的第一本裡的一張攝影示意。",
      "capturedAt": "2026-04-17",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "first-months"
      ],
      "memoryId": "first-months",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "新生兒",
        "午睡"
      ],
      "image": "nap",
      "alt": "在毯子上熟睡的嬰兒",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "first-months-2",
      "title": "放在掌心的小鞋",
      "description": "小柚的第一本裡的一張攝影示意。",
      "capturedAt": "2026-04-18",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "first-months"
      ],
      "memoryId": "first-months",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "新生兒",
        "午睡"
      ],
      "image": "shoes",
      "alt": "手掌捧著一雙白色寶寶鞋",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "first-months-3",
      "title": "小腳還在動",
      "description": "小柚的第一本裡的一張攝影示意。",
      "capturedAt": "2026-04-19",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "first-months"
      ],
      "memoryId": "first-months",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "新生兒",
        "午睡"
      ],
      "image": "feet",
      "alt": "嬰兒的小腳與連身衣",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "first-months-4",
      "title": "毯子裡的安靜",
      "description": "小柚的第一本裡的一張攝影示意。",
      "capturedAt": "2026-04-17",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "first-months"
      ],
      "memoryId": "first-months",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "新生兒",
        "午睡"
      ],
      "image": "blanket",
      "alt": "熟睡的嬰兒與柔軟毯子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "first-months-5",
      "title": "伸手碰一碰",
      "description": "小柚的第一本裡的一張攝影示意。",
      "capturedAt": "2026-04-18",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "first-months"
      ],
      "memoryId": "first-months",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "新生兒",
        "午睡"
      ],
      "image": "crib",
      "alt": "伸手拿積木的孩子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "six-1",
      "title": "六支蠟燭",
      "description": "六歲的蠟燭裡的一張攝影示意。",
      "capturedAt": "2026-08-08",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "six"
      ],
      "memoryId": "six",
      "categoryIds": [
        "birthday"
      ],
      "tags": [
        "蛋糕",
        "生日"
      ],
      "image": "cake",
      "alt": "點著蠟燭的蛋糕",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "six-2",
      "title": "點亮以前",
      "description": "六歲的蠟燭裡的一張攝影示意。",
      "capturedAt": "2026-08-09",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "six"
      ],
      "memoryId": "six",
      "categoryIds": [
        "birthday"
      ],
      "tags": [
        "蛋糕",
        "生日"
      ],
      "image": "candles",
      "alt": "為蛋糕點蠟燭的雙手",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "six-3",
      "title": "桌角的積木",
      "description": "六歲的蠟燭裡的一張攝影示意。",
      "capturedAt": "2026-08-10",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "six"
      ],
      "memoryId": "six",
      "categoryIds": [
        "birthday"
      ],
      "tags": [
        "蛋糕",
        "生日"
      ],
      "image": "blocks",
      "alt": "孩子的手與木積木",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "six-4",
      "title": "拆開小禮物",
      "description": "六歲的蠟燭裡的一張攝影示意。",
      "capturedAt": "2026-08-08",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "six"
      ],
      "memoryId": "six",
      "categoryIds": [
        "birthday"
      ],
      "tags": [
        "蛋糕",
        "生日"
      ],
      "image": "toy",
      "alt": "木製形狀配對玩具",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "six-5",
      "title": "聚在沙發上",
      "description": "六歲的蠟燭裡的一張攝影示意。",
      "capturedAt": "2026-08-09",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "six"
      ],
      "memoryId": "six",
      "categoryIds": [
        "birthday"
      ],
      "tags": [
        "蛋糕",
        "生日"
      ],
      "image": "story",
      "alt": "在沙發上共讀的親子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "coast-1",
      "title": "沙丘那條路",
      "description": "去海邊那天裡的一張攝影示意。",
      "capturedAt": "2026-09-20",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "coast"
      ],
      "memoryId": "coast",
      "categoryIds": [
        "travel"
      ],
      "tags": [
        "海邊",
        "旅行"
      ],
      "image": "coast",
      "alt": "穿過沙丘通往海邊的小路",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "coast-2",
      "title": "一起出門",
      "description": "去海邊那天裡的一張攝影示意。",
      "capturedAt": "2026-09-21",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "coast"
      ],
      "memoryId": "coast",
      "categoryIds": [
        "travel"
      ],
      "tags": [
        "海邊",
        "旅行"
      ],
      "image": "family",
      "alt": "一家人牽手走過草地",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "coast-3",
      "title": "沿途走走",
      "description": "去海邊那天裡的一張攝影示意。",
      "capturedAt": "2026-09-22",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "coast"
      ],
      "memoryId": "coast",
      "categoryIds": [
        "travel"
      ],
      "tags": [
        "海邊",
        "旅行"
      ],
      "image": "walk",
      "alt": "大人扶著幼兒走過草地",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "coast-4",
      "title": "野餐的地方",
      "description": "去海邊那天裡的一張攝影示意。",
      "capturedAt": "2026-09-20",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "coast"
      ],
      "memoryId": "coast",
      "categoryIds": [
        "travel"
      ],
      "tags": [
        "海邊",
        "旅行"
      ],
      "image": "picnic",
      "alt": "草地野餐示意",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "coast-5",
      "title": "風裡的小路",
      "description": "去海邊那天裡的一張攝影示意。",
      "capturedAt": "2026-09-21",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "coast"
      ],
      "memoryId": "coast",
      "categoryIds": [
        "travel"
      ],
      "tags": [
        "海邊",
        "旅行"
      ],
      "image": "park",
      "alt": "灑滿日光的公園步道",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "forest-1",
      "title": "樹影下的小徑",
      "description": "小晴的森林地圖裡的一張攝影示意。",
      "capturedAt": "2026-10-10",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "forest"
      ],
      "memoryId": "forest",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "落葉",
        "散步"
      ],
      "image": "forest",
      "alt": "林間小路上的孩子",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "forest-2",
      "title": "走過木橋",
      "description": "小晴的森林地圖裡的一張攝影示意。",
      "capturedAt": "2026-10-11",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "forest"
      ],
      "memoryId": "forest",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "落葉",
        "散步"
      ],
      "image": "bridge",
      "alt": "穿過林間步道的孩子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "forest-3",
      "title": "落葉的路",
      "description": "小晴的森林地圖裡的一張攝影示意。",
      "capturedAt": "2026-10-12",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "forest"
      ],
      "memoryId": "forest",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "落葉",
        "散步"
      ],
      "image": "park",
      "alt": "灑滿日光的公園步道",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "forest-4",
      "title": "一段背影",
      "description": "小晴的森林地圖裡的一張攝影示意。",
      "capturedAt": "2026-10-10",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "forest"
      ],
      "memoryId": "forest",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "落葉",
        "散步"
      ],
      "image": "siblings",
      "alt": "兩個孩子手牽手走在田野",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "forest-5",
      "title": "回家搭出地圖",
      "description": "小晴的森林地圖裡的一張攝影示意。",
      "capturedAt": "2026-10-11",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "forest"
      ],
      "memoryId": "forest",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "落葉",
        "散步"
      ],
      "image": "blocks",
      "alt": "孩子的手與木積木",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "reading-1",
      "title": "自己翻一頁",
      "description": "睡前再一頁裡的一張攝影示意。",
      "capturedAt": "2026-06-13",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "reading"
      ],
      "memoryId": "reading",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "繪本",
        "共讀"
      ],
      "image": "read",
      "alt": "在沙發上閱讀的孩子",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "reading-2",
      "title": "共讀的夜晚",
      "description": "睡前再一頁裡的一張攝影示意。",
      "capturedAt": "2026-06-14",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "reading"
      ],
      "memoryId": "reading",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "繪本",
        "共讀"
      ],
      "image": "story",
      "alt": "在沙發上共讀的親子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "reading-3",
      "title": "故事旁的玩具",
      "description": "睡前再一頁裡的一張攝影示意。",
      "capturedAt": "2026-06-15",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "reading"
      ],
      "memoryId": "reading",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "繪本",
        "共讀"
      ],
      "image": "toy",
      "alt": "木製形狀配對玩具",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "reading-4",
      "title": "小城堡",
      "description": "睡前再一頁裡的一張攝影示意。",
      "capturedAt": "2026-06-13",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "reading"
      ],
      "memoryId": "reading",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "繪本",
        "共讀"
      ],
      "image": "blocks",
      "alt": "孩子的手與木積木",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "reading-5",
      "title": "散步時想起的故事",
      "description": "睡前再一頁裡的一張攝影示意。",
      "capturedAt": "2026-06-14",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "reading"
      ],
      "memoryId": "reading",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "繪本",
        "共讀"
      ],
      "image": "park",
      "alt": "灑滿日光的公園步道",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "hands-1",
      "title": "搭一個小房子",
      "description": "兩雙小手裡的一張攝影示意。",
      "capturedAt": "2026-11-03",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "both",
      "albumIds": [
        "hands"
      ],
      "memoryId": "hands",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "兄妹",
        "積木"
      ],
      "image": "blocks",
      "alt": "孩子的手與木積木",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "hands-2",
      "title": "伸手拿積木",
      "description": "兩雙小手裡的一張攝影示意。",
      "capturedAt": "2026-11-04",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "both",
      "albumIds": [
        "hands"
      ],
      "memoryId": "hands",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "兄妹",
        "積木"
      ],
      "image": "crib",
      "alt": "伸手拿積木的孩子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "hands-3",
      "title": "一起走一段",
      "description": "兩雙小手裡的一張攝影示意。",
      "capturedAt": "2026-11-05",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "both",
      "albumIds": [
        "hands"
      ],
      "memoryId": "hands",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "兄妹",
        "積木"
      ],
      "image": "siblings",
      "alt": "兩個孩子手牽手走在田野",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "hands-4",
      "title": "哥哥讀故事",
      "description": "兩雙小手裡的一張攝影示意。",
      "capturedAt": "2026-11-03",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "both",
      "albumIds": [
        "hands"
      ],
      "memoryId": "hands",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "兄妹",
        "積木"
      ],
      "image": "story",
      "alt": "在沙發上共讀的親子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "hands-5",
      "title": "讀著讀著睡著了",
      "description": "兩雙小手裡的一張攝影示意。",
      "capturedAt": "2026-11-04",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "both",
      "albumIds": [
        "hands"
      ],
      "memoryId": "hands",
      "categoryIds": [
        "everyday"
      ],
      "tags": [
        "兄妹",
        "積木"
      ],
      "image": "blanket",
      "alt": "熟睡的嬰兒與柔軟毯子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "weekends-1",
      "title": "窗邊的午睡",
      "description": "窗邊的慢時光裡的一張攝影示意。",
      "capturedAt": "2026-07-11",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "weekends"
      ],
      "memoryId": "weekends",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "午睡",
        "抱抱"
      ],
      "image": "blanket",
      "alt": "熟睡的嬰兒與柔軟毯子",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "weekends-2",
      "title": "睡得很熟",
      "description": "窗邊的慢時光裡的一張攝影示意。",
      "capturedAt": "2026-07-12",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "weekends"
      ],
      "memoryId": "weekends",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "午睡",
        "抱抱"
      ],
      "image": "nap",
      "alt": "在毯子上熟睡的嬰兒",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "weekends-3",
      "title": "毯邊的小腳",
      "description": "窗邊的慢時光裡的一張攝影示意。",
      "capturedAt": "2026-07-13",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "weekends"
      ],
      "memoryId": "weekends",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "午睡",
        "抱抱"
      ],
      "image": "feet",
      "alt": "嬰兒的小腳與連身衣",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "weekends-4",
      "title": "抓住一塊積木",
      "description": "窗邊的慢時光裡的一張攝影示意。",
      "capturedAt": "2026-07-11",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "weekends"
      ],
      "memoryId": "weekends",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "午睡",
        "抱抱"
      ],
      "image": "crib",
      "alt": "伸手拿積木的孩子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "weekends-5",
      "title": "門口的小鞋",
      "description": "窗邊的慢時光裡的一張攝影示意。",
      "capturedAt": "2026-07-12",
      "childIds": [
        "yui"
      ],
      "group": "yui",
      "albumIds": [
        "weekends"
      ],
      "memoryId": "weekends",
      "categoryIds": [
        "growth"
      ],
      "tags": [
        "午睡",
        "抱抱"
      ],
      "image": "shoes",
      "alt": "手掌捧著一雙白色寶寶鞋",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "festival-1",
      "title": "幫忙點起燈",
      "description": "一家人的節日桌裡的一張攝影示意。",
      "capturedAt": "2026-10-04",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "festival"
      ],
      "memoryId": "festival",
      "categoryIds": [
        "festival"
      ],
      "tags": [
        "聚餐",
        "節日"
      ],
      "image": "candles",
      "alt": "為蛋糕點蠟燭的雙手",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "festival-2",
      "title": "每人帶一道菜",
      "description": "一家人的節日桌裡的一張攝影示意。",
      "capturedAt": "2026-10-05",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "festival"
      ],
      "memoryId": "festival",
      "categoryIds": [
        "festival"
      ],
      "tags": [
        "聚餐",
        "節日"
      ],
      "image": "picnic",
      "alt": "草地野餐示意",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "festival-3",
      "title": "飯後的甜點",
      "description": "一家人的節日桌裡的一張攝影示意。",
      "capturedAt": "2026-10-06",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "festival"
      ],
      "memoryId": "festival",
      "categoryIds": [
        "festival"
      ],
      "tags": [
        "聚餐",
        "節日"
      ],
      "image": "cake",
      "alt": "點著蠟燭的蛋糕",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "festival-4",
      "title": "一起散步",
      "description": "一家人的節日桌裡的一張攝影示意。",
      "capturedAt": "2026-10-04",
      "childIds": [
        "haru",
        "yui"
      ],
      "group": "family",
      "albumIds": [
        "festival"
      ],
      "memoryId": "festival",
      "categoryIds": [
        "festival"
      ],
      "tags": [
        "聚餐",
        "節日"
      ],
      "image": "family",
      "alt": "一家人牽手走過草地",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "autumn-1",
      "title": "秋天的光",
      "description": "去年的秋日散步裡的一張攝影示意。",
      "capturedAt": "2025-11-09",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "autumn"
      ],
      "memoryId": "autumn",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "落葉",
        "探險"
      ],
      "image": "park",
      "alt": "灑滿日光的公園步道",
      "favoriteEligible": true,
      "featured": true,
      "visibility": "public-demo"
    },
    {
      "id": "autumn-2",
      "title": "橋上的腳步",
      "description": "去年的秋日散步裡的一張攝影示意。",
      "capturedAt": "2025-11-10",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "autumn"
      ],
      "memoryId": "autumn",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "落葉",
        "探險"
      ],
      "image": "bridge",
      "alt": "穿過林間步道的孩子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "autumn-3",
      "title": "林間的綠",
      "description": "去年的秋日散步裡的一張攝影示意。",
      "capturedAt": "2025-11-11",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "autumn"
      ],
      "memoryId": "autumn",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "落葉",
        "探險"
      ],
      "image": "forest",
      "alt": "林間小路上的孩子",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    },
    {
      "id": "autumn-4",
      "title": "散步到海邊",
      "description": "去年的秋日散步裡的一張攝影示意。",
      "capturedAt": "2025-11-09",
      "childIds": [
        "haru"
      ],
      "group": "haru",
      "albumIds": [
        "autumn"
      ],
      "memoryId": "autumn",
      "categoryIds": [
        "outdoors"
      ],
      "tags": [
        "落葉",
        "探險"
      ],
      "image": "coast",
      "alt": "穿過沙丘通往海邊的小路",
      "favoriteEligible": true,
      "featured": false,
      "visibility": "public-demo"
    }
  ];
  const heights = {blanket:320, blocks:360, bridge:320, cake:373, candles:720,
    coast:320, crib:720, family:309, feet:320, forest:720, nap:720, park:720,
    picnic:320, read:270, shoes:600, siblings:343, story:270, toy:320, walk:318};
  app.photos = records.map(record => {
    const base = 'assets/images/' + record.image;
    return { thumbnail:base+'-thumb.webp', displayImage:base+'-display.webp',
      originalImage:null, width:480, height:heights[record.image] || 320, ...record };
  });
})();
