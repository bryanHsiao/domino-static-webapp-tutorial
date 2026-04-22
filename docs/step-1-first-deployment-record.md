# Step 1 Deployment Record

This document records the exact process used to complete the first successful deployment of the sample Domino static webapp in this workspace.

It is intended as an execution record, not just a conceptual tutorial.

## Goal

Complete a full first run of this deployment pattern:

1. create a minimal static webapp project
2. package it as an OSGi bundle
3. generate a p2 update site
4. import that update site into an `updatesite.nsf`
5. have Domino HTTP serve the application from a web context root

## Workspace Used

- Root: `C:\Users\siaob\code\20260423-codex`
- Sample project: `C:\Users\siaob\code\20260423-codex\hello-webapp`

## Final Verified Result

The deployed sample was verified at:

- `https://ap02.domino.com.tw/hello-webapp/`
- `https://ap02.domino.com.tw/hello-webapp/index.html`

The following resources were also confirmed to return `200 OK`:

- `https://ap02.domino.com.tw/hello-webapp/style.css`
- `https://ap02.domino.com.tw/hello-webapp/app.js`

## Files Created

The initial sample project was created with these key files:

- `hello-webapp/pom.xml`
- `hello-webapp/src/main/resources/plugin.xml`
- `hello-webapp/src/main/resources/WebContent/index.html`
- `hello-webapp/src/main/resources/WebContent/app.js`
- `hello-webapp/src/main/resources/WebContent/style.css`
- `hello-webapp/src/main/resources/WebContent/WEB-INF/web.xml`

The following documentation files were also added:

- `README.md`
- `docs/domino-static-webapp-tutorial.md`

## Application Structure

The important serving structure is:

```text
src/main/resources/
├── plugin.xml
└── WebContent/
    ├── index.html
    ├── app.js
    ├── style.css
    └── WEB-INF/
        └── web.xml
```

## Why This Works

This deployment pattern works because Domino can load OSGi bundles from an NSF-based update site.

The application is not an XPages app. It is a web application bundle exposed through this extension point:

```xml
<extension point="com.ibm.pvc.webcontainer.application">
    <contextRoot>/hello-webapp</contextRoot>
    <contentLocation>WebContent</contentLocation>
</extension>
```

That means:

- Domino exposes the application at `/hello-webapp`
- static assets are served from the `WebContent` directory inside the bundle

## Exact Packaging Design

### `plugin.xml`

This defines the Domino webapp mapping:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?eclipse version="3.4"?>
<plugin>
    <extension point="com.ibm.pvc.webcontainer.application">
        <contextRoot>/hello-webapp</contextRoot>
        <contentLocation>WebContent</contentLocation>
    </extension>
</plugin>
```

### `web.xml`

This defines the welcome file so the cleaner URL works:

```xml
<welcome-file-list>
    <welcome-file>index.html</welcome-file>
</welcome-file-list>
```

This is why both of these worked:

- `/hello-webapp/index.html`
- `/hello-webapp/`

### `pom.xml`

The project uses:

- `maven-bundle-plugin`
- `org.openntf.maven:p2-maven-plugin`
- `org.darwino:p2sitexml-maven-plugin`

The `bundle` packaging creates the OSGi bundle.

The p2 plugins generate:

- `target/repository/`
- `target/repository/site.xml`

Those files are what get imported into `updatesite.nsf`.

## Build Attempt History

### First Build Problem

The first local Maven runs failed in the sandbox because Maven tried to use a non-writable default local repository path.

This was an environment restriction, not a project problem.

### Second Build Problem

After running Maven outside the sandbox, the build exposed a real compatibility issue:

- `org.eclipse.tycho:tycho-p2-repository-plugin:4.0.10`
- required a newer Java runtime
- current environment was Java 8

Observed failure type:

```text
UnsupportedClassVersionError
class file version 61.0
this Java Runtime only recognizes class file versions up to 52.0
```

Meaning:

- plugin was compiled for Java 17
- environment was Java 8

### Fix Applied

The `tycho-p2-repository-plugin` archive step was removed from `pom.xml`.

Reason:

- it was not required for the first successful Domino deployment
- the generated `target/repository/` output was already sufficient
- removing it made the sample Java-8-friendly

This is an important practical lesson:

- do not add extra modern Tycho steps unless you actually need them
- first get the p2 repository generated and imported successfully

## Successful Build

After the Java 8 compatibility fix, this command succeeded:

```powershell
mvn package
```

Generated output:

- `target/hello-webapp-0.1.0-SNAPSHOT.jar`
- `target/repository/site.xml`
- `target/repository/plugins/hello-webapp_...jar`
- `target/repository/features/hello-webapp.feature_...jar`

## Generated Deployment Artifacts

At the end of the successful build, the important generated files were:

- `hello-webapp/target/repository/site.xml`
- `hello-webapp/target/repository/artifacts.jar`
- `hello-webapp/target/repository/content.jar`
- `hello-webapp/target/repository/plugins/hello-webapp_0.1.0.20260423002913.jar`
- `hello-webapp/target/repository/features/hello-webapp.feature_0.1.0.20260423002913.jar`

These are the artifacts expected for import into an NSF-based update site.

## Domino Deployment Steps Actually Followed

The successful deployment path was:

1. Build the sample with `mvn package`
2. Locate `hello-webapp/target/repository/site.xml`
3. Open or create an `updatesite.nsf`
4. Import the generated update site into that NSF
5. Add the NSF path to `OSGI_HTTP_DYNAMIC_BUNDLES`
6. Restart the Domino HTTP task
7. Open `/hello-webapp/`

## Runtime Verification Performed

The deployment was not assumed successful just because the update site imported.

These verifications were performed:

1. Fetch `index.html` and confirm returned content matched the sample page
2. Fetch `style.css` and confirm it returned `200 OK`
3. Fetch `app.js` and confirm it returned `200 OK`
4. Fetch the root context `/hello-webapp/` and confirm the page title was `Hello Domino Webapp`

This matters because it confirms:

- context root is correct
- static resources are being served
- welcome-file resolution is working

## What Was Proven by This Run

This first run proved all of the following:

- Domino can serve a non-XPages app through this mechanism
- a static frontend can be deployed as an OSGi webapp
- the p2 update site generation works from this sample project
- the generated update site can be deployed through an NSF
- the resulting webapp can be served from a normal HTTPS Domino URL

This first-stage result is now preserved in the tutorial showcase at:

- `/hello-webapp/step1/index.html`

## Important Practical Notes

### The app is front-end only

This sample is only the static front-end deployment layer.

If the eventual system is front-end/back-end separated, the back end is still separate.

Typical next architecture:

- front end: this OSGi webapp pattern
- API: Domino REST API, servlet, JAX-RS service, agent endpoint, or external service

### Use hash routing first

For the next phase, if a SPA framework is used, prefer hash routing first.

Reason:

- it avoids the refresh and fallback problems of history routing
- it simplifies first-time deployment validation

### Keep asset paths simple

For replacement front-end builds:

- use relative asset paths or a correct base path
- do not assume deployment at `/`
- test all JS, CSS, image, and font URLs directly

## Recommended Repeat Procedure

If this needs to be repeated from scratch, the shortest practical sequence is:

1. edit or replace the contents of `WebContent`
2. run `mvn package`
3. import `target/repository/site.xml` into `updatesite.nsf`
4. restart HTTP
5. open `/hello-webapp/`
6. verify at least one CSS and one JS asset directly

## Step 2 Definition

For this workspace, `Step 2` is defined as:

- replace the sample static files with a real front-end build
- likely Vite-based first
- preserve the same Domino deployment pattern

That means Step 2 is not about changing the Domino mechanism.

It is about changing only the content inside `WebContent`.

## Recommended Inputs for Step 2

When starting Step 2, gather these first:

1. front-end framework choice
2. build output directory name
3. router type
4. base path setting
5. whether the app calls a same-origin or cross-origin API

## Related Docs

- `docs/domino-static-webapp-tutorial.md`
- `docs/step-2-frontend-replacement-plan.md`

---

# 繁體中文

這份文件記錄了這個 workspace 中，第一次成功把 Domino 靜態 webapp 部署上線的完整過程。

它不是只有概念教學，而是實作紀錄。

## 目標

完成以下完整流程：

1. 建立最小靜態 webapp 專案
2. 打包成 OSGi bundle
3. 產生 p2 update site
4. 匯入 `updatesite.nsf`
5. 讓 Domino HTTP 透過 web context 對外提供

## 使用的 Workspace

- 根目錄：`C:\Users\siaob\code\20260423-codex`
- 範例專案：`C:\Users\siaob\code\20260423-codex\hello-webapp`

## 最終驗證結果

成功驗證的部署網址：

- `https://ap02.domino.com.tw/hello-webapp/`
- `https://ap02.domino.com.tw/hello-webapp/index.html`

以下資源也確認回傳 `200 OK`：

- `https://ap02.domino.com.tw/hello-webapp/style.css`
- `https://ap02.domino.com.tw/hello-webapp/app.js`

## 建立的檔案

建立的核心專案檔案：

- `hello-webapp/pom.xml`
- `hello-webapp/src/main/resources/plugin.xml`
- `hello-webapp/src/main/resources/WebContent/index.html`
- `hello-webapp/src/main/resources/WebContent/app.js`
- `hello-webapp/src/main/resources/WebContent/style.css`
- `hello-webapp/src/main/resources/WebContent/WEB-INF/web.xml`

另外建立的文件：

- `README.md`
- `docs/domino-static-webapp-tutorial.md`

## 應用結構

重要的提供結構如下：

```text
src/main/resources/
├── plugin.xml
└── WebContent/
    ├── index.html
    ├── app.js
    ├── style.css
    └── WEB-INF/
        └── web.xml
```

## 為什麼這樣可行

這個模式之所以成立，是因為 Domino 可以從 NSF-based update site 載入 OSGi bundles。

這個應用不是 XPages，而是透過以下 extension point 對外提供的 web application bundle：

```xml
<extension point="com.ibm.pvc.webcontainer.application">
    <contextRoot>/hello-webapp</contextRoot>
    <contentLocation>WebContent</contentLocation>
</extension>
```

這代表：

- Domino 會把應用掛在 `/hello-webapp`
- 靜態資源會從 bundle 內的 `WebContent` 提供出來

## 實際採用的打包設計

### `plugin.xml`

這個檔案定義 Domino webapp 的 mapping：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?eclipse version="3.4"?>
<plugin>
    <extension point="com.ibm.pvc.webcontainer.application">
        <contextRoot>/hello-webapp</contextRoot>
        <contentLocation>WebContent</contentLocation>
    </extension>
</plugin>
```

### `web.xml`

這個檔案設定了 welcome file，所以較乾淨的 URL 也能使用：

```xml
<welcome-file-list>
    <welcome-file>index.html</welcome-file>
</welcome-file-list>
```

因此這兩種網址都能正常工作：

- `/hello-webapp/index.html`
- `/hello-webapp/`

### `pom.xml`

這個專案使用：

- `maven-bundle-plugin`
- `org.openntf.maven:p2-maven-plugin`
- `org.darwino:p2sitexml-maven-plugin`

其中：

- `bundle` packaging 會建立 OSGi bundle
- p2 plugins 會產生：
  - `target/repository/`
  - `target/repository/site.xml`

這些就是後續匯入 `updatesite.nsf` 的部署內容。

## Build 過程中的問題紀錄

### 第一個問題

第一次在 sandbox 內執行 Maven 時失敗，原因是 Maven 嘗試使用不可寫入的本機 repository 路徑。

這是環境限制，不是專案內容問題。

### 第二個問題

改成在 sandbox 外執行後，build 暴露出真正的相容性問題：

- `org.eclipse.tycho:tycho-p2-repository-plugin:4.0.10`
- 需要較新的 Java runtime
- 目前環境是 Java 8

觀察到的錯誤類型：

```text
UnsupportedClassVersionError
class file version 61.0
this Java Runtime only recognizes class file versions up to 52.0
```

這表示：

- 該 plugin 是用 Java 17 編譯
- 目前環境只有 Java 8

### 修正方式

從 `pom.xml` 中移除了 `tycho-p2-repository-plugin` 的 archive 步驟。

原因：

- 第一次成功部署並不需要這個步驟
- `target/repository/` 的輸出已足夠匯入 Domino
- 拿掉後可以讓 sample 保持 Java 8 友善

這裡的實務重點是：

- 第一次不要先加太多現代 Tycho 額外步驟
- 先把 p2 repository 成功產生並成功匯入 Domino

## 成功的 Build

完成 Java 8 相容性修正後，這個指令成功執行：

```powershell
mvn package
```

生成的主要輸出：

- `target/hello-webapp-0.1.0-SNAPSHOT.jar`
- `target/repository/site.xml`
- `target/repository/plugins/hello-webapp_...jar`
- `target/repository/features/hello-webapp.feature_...jar`

## 最終部署產物

成功 build 後的重要檔案如下：

- `hello-webapp/target/repository/site.xml`
- `hello-webapp/target/repository/artifacts.jar`
- `hello-webapp/target/repository/content.jar`
- `hello-webapp/target/repository/plugins/hello-webapp_0.1.0.20260423002913.jar`
- `hello-webapp/target/repository/features/hello-webapp.feature_0.1.0.20260423002913.jar`

這些就是 NSF-based update site 匯入時預期會看到的主要產物。

## Domino 實際部署步驟

這次成功部署的實際路徑是：

1. 執行 `mvn package`
2. 找到 `hello-webapp/target/repository/site.xml`
3. 開啟或建立一個 `updatesite.nsf`
4. 將產生的 update site 匯入該 NSF
5. 把 NSF 路徑加到 `OSGI_HTTP_DYNAMIC_BUNDLES`
6. 重啟 Domino HTTP task
7. 打開 `/hello-webapp/`

## 執行的驗證項目

這次不是只看到 update site 匯入完成就算成功，而是實際做了下列驗證：

1. 讀取 `index.html`，確認內容就是 sample page
2. 讀取 `style.css`，確認回傳 `200 OK`
3. 讀取 `app.js`，確認回傳 `200 OK`
4. 讀取 `/hello-webapp/`，確認頁面標題是 `Hello Domino Webapp`

這代表已經驗證：

- context root 正確
- 靜態資源有正常提供
- welcome-file routing 正常

## 這次實跑證明了什麼

這一輪實作實際證明了：

- Domino 可以用這套機制提供非 XPages 應用
- 靜態前端可以包成 OSGi webapp 部署
- 這個 sample project 可以成功產生 p2 update site
- 產生出的 update site 可以透過 NSF 部署
- 最後應用可以用標準 Domino HTTPS URL 對外提供

這個第一階段成果現在已經保留在教程展示結構中的：

- `/hello-webapp/step1/index.html`

## 實務注意事項

### 這只是前端層

這個 sample 只處理靜態前端部署。

如果未來是前後分離架構，後端仍然是另一層。

常見組合會是：

- 前端：這個 OSGi webapp 部署模式
- API：Domino REST API、servlet、JAX-RS、agent endpoint 或外部服務

### 第一次建議用 hash routing

如果下一階段要換成 SPA framework，第一次建議先用 hash routing。

原因：

- 可避免 history routing 的 refresh 與 fallback 問題
- 較適合第一次快速驗證部署

### 保持資源路徑簡單

未來替換前端 build 時，請注意：

- 優先使用相對資源路徑，或正確設定 base path
- 不要假設部署在 `/`
- 要逐一測試 JS、CSS、圖片與字型資源 URL

## 建議的重跑程序

如果之後要從頭再跑一次，最短的實務順序是：

1. 修改或替換 `WebContent` 內容
2. 執行 `mvn package`
3. 匯入 `target/repository/site.xml` 到 `updatesite.nsf`
4. 重啟 HTTP
5. 打開 `/hello-webapp/`
6. 至少直接驗證一個 CSS 與一個 JS 資源

## Step 2 的定義

對這個 workspace 來說，`Step 2` 定義為：

- 把 sample 靜態檔換成真正前端 build 輸出
- 先以 Vite 類型為主
- 保持相同的 Domino 部署機制

也就是說 Step 2 不是換掉 Domino 機制，而是只替換 `WebContent` 裡的內容。

## Step 2 建議先準備的資訊

開始 Step 2 前，建議先確認：

1. 前端框架選型
2. build output directory 名稱
3. router 類型
4. base path 設定
5. API 是同源還是跨源

## 相關文件

- `docs/domino-static-webapp-tutorial.md`
- `docs/step-2-frontend-replacement-plan.md`
