# Step 2 Frontend Replacement Plan

This document defines the scope for the next phase after the successful first deployment.

## Step 2 Goal

Replace the sample `WebContent` files with the output of a real front-end build while keeping the same Domino deployment pattern.

## What Stays the Same

These parts should remain unchanged unless there is a strong reason to alter them:

- `plugin.xml`
- `contextRoot`
- OSGi bundle packaging approach
- p2 update site generation
- import into `updatesite.nsf`
- `OSGI_HTTP_DYNAMIC_BUNDLES`

## What Changes

These parts will be replaced:

- `WebContent/index.html`
- `WebContent/app.js`
- `WebContent/style.css`
- any added static assets such as images, fonts, or hashed bundles

In practice, a cleaner long-term structure is to keep the tutorial home at `WebContent/`, preserve Step 1 in `WebContent/step1/`, and place the front-end build output in `WebContent/step2/`.

## Recommended First Target

Use a Vite-based app for the first real framework example.

Reason:

- simple output structure
- easy static deployment
- base path configuration is straightforward
- good fit for front-end-only hosting

## Step 2 Checklist

1. Create or identify the front-end app
2. Build it locally
3. Confirm output folder contents
4. Copy build output into `src/main/resources/WebContent/`
5. Adjust asset base path if needed
6. Prefer hash routing for the first pass
7. Rebuild with `mvn package`
8. Re-import the generated update site
9. Restart Domino HTTP
10. Verify the root page and static assets

## Risks to Watch

- asset paths incorrectly pointing to `/`
- history routing refresh failures
- missing fonts or images
- JavaScript bundle names changing with hashes
- API calls expecting a different origin

## Suggested Validation

After Step 2 deployment, verify:

1. root page opens
2. main JS bundle returns `200 OK`
3. main CSS bundle returns `200 OK`
4. one image or font asset returns `200 OK`
5. browser refresh still works for the chosen routing approach

## Current Status

The first Step 2 implementation has now been completed in this workspace using a Vite starter project.

See:

- `docs/step-2-vite-implementation-record.md`

---

# 繁體中文

這份文件定義了第一次成功部署之後的下一階段範圍。

## Step 2 目標

把目前 sample 的 `WebContent` 內容，替換成真正前端框架 build 出來的產物，同時保留相同的 Domino 部署模式。

## 不變的部分

除非有非常明確的理由，以下部分建議維持不變：

- `plugin.xml`
- `contextRoot`
- OSGi bundle 打包方式
- p2 update site 產生流程
- `updatesite.nsf` 匯入流程
- `OSGI_HTTP_DYNAMIC_BUNDLES`

## 會改變的部分

以下內容會被替換：

- `WebContent/index.html`
- `WebContent/app.js`
- `WebContent/style.css`
- 其他新增靜態資源，例如圖片、字型與 hash 命名的 bundle

實務上更乾淨的做法是：保留 `WebContent/` 作為教程首頁，把 Step 1 放在 `WebContent/step1/`，再把前端 build 輸出放到 `WebContent/step2/`。

## 建議第一個目標

第一個正式框架範例建議採用 Vite。

原因：

- 輸出結構簡單
- 適合靜態部署
- base path 設定清楚
- 很適合前端獨立部署

## Step 2 檢查清單

1. 建立或確認前端應用
2. 在本機完成 build
3. 確認輸出資料夾內容
4. 把 build output 複製到 `src/main/resources/WebContent/`
5. 必要時調整 asset base path
6. 第一次建議先用 hash routing
7. 再次執行 `mvn package`
8. 重新匯入產生的 update site
9. 重啟 Domino HTTP
10. 驗證首頁與靜態資源

## 要注意的風險

- 資源路徑錯誤，仍指向 `/`
- history routing 在 refresh 時失敗
- 圖片或字型遺漏
- JavaScript bundle 名稱帶 hash 而更新方式沒處理好
- API 呼叫預期的 origin 與實際部署不一致

## 建議驗證方式

完成 Step 2 部署後，至少驗證：

1. 首頁能正常打開
2. 主 JS bundle 回傳 `200 OK`
3. 主 CSS bundle 回傳 `200 OK`
4. 至少一個圖片或字型資源回傳 `200 OK`
5. 針對你選用的 routing 方式，重新整理後仍正常

## 目前狀態

這個 workspace 已經完成第一版的 Step 2 實作，採用的是 Vite starter 專案。

詳見：

- `docs/step-2-vite-implementation-record.md`
