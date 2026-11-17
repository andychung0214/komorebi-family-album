# 木漏日小日子 · Komorebi Family Album

一本可以在手機與桌機翻閱的日系家庭數位相簿。以 2026-11-18 為展示基準，收錄兩位虛構寶寶小晴與小柚的 10 本相簿、48 筆照片、12 篇故事、15 筆里程碑及 6 種分類。照片是 19 張公開攝影素材，會在不同示範情境重複使用，照片中的人物與故事角色無關。

## 開啟與操作

1. 下載或複製這個儲存庫，雙擊根目錄的 [index.html](index.html)。相簿、照片日曆、搜尋、故事和相簿書都可以直接操作，圖檔隨專案提供。
2. 選用 VS Code Live Server，對 `index.html` 執行 Open with Live Server。HTTP(S) 可讓相同來源的所有頁面共用收藏、主題、最近翻閱和本機留言。瀏覽器對 `file://` 的儲存範圍有差異。
3. 從相簿或照片牆點開照片，使用左右方向鍵、畫面箭頭或觸控左右滑動導覽，Escape 關閉。可播放輪播並選 3、5 或 8 秒；全螢幕由瀏覽器提供。
4. 點愛心收藏照片、相簿和故事。在「我的收藏」中可加註本月最愛、年度精選或家庭珍藏。
5. 在「更多」進入日曆、里程碑及相簿書。選取相簿、照片與版型後，可翻頁及使用瀏覽器列印或另存 A4 PDF。

## 專案結構

```text
.
├── index.html
├── albums.html / album.html / gallery.html
├── children.html / timeline.html / calendar.html / milestones.html
├── memories.html / favorites.html / photobook.html
├── about.html / settings.html / 404.html
├── memories/           12 篇獨立故事 HTML
├── templates/          新故事 HTML 樣板
├── assets/
│   ├── css/            全站主題、版面及列印
│   ├── images/         WebP 縮圖、展示圖及 SVG 標誌與插畫
│   └── js/             示範資料、日期與搜尋、共用元件及各頁互動
├── tests/              Node 內建測試與 Chromium 瀏覽器驗證
└── docs/               計畫、視覺、測試、維護、攝影及私人架構
```

### HTML 入口

| 位置 | 用途 |
| --- | --- |
| `index.html` | 首頁、雙寶、精選相簿、最近照片與回顧 |
| `albums.html`、`album.html?id=sunday` | 相簿清單與單本相簿 |
| `gallery.html` | 照片牆、跨類型搜尋與條件篩選 |
| `memories.html`、`memories/<slug>.html` | 故事清單與獨立故事 |
| `children.html?id=haru`、`children.html?id=yui` | 哥哥與妹妹個人頁 |
| `timeline.html`、`calendar.html`、`milestones.html` | 日期、月齡與成長紀錄 |
| `favorites.html`、`photobook.html` | 收藏及可列印相簿書 |
| `about.html`、`settings.html`、`404.html` | 相簿介紹、個人設定與錯誤頁 |

`assets/css/site.css` 提供 CSS 主題變數、元件及響應式版面，`print.css` 負責 A4 相簿書。JavaScript 採傳統指令碼，由 `app.js` 啟動，`core.js` 管理日期、搜尋與儲存，`ui.js` 管理共用元件，`gallery.js` 負責照片牆與燈箱。各頁功能位於 `pages.js`、`growth.js` 和 `book.js`。

## 維護與驗證

- [資料與照片維護](docs/MAINTENANCE.md) 包含修改雙寶資料、增加照片、相簿、故事、里程碑、分類、主題與高畫質圖片。
- [測試計畫](docs/TEST-PLAN.md) 列出功能、瀏覽器及實機檢查。
- 執行 `node --test tests`。Chromium 實際驗證指令為 `node --experimental-websocket tests/browser.cjs`，需要 Node.js 20 及本機 Chromium 瀏覽器。網站瀏覽無需安裝套件或 Node.js。

## 部署到 GitHub Pages

1. 建立空的 GitHub 儲存庫。將專案根目錄的檔案推送至 `main`，確保 `index.html`、`.nojekyll`、`assets/`、`memories/` 位於該分支根目錄。
2. 先以 `git remote -v`、`git symbolic-ref --short HEAD`、`git log -1 --oneline` 確認 remote、branch 與 commit，再執行 `git push -u origin main`。
3. 在 GitHub 開啟 **Settings → Pages**。在 **Build and deployment** 選 **Deploy from a branch**，指定 **main** 及 **/(root)**，儲存。
4. 在 **Actions** 檢查部署成功後，從 **Settings → Pages** 開啟公開網址。測試首頁、相簿、巢狀故事頁的圖片與樣式、手機導覽及重整。 [GitHub Pages 官方說明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 已知限制

- 本機留言與反應是示範。清除瀏覽器網站資料會移除本機設定，也無跨裝置同步。
- 照片新增採靜態檔案維護。列印使用瀏覽器的 PDF 或 A4 列印功能。正式裝訂、影片編碼及原始相片儲存需額外工具。
- 全螢幕與分享取決於瀏覽器和來源。分享按鈕於本機檔案模式提供說明。
- GitHub Pages 供公開示範。私人版需獨立的認證及媒體權限。詳見 [未來私人相簿架構](docs/FUTURE-BACKEND.md)。

## 授權

網站程式碼、虛構故事與原創 SVG 採 [MIT](LICENSE)。攝影作品依 [Unsplash License](https://unsplash.com/license) 使用，照片來源見 [攝影素材清單](docs/IMAGE-SOURCES.md)。
