(() => {
  const app = globalThis.Komorebi;
  app.children = [
    {id:'haru', nickname:'小晴', role:'哥哥', birthDate:'2020-08-08', avatar:'haru', coverImage:'forest', themeAccent:'sage',
      description:'喜歡撿落葉、畫奇怪的地圖，睡前總要再翻一頁。', interests:['探險','閱讀','積木']},
    {id:'yui', nickname:'小柚', role:'妹妹', birthDate:'2026-04-17', avatar:'yui', coverImage:'nap', themeAccent:'peach',
      description:'小手喜歡抓著毯子，最愛聽哥哥把同一本故事念兩遍。', interests:['午睡','抱抱','布書']}
  ];
  app.categories = {everyday:'日常點滴', outdoors:'戶外探索', growth:'成長紀錄', birthday:'生日', travel:'家庭旅行', festival:'節日'};
})();
