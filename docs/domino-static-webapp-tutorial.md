# Domino Static Webapp Tutorial

This tutorial walks through a minimal first run of the "static frontend as OSGi webapp" deployment pattern on HCL Domino.

The goal is to take a simple frontend app and deploy it to Domino without XPages, using:

1. an OSGi bundle
2. a generated p2 update site
3. an `updatesite.nsf`
4. Domino HTTP dynamic bundle loading

## What This Pattern Is Good For

Use this pattern for:

- static sites
- SPA frontends
- built frontend assets from Vite, React, Vue, Angular, or similar
- HTML, CSS, JS, images, fonts, and JSON assets

Do not use this as-is for:

- server-side-rendered Node.js apps
- Next.js server mode
- apps that require a Node runtime on Domino

For a front-end/back-end split architecture, this pattern is usually for the front end only. Your API remains separate.

## What Is In This Workspace

- `hello-webapp/`: a minimal sample app
- `hello-webapp/src/main/resources/plugin.xml`: defines the Domino webapp context root
- `hello-webapp/src/main/resources/WebContent/`: the static files served by Domino
- `hello-webapp/pom.xml`: builds the OSGi bundle and generates the p2 update site

## Sample URL

This sample publishes at:

- `/hello-webapp`

After deployment, the expected URL is typically:

- `http://your-server/hello-webapp/`

Recommended showcase structure:

- `/hello-webapp/` for the tutorial home
- `/hello-webapp/step1/index.html` for the first-stage static result
- `/hello-webapp/step2/index.html` for the Vite-based second stage

## Project Structure

```text
hello-webapp/
├── pom.xml
└── src/
    └── main/
        └── resources/
            ├── plugin.xml
            └── WebContent/
                ├── index.html
                ├── app.js
                ├── style.css
                └── WEB-INF/
                    └── web.xml
```

## Step 1: Understand the Two Packaging Layers

There are two layers here:

1. `OSGi webapp bundle`
   This is the actual deployable artifact that exposes your static files at a web context root.

2. `p2 update site`
   This is the repository format Domino uses through `updatesite.nsf` to import and distribute the bundle.

The bundle is the app. The update site is the transport and deployment wrapper.

## Step 2: Review `plugin.xml`

The key file is `src/main/resources/plugin.xml`:

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

Meaning:

- `contextRoot`: the URL path Domino will serve
- `contentLocation`: the directory inside the bundle that contains the web assets

## Step 3: Review `WEB-INF/web.xml`

This file is a minimal Java webapp descriptor. It exists so the bundle is treated as a web application.

```xml
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
    version="2.5">
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
</web-app>
```

## Step 4: Build the Project

From the `hello-webapp` directory:

```powershell
mvn package
```

Expected output:

- OSGi bundle JAR in `target/`
- generated p2 repository in `target/repository/`
- `site.xml` in `target/repository/`

If your environment matches the required repository/plugin setup, the generated update site will be the content you import into `updatesite.nsf`.

Note:

- this sample intentionally avoids adding the newer Tycho repository archiving step
- that plugin commonly requires a newer Java runtime than Java 8
- for a first Domino-oriented run, the generated `target/repository/` content is enough

## Step 5: Create or Open `updatesite.nsf`

On Domino or Notes:

1. Create an NSF from `updatesite.ntf`
2. Open the database
3. Use `Import Local Update Site`
4. Select the `site.xml` from `hello-webapp/target/repository/`

At this point, the NSF contains the feature and plugin artifacts.

## Step 6: Enable the UpdateSite NSF for Domino HTTP

On the Domino server, set:

```ini
OSGI_HTTP_DYNAMIC_BUNDLES=updatesite.nsf
```

If the NSF is in a subdirectory, use the relative NSF path, for example:

```ini
OSGI_HTTP_DYNAMIC_BUNDLES=apps/updatesite.nsf
```

If you already have other dynamic bundle NSFs, append this one as a comma-separated value.

## Step 7: Restart HTTP

On the server console:

```text
restart task http
```

On a successful load, Domino should report that NSF-based plugins are being installed in the OSGi runtime.

## Step 8: Verify the Result

Try opening:

```text
http://your-server/hello-webapp/
```

You should see the sample page.

If not, check:

- the update site import completed successfully
- the bundle is enabled in the update site NSF
- the NSF path in `OSGI_HTTP_DYNAMIC_BUNDLES` is correct
- the HTTP task was restarted
- the signer and trust settings on the server are correct

## Step 9: Replace the Sample With Your Own Frontend

Once the sample works, swap the contents of `src/main/resources/WebContent/` with your real built frontend.

Typical mapping:

- Vite `dist/*` -> `WebContent/`
- React build output -> `WebContent/`
- Vue build output -> `WebContent/`

Keep these in mind:

- use a correct base path if the app is not hosted at `/`
- for a first run, prefer hash routing over history routing
- ensure asset URLs are relative or correctly rooted to the chosen `contextRoot`

## Suggested Learning Path

Run this in three passes:

1. Deploy this minimal sample unchanged
2. Replace the static files with a built frontend
3. Connect that frontend to your API

## Suggested Follow-Up Tutorial Expansion

After your first successful run, the next tutorial sections should be:

1. Deploying a Vite build
2. Handling SPA routing
3. Using a separate Domino or non-Domino API
4. Versioning and update strategy
5. Troubleshooting signer and OSGi load failures

## Source References

- Jesse Gallagher / Frostillic: Deploying static resources as a webapp  
  https://www.frostillic.us/blog/posts/2025/6/29/quick-tip-deploying-static-resources-as-a-webapp
- OpenNTF article: LotusScript Class Map  
  https://openntf.org/main.nsf/blog.xsp?permaLink=GACS-DTBKFL
- OpenNTF LotusScript Class Map repository  
  https://github.com/OpenNTF/ls-classmap

## Related Docs In This Workspace

- `docs/step-1-first-deployment-record.md`
- `docs/step-2-frontend-replacement-plan.md`

---

# 繁體中文

這份教學文件示範如何完成第一次「將靜態前端以 OSGi webapp 方式部署到 HCL Domino」的流程。

目標是把一個簡單前端應用透過以下四層完成部署：

1. OSGi bundle
2. p2 update site
3. `updatesite.nsf`
4. Domino HTTP 動態載入 bundle

## 這種模式適合什麼

適合：

- 靜態網站
- SPA 前端
- Vite、React、Vue、Angular 等 build 後的靜態產物
- HTML、CSS、JavaScript、圖片、字型與 JSON 資源

不適合直接照抄用在：

- 需要 Node.js runtime 的 SSR 應用
- Next.js server mode
- 需要 Node server 才能執行的系統

如果你的系統是前後分離，這個模式通常只負責前端。API 後端仍然是另一層。

## 這個 Workspace 裡有什麼

- `hello-webapp/`：最小範例
- `hello-webapp/src/main/resources/plugin.xml`：定義 Domino webapp 的 context root
- `hello-webapp/src/main/resources/WebContent/`：實際由 Domino 提供的靜態檔
- `hello-webapp/pom.xml`：負責 OSGi bundle 與 p2 update site 打包

## 範例網址

這個 sample 會發布在：

- `/hello-webapp`

部署完成後，預期網址通常是：

- `http://your-server/hello-webapp/`

建議的展示結構是：

- `/hello-webapp/` 作為教程首頁
- `/hello-webapp/step1/index.html` 作為第一階段靜態成果
- `/hello-webapp/step2/index.html` 作為第二階段 Vite 成果

## 專案結構

```text
hello-webapp/
├── pom.xml
└── src/
    └── main/
        └── resources/
            ├── plugin.xml
            └── WebContent/
                ├── index.html
                ├── app.js
                ├── style.css
                └── WEB-INF/
                    └── web.xml
```

## 第一步：理解兩層打包

這裡其實有兩層：

1. `OSGi webapp bundle`
   這是實際的應用本體，負責把靜態檔以 web context 的方式提供出來。

2. `p2 update site`
   這是 Domino 用來匯入 `updatesite.nsf` 的部署倉庫格式。

也就是說：

- bundle 是應用本體
- update site 是部署用的包裝與傳輸形式

## 第二步：看懂 `plugin.xml`

核心檔案是 `src/main/resources/plugin.xml`：

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

意思是：

- `contextRoot`：Domino 對外提供的 URL 路徑
- `contentLocation`：bundle 內實際放靜態檔的資料夾

## 第三步：看懂 `WEB-INF/web.xml`

這是一個最小的 Java webapp descriptor，讓這個 bundle 被視為 web application。

```xml
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
    version="2.5">
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
</web-app>
```

## 第四步：Build 專案

在 `hello-webapp` 目錄下執行：

```powershell
mvn package
```

預期輸出：

- `target/` 內的 OSGi bundle JAR
- `target/repository/` 內的 p2 repository
- `target/repository/site.xml`

如果你的環境與 plugin 依賴都正常，這些檔案就是接下來匯入 `updatesite.nsf` 的內容。

注意：

- 這個 sample 刻意沒有加較新的 Tycho repository archive 步驟
- 因為那一步常常要求比 Java 8 更高的 runtime
- 對第一次 Domino 實跑來說，`target/repository/` 已經足夠

## 第五步：建立或開啟 `updatesite.nsf`

在 Domino 或 Notes 端：

1. 用 `updatesite.ntf` 建一個 NSF
2. 開啟該資料庫
3. 使用 `Import Local Update Site`
4. 指到 `hello-webapp/target/repository/` 裡的 `site.xml`

完成後，這個 NSF 就會包含 feature 與 plugin 資料。

## 第六步：讓 Domino HTTP 載入 UpdateSite NSF

在 Domino server 設定：

```ini
OSGI_HTTP_DYNAMIC_BUNDLES=updatesite.nsf
```

如果 NSF 在子目錄，例如：

```ini
OSGI_HTTP_DYNAMIC_BUNDLES=apps/updatesite.nsf
```

如果原本就有其他動態 bundle NSF，請用逗號追加。

## 第七步：重啟 HTTP

在 Domino console 執行：

```text
restart task http
```

正常情況下，Domino 會在 OSGi runtime 中載入來自 NSF 的 plugin。

## 第八步：驗證結果

打開：

```text
http://your-server/hello-webapp/
```

你應該會看到 sample 頁面。

如果沒有，請檢查：

- update site 是否成功匯入
- bundle 是否在 update site NSF 中已啟用
- `OSGI_HTTP_DYNAMIC_BUNDLES` 的 NSF 路徑是否正確
- HTTP task 是否已重新啟動
- signer 與 server trust 設定是否正確

## 第九步：替換成你自己的前端

當 sample 成功後，就可以把 `src/main/resources/WebContent/` 裡的內容換成真正的前端 build 輸出。

常見映射：

- Vite `dist/*` -> `WebContent/`
- React build 輸出 -> `WebContent/`
- Vue build 輸出 -> `WebContent/`

要注意：

- 如果不是部署在 `/`，要正確設定 base path
- 第一次建議先用 hash router，不要先上 history router
- 所有資源路徑都要確認是相對路徑，或正確指向你的 `contextRoot`

## 建議學習順序

建議分三輪跑：

1. 先原封不動部署這個最小 sample
2. 再把靜態檔換成前端框架 build 輸出
3. 最後把前端接到你的 API

## 下一版教程可以擴充的主題

成功跑完第一次後，下一份教程最適合補這些：

1. 如何部署 Vite build
2. 如何處理 SPA routing
3. 如何接 Domino 或外部 API
4. 如何做版本更新策略
5. 如何排查 signer 與 OSGi 載入失敗

## 參考來源

- Jesse Gallagher / Frostillic：將靜態資源部署成 webapp  
  https://www.frostillic.us/blog/posts/2025/6/29/quick-tip-deploying-static-resources-as-a-webapp
- OpenNTF 文章：LotusScript Class Map  
  https://openntf.org/main.nsf/blog.xsp?permaLink=GACS-DTBKFL
- OpenNTF LotusScript Class Map 專案  
  https://github.com/OpenNTF/ls-classmap

## 本 Workspace 內相關文件

- `docs/step-1-first-deployment-record.md`
- `docs/step-2-frontend-replacement-plan.md`
