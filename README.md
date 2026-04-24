# Domino Static Webapp Tutorial

A working reference for deploying a **modern front-end + REST** application on **HCL Domino** — without XPages, without NSF design elements, and without dropping files on the filesystem.

The sample is packaged as an **OSGi webapp bundle**, distributed through an **Eclipse Update Site** imported into `updatesite.nsf`, and served by Domino HTTP under a normal web context root.

Live showcase: **`https://ap02.domino.com.tw/hello-webapp/`**

---

## What This Repo Proves

- A non-XPages, non-NSF front-end can be deployed on Domino.
- The deployment mechanism (OSGi + update site) is **decoupled** from the front-end implementation — swap Vite for React/Vue, nothing on the Domino side changes.
- The full round-trip (build → package → import → sign → restart → serve) can be automated by **one `mvn package` command** and one **GitHub Actions** workflow.
- You do not have to write a Java back end to have a real API. Step 3 consumes Domino's built-in `/api` endpoint directly.

Every step has been executed against a real Domino server; the `docs/step-*-record.md` files are **execution records**, not just theory.

---

## Architecture at a Glance

```
┌─ Developer machine ──────────────────────────────────────┐
│                                                          │
│  frontend-vite/        hello-webapp/                     │
│  ├── npm run build ──► WebContent/step2/  (Vite output)  │
│  └── (hand-written)    WebContent/step1/                 │
│                        WebContent/step3/  (live API UI)  │
│                        plugin.xml   (contextRoot)        │
│                        WEB-INF/web.xml  (welcome file)   │
│                                                          │
│                        mvn -B package                    │
│                              │                           │
│                              ▼                           │
│                    target/repository/   ← p2 update site │
│                    ├── site.xml                          │
│                    ├── artifacts.jar                     │
│                    ├── content.jar                       │
│                    ├── features/*.jar                    │
│                    └── plugins/*.jar                     │
└──────────────────────────────┬───────────────────────────┘
                               │  (upload via CI or manual)
                               ▼
┌─ Domino server ──────────────────────────────────────────┐
│                                                          │
│  updatesite.nsf                                          │
│    ▲                                                     │
│    │ Import Local Update Site → Sign                     │
│    │                                                     │
│  notes.ini:  OSGI_HTTP_DYNAMIC_BUNDLES=updatesite.nsf    │
│                                                          │
│  restart task http                                       │
│                                                          │
│  Domino HTTP task                                        │
│    └─ Equinox OSGi container                             │
│         └─ com.ibm.pvc.webcontainer.application          │
│              └─ /hello-webapp/  ← live                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Repo Layout

```
.
├── hello-webapp/                    ← Domino OSGi bundle (the deployable)
│   ├── pom.xml                         Maven build: bundle + p2 site
│   └── src/main/resources/
│       ├── plugin.xml                  contextRoot + contentLocation
│       └── WebContent/
│           ├── index.html              tutorial home
│           ├── WEB-INF/web.xml         welcome-file
│           ├── step1/                  handwritten HTML/CSS/JS demo
│           ├── step2/                  Vite build output
│           ├── step3/                  live /api dashboard
│           └── docs/                   in-browser documentation pages
│
├── frontend-vite/                   ← Vite front-end project (feeds step2/)
│   ├── package.json
│   ├── vite.config.js                  outputs into ../hello-webapp/.../step2
│   └── src/
│
├── .github/workflows/ci.yml         ← npm build + mvn package + upload artifacts
│
└── docs/                            ← execution records (bilingual)
    ├── domino-static-webapp-tutorial.md
    ├── step-1-first-deployment-record.md
    ├── step-2-frontend-replacement-plan.md
    ├── step-2-vite-implementation-record.md
    ├── step-3-live-api-implementation-record.md
    └── github-actions-artifact-to-updatesite-guide.md
```

---

## Quick Start

Prerequisites:

- **JDK 8+** (tested on 8; Tycho archive step is intentionally omitted so Java 8 still works)
- **Maven 3.8+**
- **Node.js 22+** (only if rebuilding the Step 2 Vite front-end)
- A Domino server you can restart, plus a Notes ID that is trusted to sign the update site

### 1. Build

```powershell
# Step 2 front-end (optional — skip if you only change step1/step3)
cd frontend-vite
npm ci
npm run build

# Domino bundle + update site
cd ..\hello-webapp
mvn package
```

Output that matters:

- `hello-webapp/target/repository/site.xml`
- `hello-webapp/target/repository/plugins/hello-webapp_*.jar`
- `hello-webapp/target/repository/features/hello-webapp.feature_*.jar`

### 2. Deploy to Domino

1. Open or create `updatesite.nsf` (from the `Eclipse Update Site` template).
2. Click **Import Local Update Site**, select `target/repository/site.xml`.
3. Click **Sign** and sign with a trusted ID. **Unsigned bundles will not load.**
4. In server `notes.ini`, add (once): `OSGI_HTTP_DYNAMIC_BUNDLES=updatesite.nsf`
5. On the server console: `restart task http`
6. Open `https://your-server/hello-webapp/`

### 3. Verify

- `GET /hello-webapp/` → tutorial home
- `GET /hello-webapp/step2/assets/app.js` → `200 OK`
- Server console `tell http osgi ss` → `hello-webapp` bundle **ACTIVE**

If the bundle shows `INSTALLED` but not `ACTIVE`, check the signature, and check server `log.nsf` for OSGi activation errors.

---

## Showcase Routes

| URL | What it is |
|---|---|
| `/hello-webapp/` | Tutorial home — overview of all three steps |
| `/hello-webapp/docs/` | In-browser documentation (step1/step2/step3 explainers) |
| `/hello-webapp/step1/` | Hand-written static demo — proves transport layer |
| `/hello-webapp/step2/` | Vite build output — proves real front-end pipelines work |
| `/hello-webapp/step3/` | Live dashboard fetching `/api` — proves front + back together |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Packaging | `maven-bundle-plugin` (Apache Felix) | Turns the project into an OSGi bundle without writing `MANIFEST.MF` by hand |
| Update site | `p2-maven-plugin` (OpenNTF) + `p2sitexml-maven-plugin` (Darwino) | Generates both p2 layout and the legacy `site.xml` that `updatesite.nsf` reads |
| Web container extension | `com.ibm.pvc.webcontainer.application` | Domino's built-in OSGi extension point for static/Java EE webapps |
| Front-end build | Vite 7 | Step 2 only — other steps remain handwritten to keep the showcase layered |
| CI | GitHub Actions | `npm run build` + `mvn -B package`, uploads `update-site-repository` artifact |
| Runtime API | Domino `/api` built-in REST endpoint | Step 3 uses same-origin fetch — no backend code needed |

---

## Design Decisions Worth Noting

**Each step lives in its own subdirectory.** `step1/`, `step2/`, `step3/` coexist rather than overwrite. That makes the layered progression visible in the final deployment.

**`WEB-INF/web.xml` was added** so that both `/hello-webapp/` and `/hello-webapp/index.html` resolve to the home page. Jesse's original ls-classmap reference does not include one; we add it here for cleaner URLs.

**`tycho-p2-repository-plugin` was intentionally removed.** Tycho 4.x needs Java 17; this sample stays Java-8 friendly so anyone on a typical Domino dev machine can build it. The folder output at `target/repository/` is enough for Domino import — the zip-archive step is only a convenience.

**Vite is configured with `base: "./"` and `emptyOutDir: false`.** Relative base keeps the app portable in case the context root changes; `emptyOutDir: false` preserves `WEB-INF/web.xml` across rebuilds. Asset filenames are pinned (`assets/app.js`, `assets/app.css`) so each rebuild produces identical paths — easier to cache-bust, easier to debug.

**Step 3 uses Domino's built-in `/api` endpoint.** No custom Java service had to be written. This proves that the same-origin pattern works end-to-end with a real Domino REST service.

**CI uploads `target/repository/` as-is.** GitHub Actions zips the folder automatically for artifact download. This avoids depending on Tycho's archive step.

---

## Documentation Index

Canonical, long-form records live in `docs/`. Read them in this order:

1. [`docs/domino-static-webapp-tutorial.md`](docs/domino-static-webapp-tutorial.md) — concept overview
2. [`docs/step-1-first-deployment-record.md`](docs/step-1-first-deployment-record.md) — first successful round-trip
3. [`docs/step-2-frontend-replacement-plan.md`](docs/step-2-frontend-replacement-plan.md) — why Vite, how it plugs in
4. [`docs/step-2-vite-implementation-record.md`](docs/step-2-vite-implementation-record.md) — execution record
5. [`docs/step-3-live-api-implementation-record.md`](docs/step-3-live-api-implementation-record.md) — API dashboard
6. [`docs/github-actions-artifact-to-updatesite-guide.md`](docs/github-actions-artifact-to-updatesite-guide.md) — CI → Domino path

Every doc is bilingual (English first, 繁體中文 below).

---

## Credits

Inspired by and building on:

- Jesse Gallagher — [Quick Tip: Deploying Static Resources As A Webapp](https://frostillic.us/blog/posts/2025/6/29/quick-tip-deploying-static-resources-as-a-webapp)
- OpenNTF — [The LotusScript Class Map](https://github.com/OpenNTF/ls-classmap), which demonstrates the same pattern at production scale
- HCL — [XPages Extension Library Deployment in Domino 8.5.3+](https://ds-infolib.hcltechsw.com/ldd/ddwiki.nsf/dx/XPages_Extension_Library_Deployment)

---

---

# 繁體中文

這個 repo 展示如何把**現代前端 + REST API** 部署到 **HCL Domino** 上——不走 XPages、不走 NSF 設計元素、也不直接把檔案丟到伺服器檔案系統。

範例會打包成 **OSGi webapp bundle**，透過 **Eclipse Update Site** 匯入 `updatesite.nsf`，再由 Domino HTTP 以一般 web context root 對外提供。

線上展示：**`https://ap02.domino.com.tw/hello-webapp/`**

## 這個 repo 證明了什麼

- 非 XPages、非 NSF 的前端可以部署在 Domino 上。
- 部署機制（OSGi + update site）與前端實作**完全解耦**——把 Vite 換成 React/Vue，Domino 那端完全不用改。
- 從 build 到上線（build → package → import → sign → restart → serve）可以用**一行 `mvn package`** 加一個 **GitHub Actions** workflow 自動化。
- 不需要自己寫 Java 後端也能有真正的 API。Step 3 直接消費 Domino 內建的 `/api` 端點。

每個階段都在真實 Domino 上跑過，`docs/step-*-record.md` 是**執行紀錄**，不只是理論。

## 快速入門

前置條件：

- **JDK 8 以上**（特意保持 Java 8 可用，因此沒加 Tycho archive 步驟）
- **Maven 3.8+**
- **Node.js 22+**（只在需要重建 Step 2 Vite 前端時才用到）
- 一台你可以重啟的 Domino server，以及一個有權限簽 update site 的 Notes ID

### 1. Build

```powershell
# Step 2 前端（選用，只改 step1 / step3 時不必執行）
cd frontend-vite
npm ci
npm run build

# Domino bundle + update site
cd ..\hello-webapp
mvn package
```

重要輸出：

- `hello-webapp/target/repository/site.xml`
- `hello-webapp/target/repository/plugins/hello-webapp_*.jar`
- `hello-webapp/target/repository/features/hello-webapp.feature_*.jar`

### 2. 部署到 Domino

1. 建立或開啟 `updatesite.nsf`（`Eclipse Update Site` 範本）。
2. 按 **Import Local Update Site**，選 `target/repository/site.xml`。
3. 按 **Sign** 以信任的 ID 簽章。**沒簽章的 bundle 不會被載入**。
4. 伺服器 `notes.ini` 加一次：`OSGI_HTTP_DYNAMIC_BUNDLES=updatesite.nsf`
5. 伺服器 console：`restart task http`
6. 打開 `https://your-server/hello-webapp/`

### 3. 驗證

- `GET /hello-webapp/` → 教程首頁
- `GET /hello-webapp/step2/assets/app.js` → `200 OK`
- 伺服器 console `tell http osgi ss` → 看到 `hello-webapp` 為 **ACTIVE**

如果 bundle 顯示 `INSTALLED` 但非 `ACTIVE`，先檢查簽章，再查 `log.nsf` 裡的 OSGi 啟動錯誤。

## 展示路由

| URL | 內容 |
|---|---|
| `/hello-webapp/` | 教程首頁——三個 step 的總覽 |
| `/hello-webapp/docs/` | 瀏覽器版文件（各 step 說明頁） |
| `/hello-webapp/step1/` | 手寫靜態 demo——證明傳輸層可行 |
| `/hello-webapp/step2/` | Vite build 輸出——證明正式前端 pipeline 可用 |
| `/hello-webapp/step3/` | 讀取 `/api` 的即時儀表板——證明前後端串起來 |

## 技術堆疊

| 層級 | 選擇 | 原因 |
|---|---|---|
| 打包 | `maven-bundle-plugin`（Apache Felix） | 把專案變成 OSGi bundle，不用手刻 `MANIFEST.MF` |
| Update site | `p2-maven-plugin`（OpenNTF）+ `p2sitexml-maven-plugin`（Darwino） | 同時產生 p2 layout 與 `updatesite.nsf` 能讀的舊式 `site.xml` |
| Web 容器擴充點 | `com.ibm.pvc.webcontainer.application` | Domino 內建的 OSGi 擴充點，吃靜態資源與 Java EE webapp |
| 前端 build | Vite 7 | 只有 Step 2 用，其他 step 維持手寫以保留階段感 |
| CI | GitHub Actions | `npm run build` + `mvn -B package`，上傳 `update-site-repository` artifact |
| 執行期 API | Domino 內建 `/api` REST 端點 | Step 3 用 same-origin fetch——完全不用寫後端程式碼 |

## 幾個值得記下來的設計決策

**每個 step 各有子目錄**。`step1/`、`step2/`、`step3/` 共存而非覆蓋，讓階段演進在最終部署上是可見的。

**加了 `WEB-INF/web.xml`**，讓 `/hello-webapp/` 與 `/hello-webapp/index.html` 都能解析到首頁。Jesse 的 ls-classmap 沒加這個，這裡為了乾淨的 URL 補上。

**刻意移除 `tycho-p2-repository-plugin`**。Tycho 4.x 需要 Java 17；這個 sample 要保留 Java 8 友善，讓一般 Domino 開發機都能 build。`target/repository/` 這個資料夾輸出對 Domino 匯入來說已經足夠——zip 打包只是方便性而已。

**Vite 的 `base: "./"` 與 `emptyOutDir: false`**。相對 base 讓 app 在 context root 改變時還能運作；`emptyOutDir: false` 保護 `WEB-INF/web.xml` 不會每次 build 被清掉。Asset 檔名固定為 `assets/app.js`、`assets/app.css`，每次 build 路徑一樣，方便 cache-bust 與除錯。

**Step 3 用 Domino 內建的 `/api`**。不用寫任何 Java 服務就能證明同源 fetch 整條鏈路在真實 Domino REST 服務上跑得通。

**CI 直接上傳 `target/repository/` 資料夾**。GitHub Actions 會自動把它 zip 成 artifact，省掉對 Tycho archive 步驟的依賴。

## 文件索引

完整的執行紀錄都在 `docs/`，建議依此順序閱讀：

1. [`docs/domino-static-webapp-tutorial.md`](docs/domino-static-webapp-tutorial.md) — 概念總覽
2. [`docs/step-1-first-deployment-record.md`](docs/step-1-first-deployment-record.md) — 第一次成功往返
3. [`docs/step-2-frontend-replacement-plan.md`](docs/step-2-frontend-replacement-plan.md) — 為什麼選 Vite、怎麼接
4. [`docs/step-2-vite-implementation-record.md`](docs/step-2-vite-implementation-record.md) — 實作紀錄
5. [`docs/step-3-live-api-implementation-record.md`](docs/step-3-live-api-implementation-record.md) — API 儀表板
6. [`docs/github-actions-artifact-to-updatesite-guide.md`](docs/github-actions-artifact-to-updatesite-guide.md) — CI → Domino 的路徑

每份文件都是雙語（English 在前，繁體中文在後）。

## 致謝

這個 repo 的構想與模式來自：

- Jesse Gallagher — [Quick Tip: Deploying Static Resources As A Webapp](https://frostillic.us/blog/posts/2025/6/29/quick-tip-deploying-static-resources-as-a-webapp)
- OpenNTF — [The LotusScript Class Map](https://github.com/OpenNTF/ls-classmap)，同樣模式的生產級範例
- HCL — [XPages Extension Library Deployment in Domino 8.5.3+](https://ds-infolib.hcltechsw.com/ldd/ddwiki.nsf/dx/XPages_Extension_Library_Deployment)
