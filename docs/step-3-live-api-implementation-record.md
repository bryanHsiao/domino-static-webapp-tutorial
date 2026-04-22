# Step 3 Live API Implementation Record

This document records the first implementation of Step 3 in this workspace.

Step 3 means:

- keep the same Domino static-webapp deployment mechanism
- keep the earlier showcase stages available
- add a page that fetches live API data at runtime

## Result

A new Step 3 page was added at:

- `/hello-webapp/step3/index.html`

This page fetches the live Domino API root endpoint:

- `https://ap02.domino.com.tw/api`

It reads the returned `services[]` data and renders:

- total service count
- enabled count
- disabled count
- last refresh time
- animated service cards
- raw JSON preview

## API Response Used

The endpoint returns JSON in this general form:

```json
{
  "services": [
    {
      "name": "Core",
      "enabled": true,
      "version": "12.0.2.v05_00",
      "href": "/api/core"
    }
  ]
}
```

This shape was enough to create a useful first live dashboard without needing authentication flows or deeper service-specific calls.

## Files Added

Step 3 page files:

- `hello-webapp/src/main/resources/WebContent/step3/index.html`
- `hello-webapp/src/main/resources/WebContent/step3/app.js`
- `hello-webapp/src/main/resources/WebContent/step3/style.css`

Web documentation files:

- `hello-webapp/src/main/resources/WebContent/docs/index.html`
- `hello-webapp/src/main/resources/WebContent/docs/step1.html`
- `hello-webapp/src/main/resources/WebContent/docs/step2.html`
- `hello-webapp/src/main/resources/WebContent/docs/step3.html`
- `hello-webapp/src/main/resources/WebContent/docs/docs.css`

## Web Structure Recommendation

The tutorial web structure is now:

- `/hello-webapp/` for the tutorial home
- `/hello-webapp/docs/index.html` for in-browser docs home
- `/hello-webapp/docs/step1.html` for Step 1 docs
- `/hello-webapp/docs/step2.html` for Step 2 docs
- `/hello-webapp/docs/step3.html` for Step 3 docs
- `/hello-webapp/step1/index.html` for Step 1 demo
- `/hello-webapp/step2/index.html` for Step 2 demo
- `/hello-webapp/step3/index.html` for Step 3 demo

This is the recommended pattern going forward:

- showcase pages under `/stepX/`
- explanation pages under `/docs/`
- canonical project docs in the repo-level `docs/` directory

## Why This Structure Works

This structure separates concerns clearly:

- the root page is an index
- each step keeps its own runnable output
- docs pages explain the architectural reason for each step
- deployment remains a single Domino webapp

This is much easier to maintain than repeatedly replacing the root page with the newest stage.

## Runtime Design Choices

The Step 3 page uses:

- same-origin fetch to `/api`
- a refresh button for manual reloading
- a loading, success, and error state
- animated card reveal
- a raw JSON panel for debugging and transparency

Using same-origin fetch keeps the first API example simple and avoids introducing CORS as the first problem.

## Visual Direction

The Step 3 page was intentionally designed as a polished dashboard rather than a plain JSON dump.

Key choices:

- strong hero section
- summary metrics at the top
- status chip for fetch state
- staggered animated card reveal
- dark raw JSON panel for contrast

This keeps the tutorial useful as both a technical demo and a presentation-quality example.

## Verification Performed

The package was rebuilt successfully after adding Step 3 and web docs.

Successful commands:

```powershell
npm.cmd run build
mvn package
```

New output is included in:

- `hello-webapp/target/repository/site.xml`

## Deployment Note

After each update to the Step 3 page, the repeat procedure remains:

1. update files in `WebContent/step3/` or related docs pages
2. run `mvn package`
3. re-import `hello-webapp/target/repository/site.xml`
4. restart Domino HTTP
5. verify the target URLs

## Recommended Verification URLs

- `/hello-webapp/`
- `/hello-webapp/docs/index.html`
- `/hello-webapp/step1/index.html`
- `/hello-webapp/step2/index.html`
- `/hello-webapp/step3/index.html`

## Next Logical Step

The next practical evolution after this Step 3 is one of:

1. add deeper links to enabled services such as `/api/core`
2. add filtering, sorting, or service grouping
3. add authentication-aware API examples
4. add Step 4 as a richer API detail explorer

---

# 繁體中文

這份文件記錄了這個 workspace 中，Step 3 第一次實作完成的方式。

Step 3 的定義是：

- 保留相同的 Domino 靜態 webapp 部署機制
- 保留前面各階段的展示頁
- 新增一個會在 runtime 讀取 live API 的頁面

## 最終結果

新增了一個 Step 3 頁面：

- `/hello-webapp/step3/index.html`

這個頁面會讀取真實的 Domino API 根端點：

- `https://ap02.domino.com.tw/api`

並將回傳的 `services[]` 資料呈現為：

- 服務總數
- 已啟用數量
- 未啟用數量
- 最後刷新時間
- 帶動畫的服務卡片
- 原始 JSON 預覽

## 使用的 API 回應格式

這個端點回傳的 JSON 大致如下：

```json
{
  "services": [
    {
      "name": "Core",
      "enabled": true,
      "version": "12.0.2.v05_00",
      "href": "/api/core"
    }
  ]
}
```

這種資料結構已經足夠做出第一版 live dashboard，而不需要一開始就碰登入流程或更深層的 API 呼叫。

## 新增的檔案

Step 3 頁面檔案：

- `hello-webapp/src/main/resources/WebContent/step3/index.html`
- `hello-webapp/src/main/resources/WebContent/step3/app.js`
- `hello-webapp/src/main/resources/WebContent/step3/style.css`

Web 文件頁面：

- `hello-webapp/src/main/resources/WebContent/docs/index.html`
- `hello-webapp/src/main/resources/WebContent/docs/step1.html`
- `hello-webapp/src/main/resources/WebContent/docs/step2.html`
- `hello-webapp/src/main/resources/WebContent/docs/step3.html`
- `hello-webapp/src/main/resources/WebContent/docs/docs.css`

## 建議的網站結構

目前的教程網站結構如下：

- `/hello-webapp/` 作為教程首頁
- `/hello-webapp/docs/index.html` 作為網頁版文件首頁
- `/hello-webapp/docs/step1.html` 作為 Step 1 文件
- `/hello-webapp/docs/step2.html` 作為 Step 2 文件
- `/hello-webapp/docs/step3.html` 作為 Step 3 文件
- `/hello-webapp/step1/index.html` 作為 Step 1 展示頁
- `/hello-webapp/step2/index.html` 作為 Step 2 展示頁
- `/hello-webapp/step3/index.html` 作為 Step 3 展示頁

這也是後續最建議延用的模式：

- 展示頁放在 `/stepX/`
- 說明頁放在 `/docs/`
- 專案正式文件保留在 repo 根目錄的 `docs/`

## 為什麼這樣規劃比較好

這種結構的優點是責任很清楚：

- 根首頁負責導覽
- 每個 step 保留自己可執行的成果
- docs 頁面說明每個步驟的技術意圖
- 仍然只需要部署成一個 Domino webapp

比起每次都用最新版覆蓋首頁，這種方式更容易維護，也更適合教學展示。

## Runtime 設計選擇

Step 3 採用了：

- same-origin 的 `/api` fetch
- 可手動重整的 refresh 按鈕
- loading / success / error 三種狀態
- 動畫式卡片進場
- 原始 JSON 面板，方便除錯與理解

第一版先採 same-origin，是因為這樣可以避開 CORS，把焦點放在「前端已經真的開始吃 API」這件事上。

## 視覺方向

Step 3 並沒有做成純 JSON dump，而是刻意做成一個較完整的 dashboard：

- 明確的 hero 區塊
- 頂部 summary metrics
- fetch 狀態 chip
- staggered animated card reveal
- 深色 raw JSON panel 強化層次

這樣它同時是技術示範，也能作為展示型頁面。

## 已做的驗證

加入 Step 3 與網頁版 docs 後，整個 package 已重新 build 成功。

成功指令：

```powershell
npm.cmd run build
mvn package
```

新的輸出已包含在：

- `hello-webapp/target/repository/site.xml`

## 部署注意事項

之後如果修改 Step 3，重複流程仍然是：

1. 修改 `WebContent/step3/` 或相關 docs 頁面
2. 執行 `mvn package`
3. 重新匯入 `hello-webapp/target/repository/site.xml`
4. 重啟 Domino HTTP
5. 驗證對應網址

## 建議驗證網址

- `/hello-webapp/`
- `/hello-webapp/docs/index.html`
- `/hello-webapp/step1/index.html`
- `/hello-webapp/step2/index.html`
- `/hello-webapp/step3/index.html`

## 下一個合理步驟

Step 3 完成後，下一個合理的延伸方向通常是：

1. 對已啟用服務加上更深一層的 API 連結，例如 `/api/core`
2. 加入 filtering、sorting 或 service grouping
3. 加入與認證相關的 API 範例
4. 將 Step 4 做成更完整的 API detail explorer
