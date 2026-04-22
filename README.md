# Domino Static Webapp Tutorial

This workspace contains a minimal example and tutorial for deploying static frontend assets to HCL Domino as an OSGi webapp, packaged as a p2 update site and then imported into an `updatesite.nsf`.

Contents:

- `docs/domino-static-webapp-tutorial.md`: step-by-step tutorial
- `docs/step-1-first-deployment-record.md`: exact first successful deployment record
- `docs/step-2-frontend-replacement-plan.md`: scope and checklist for the next phase
- `docs/step-2-vite-implementation-record.md`: actual Vite implementation record for Step 2
- `docs/step-3-live-api-implementation-record.md`: Step 3 live API and web-docs implementation record
- `.github/workflows/ci.yml`: GitHub Actions workflow for building the tutorial site
- `hello-webapp/`: minimal sample project you can build and deploy
- `frontend-vite/`: Vite frontend project that builds into `hello-webapp`

The sample follows the same general approach described by Jesse Gallagher and used by the OpenNTF LotusScript Class Map project:

- package static files as an OSGi bundle
- expose them with `com.ibm.pvc.webcontainer.application`
- generate a p2 update site
- import into `updatesite.nsf`
- enable via `OSGI_HTTP_DYNAMIC_BUNDLES`

## 繁體中文

這個 workspace 包含一份最小可執行範例，以及一份教學文件，用來說明如何把靜態前端資源包裝成 HCL Domino 上的 OSGi webapp，接著產生 p2 update site，再匯入 `updatesite.nsf` 進行部署。

內容包含：

- `docs/domino-static-webapp-tutorial.md`：逐步教學
- `docs/step-1-first-deployment-record.md`：第一次成功部署的完整紀錄
- `docs/step-2-frontend-replacement-plan.md`：下一階段的前端替換計畫
- `docs/step-2-vite-implementation-record.md`：Step 2 的實作紀錄
- `docs/step-3-live-api-implementation-record.md`：Step 3 與網頁版文件的實作紀錄
- `.github/workflows/ci.yml`：GitHub Actions 自動建置流程
- `hello-webapp/`：可直接 build 與部署的最小範例專案
- `frontend-vite/`：會將 Vite build 輸出到 `hello-webapp` 的前端專案

這個範例遵循 Jesse Gallagher 與 OpenNTF LotusScript Class Map 專案使用的同一條基本路線：

- 將靜態檔打包成 OSGi bundle
- 使用 `com.ibm.pvc.webcontainer.application` 將內容對外提供成 webapp
- 產生 p2 update site
- 匯入 `updatesite.nsf`
- 透過 `OSGI_HTTP_DYNAMIC_BUNDLES` 啟用
