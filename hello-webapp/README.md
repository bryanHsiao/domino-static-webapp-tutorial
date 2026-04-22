# Hello Domino Webapp

This is a minimal sample project for deploying static frontend assets to Domino as an OSGi webapp.

## Build

```powershell
mvn package
```

Expected generated output:

- `target/repository/site.xml`
- `target/repository/`

Import that update site into an `updatesite.nsf`, add the NSF path to `OSGI_HTTP_DYNAMIC_BUNDLES`, restart HTTP, and open:

- `http://your-server/hello-webapp/`

This sample is kept Java-8-friendly on purpose, so it does not include the newer Tycho repository archive step.

Current showcase structure:

- `/hello-webapp/` = tutorial home
- `/hello-webapp/docs/index.html` = docs home
- `/hello-webapp/step1/index.html` = Step 1 static result
- `/hello-webapp/step2/index.html` = Step 2 Vite result
- `/hello-webapp/step3/index.html` = Step 3 live API dashboard

## 繁體中文

這是一個最小範例專案，用來把靜態前端資源部署到 Domino，作為 OSGi webapp。

## Build

```powershell
mvn package
```

預期會產生：

- `target/repository/site.xml`
- `target/repository/`

把這個 update site 匯入 `updatesite.nsf`，再把該 NSF 路徑加到 `OSGI_HTTP_DYNAMIC_BUNDLES`，重啟 HTTP 後即可打開：

- `http://your-server/hello-webapp/`

這個 sample 刻意維持 Java 8 友善，因此沒有加入較新的 Tycho repository archive 步驟。

目前展示結構如下：

- `/hello-webapp/` = 教程首頁
- `/hello-webapp/docs/index.html` = 文件首頁
- `/hello-webapp/step1/index.html` = Step 1 靜態版成果
- `/hello-webapp/step2/index.html` = Step 2 Vite 版成果
- `/hello-webapp/step3/index.html` = Step 3 即時 API 儀表板
