# Step 2 Vite Implementation Record

This document records the first implementation of Step 2 in this workspace.

Step 2 means:

- keep the Domino OSGi webapp deployment mechanism
- replace the handwritten static sample with a real front-end build pipeline

## Result

A Vite frontend project was added and successfully built into:

- `hello-webapp/src/main/resources/WebContent/step2`

The Domino packaging project was then rebuilt successfully with:

```powershell
mvn package
```

## What Was Added

A new project was created:

- `frontend-vite/`

Key files:

- `frontend-vite/package.json`
- `frontend-vite/vite.config.js`
- `frontend-vite/index.html`
- `frontend-vite/src/main.js`
- `frontend-vite/src/style.css`

## Integration Strategy

The chosen strategy was:

1. keep `hello-webapp` as the Domino packaging project
2. create a separate `frontend-vite` project for front-end development
3. configure Vite to build directly into Domino's `WebContent` directory

Build output target:

- `../hello-webapp/src/main/resources/WebContent/step2`

This keeps responsibilities clean:

- `frontend-vite` handles front-end code and build
- `hello-webapp` handles Domino bundle packaging and update-site generation

## Why This Approach Was Chosen

This approach avoids changing the working Domino-side structure:

- `plugin.xml` stays the same
- `WEB-INF/web.xml` stays the same
- `contextRoot` stays `/hello-webapp`

Only the static assets change.

That is the correct separation for Step 2.

## Important Vite Configuration

The important settings in `vite.config.js` are:

- `base: "./"`
- `outDir: ../hello-webapp/src/main/resources/WebContent`
- `emptyOutDir: false`
- deterministic output names in `assets/`

Why these settings matter:

- `base: "./"` keeps asset references relative and safe for non-root deployment
- direct output to `WebContent` means no manual copy step is needed
- `emptyOutDir: false` preserves `WEB-INF/web.xml`
- fixed asset names avoid stale hash confusion during repeated tests

## PowerShell Note

In this environment, `npm` was blocked by PowerShell execution policy.

So the working command form is:

```powershell
npm.cmd install
npm.cmd run build
```

This is important for repeatability on Windows.

## Commands Actually Used

From `frontend-vite/`:

```powershell
npm.cmd install
npm.cmd run build
```

Then from `hello-webapp/`:

```powershell
mvn package
```

## Build Issues Encountered

### `npm` PowerShell policy issue

Using `npm -v` triggered a PowerShell script-signing restriction.

Resolution:

- use `npm.cmd` instead of `npm`

### npm sandbox/network/cache restriction

The first dependency install failed due to sandbox restrictions on npm registry access and cache writes.

Resolution:

- run `npm.cmd install` outside the sandbox

### Vite/esbuild spawn restriction

The first local build attempt failed with:

```text
Error: spawn EPERM
```

Resolution:

- run `npm.cmd run build` outside the sandbox

## Output Produced

After the successful Vite build, these files were produced in `WebContent/step2`:

- `index.html`
- `assets/app.css`
- `assets/app.js`
- existing root-level `WEB-INF/web.xml` was preserved

After that, the structure was reorganized for a tutorial showcase:

- `WebContent/index.html` became the tutorial home page
- `WebContent/step1/` preserves the original static sample
- `WebContent/step2/` contains the Vite output

This avoided overwriting older stages while keeping everything under one webapp.

## What the New Frontend Does

The Step 2 Vite frontend is still a starter app, but it proves the new pipeline.

It shows:

- the current runtime path
- confirmation that the app is now built with Vite
- a short migration explanation from Step 1 to Step 2

The visual design was also changed from the minimal static sample to a more intentional landing-page layout.

## Domino Packaging Verification

After the Vite build and showcase restructure, the Domino package was rebuilt successfully.

This proves:

- the new `WebContent` output is compatible with the existing OSGi bundle packaging
- the p2 update-site generation still works
- the next deployment to `updatesite.nsf` should follow the same process as Step 1

## Repeat Procedure

For the next change cycle, the practical sequence is:

1. modify code in `frontend-vite/src/`
2. run `npm.cmd run build`
3. run `mvn package` in `hello-webapp`
4. re-import `hello-webapp/target/repository/site.xml`
5. restart Domino HTTP
6. verify `/hello-webapp/`

Stage-specific verification paths:

- `/hello-webapp/`
- `/hello-webapp/step1/index.html`
- `/hello-webapp/step2/index.html`

## Current File Ownership

At this point, the roles of the directories are:

- `frontend-vite/`: editable source front-end project
- `hello-webapp/src/main/resources/WebContent/`: tutorial home plus deployment-ready web assets
- `hello-webapp/src/main/resources/WebContent/step1/`: preserved Step 1 result
- `hello-webapp/src/main/resources/WebContent/step2/`: generated Step 2 Vite result
- `hello-webapp/`: Domino bundle and update-site packaging

## Next Logical Step

The next logical move after this Step 2 implementation is one of:

1. replace the starter Vite UI with the real application UI
2. introduce hash routing for a larger SPA
3. connect the frontend to a real API

## Related Docs

- `docs/step-1-first-deployment-record.md`
- `docs/step-2-frontend-replacement-plan.md`
- `docs/domino-static-webapp-tutorial.md`

---

# 繁體中文

這份文件記錄了這個 workspace 中，Step 2 第一次實作完成的方式。

Step 2 的定義是：

- 保留 Domino OSGi webapp 的部署機制
- 把原本手寫的靜態 sample 改成真正的前端 build pipeline

## 最終結果

已新增一個 Vite 前端專案，並成功將 build 輸出寫入：

- `hello-webapp/src/main/resources/WebContent/step2`

之後也成功重新執行 Domino 打包：

```powershell
mvn package
```

## 新增了什麼

建立了一個新專案：

- `frontend-vite/`

主要檔案：

- `frontend-vite/package.json`
- `frontend-vite/vite.config.js`
- `frontend-vite/index.html`
- `frontend-vite/src/main.js`
- `frontend-vite/src/style.css`

## 採用的整合方式

這次採用的方式是：

1. 保留 `hello-webapp` 作為 Domino 打包專案
2. 另外建立 `frontend-vite` 作為前端開發專案
3. 讓 Vite build 直接輸出到 Domino 的 `WebContent` 目錄

build 輸出目標：

- `../hello-webapp/src/main/resources/WebContent/step2`

這樣分工會很清楚：

- `frontend-vite` 負責前端開發與 build
- `hello-webapp` 負責 Domino bundle 與 update site 打包

## 為什麼這樣設計

這種做法不需要改動已經驗證過的 Domino 結構：

- `plugin.xml` 不變
- `WEB-INF/web.xml` 不變
- `contextRoot` 仍是 `/hello-webapp`

改動的只有靜態前端內容。

這就是 Step 2 正確的切分方式。

## Vite 設定重點

`vite.config.js` 裡最重要的設定是：

- `base: "./"`
- `outDir: ../hello-webapp/src/main/resources/WebContent`
- `emptyOutDir: false`
- `assets/` 內輸出固定檔名

這些設定的意義是：

- `base: "./"` 可以讓資源路徑維持相對路徑，較適合非根目錄部署
- 直接輸出到 `WebContent`，就不需要手動 copy build 產物
- `emptyOutDir: false` 可避免把 `WEB-INF/web.xml` 一起刪掉
- 固定檔名可以減少重複測試時 hash 檔名造成的混淆

## PowerShell 注意事項

在這台環境中，`npm` 會被 PowerShell execution policy 擋住。

因此實際可用的指令形式是：

```powershell
npm.cmd install
npm.cmd run build
```

這點在 Windows 上很重要，否則後面很容易重現不了。

## 實際使用的指令

在 `frontend-vite/` 目錄：

```powershell
npm.cmd install
npm.cmd run build
```

接著在 `hello-webapp/` 目錄：

```powershell
mvn package
```

## 遇到的問題

### `npm` PowerShell policy 問題

直接用 `npm -v` 會觸發 PowerShell 對 script signing 的限制。

解法：

- 改用 `npm.cmd`

### npm sandbox / network / cache 限制

第一次安裝依賴時，因為 sandbox 對 npm registry 與 cache 寫入有限制，所以失敗。

解法：

- 在 sandbox 外執行 `npm.cmd install`

### Vite / esbuild 子程序限制

第一次本地 build 失敗，錯誤是：

```text
Error: spawn EPERM
```

解法：

- 在 sandbox 外執行 `npm.cmd run build`

## 產生的輸出

Vite build 成功後，`WebContent/step2` 內產生了：

- `index.html`
- `assets/app.css`
- `assets/app.js`
- 根目錄的 `WEB-INF/web.xml` 被保留下來

之後也把結構調整成教程展示站：

- `WebContent/index.html` 變成教程首頁
- `WebContent/step1/` 保留原始靜態 sample
- `WebContent/step2/` 放置 Vite build 輸出

這樣可以保留每個階段的成果，而不是讓新版本直接覆蓋舊版本。

## 新前端現在做了什麼

目前 Step 2 的 Vite 前端仍是 starter app，但它已經證明新的 pipeline 可行。

它會顯示：

- 目前 runtime path
- 現在已改成由 Vite build 提供
- 從 Step 1 過渡到 Step 2 的簡短說明

畫面風格也從原本極簡 sample，改成較完整的 landing-page 版面。

## Domino 打包驗證

完成 Vite build 與展示結構調整後，Domino package 也已重新 build 成功。

這證明：

- 新的 `WebContent` 內容仍可被現有 OSGi bundle 正確打包
- p2 update site 產生流程仍然成立
- 接下來重新部署到 `updatesite.nsf` 的方式，與 Step 1 完全相同

## 建議的重複操作流程

下一輪修改時，實務上的最短路徑是：

1. 修改 `frontend-vite/src/` 內的前端程式
2. 執行 `npm.cmd run build`
3. 在 `hello-webapp` 執行 `mvn package`
4. 重新匯入 `hello-webapp/target/repository/site.xml`
5. 重啟 Domino HTTP
6. 驗證 `/hello-webapp/`

建議同時驗證：

- `/hello-webapp/`
- `/hello-webapp/step1/index.html`
- `/hello-webapp/step2/index.html`

## 目前目錄角色

到這一步為止，各資料夾的責任分工如下：

- `frontend-vite/`：可編輯的前端原始碼專案
- `hello-webapp/src/main/resources/WebContent/`：教程首頁與部署用靜態輸出
- `hello-webapp/src/main/resources/WebContent/step1/`：保留的 Step 1 成果
- `hello-webapp/src/main/resources/WebContent/step2/`：Step 2 的 Vite 輸出
- `hello-webapp/`：Domino bundle 與 update site 打包專案

## 下一個合理步驟

完成這版 Step 2 之後，下一步通常會是以下其中之一：

1. 把 starter Vite UI 換成真正的應用畫面
2. 對較大的 SPA 加入 hash routing
3. 把前端接到真實 API

## 相關文件

- `docs/step-1-first-deployment-record.md`
- `docs/step-2-frontend-replacement-plan.md`
- `docs/domino-static-webapp-tutorial.md`
