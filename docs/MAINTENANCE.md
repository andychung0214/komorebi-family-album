# 資料與照片維護

先備份儲存庫，在本機修改，再以首頁、照片牆、個人頁、日曆與時間軸逐一驗證。

## 修改哥哥與妹妹

開啟 `assets/js/children-data.js`。哥哥 ID 為 `haru`，妹妹 ID 為 `yui`。更新暱稱、虛構出生日期、介紹、興趣、頭像檔名、攝影封面與 `themeAccent`。以 `children.html?id=haru` 或 `?id=yui` 驗證。保留 ID 以維持既有關聯。示範基準日期在 `core.js`。

## 新增照片及更換畫質

1. 從有權公開的來源準備照片。移除 EXIF、GPS 和可辨識的地點資訊。
2. 建立檔名如 `autumn-leaf-thumb.webp` 和 `autumn-leaf-display.webp`，放入 `assets/images/`。縮圖 300 至 500px、展示圖 1000 至 1600px。保留照片原始長寬比例，建議 WebP。
3. 在 `photos-data.js` 的 `records` 新增唯一 ID。填寫 `image`、正確尺寸、日期、描述、替代文字、`childIds`、`group`、`albumIds`、`memoryId`、`categoryIds` 和標籤。可用 `thumbnail`、`displayImage` 覆寫預設路徑。
4. 在對應相簿與故事加入照片 ID。若想公開提供高畫質原圖，填寫 `originalImage`。請將真正的私人原圖獨立儲存在有權限的地方。
5. 重整相簿、照片牆、時間軸和日曆。執行測試，調整示範筆數驗收至新基準。

## 新增相簿、故事與里程碑

- 相簿在 `albums-data.js` 建立唯一 ID、名稱、短介紹、日期範圍、封面、人物、群組、分類、標籤、照片 ID、精選與排序值。
- 故事複製 `templates/memory-template.html` 到 `memories/<slug>.html`，更新 `title`、`data-id` 和正文。將同一 ID、日期、人物、摘要、相簿、照片、封面、分類和 `contentUrl` 加入 `memories-data.js`。故事清單和搜尋以這份索引為準。
- 里程碑在 `milestones-data.js` 建立事件，填入人員 ID、日期、描述及關聯照片。年齡由事件日期與出生日期計算。
- 分類在 `children-data.js` 的 `categories` 維護，新增分類後可在照片、相簿、故事及里程碑引用。群組可選 `haru`、`yui`、`both`、`family`，多人影像維持同一筆資料。

## 主題

在 `assets/css/site.css` 更新 CSS 變數。調整 `--bg`、`--paper`、`--sage`、`--peach`、`--primary`、`--sans`、`--serif`、`--shadow`、`--radius`，並檢查三色主題的文字與焦點對比。
