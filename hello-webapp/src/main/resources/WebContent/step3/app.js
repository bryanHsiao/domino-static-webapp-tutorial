(function () {
    const endpoint = new URL("/api", window.location.origin).toString();
    const text = {
        zh: {
            button: "重新抓取資料",
            waiting: "等待回應…",
            loading: "載入中",
            loadingMessage: "正在向 Domino API 根端點取得即時資料。",
            success: "成功",
            successMessage: "已成功載入即時資料，下方卡片反映目前的服務狀態。",
            error: "錯誤",
            errorMessage: "即時請求失敗。請檢查端點、權限或瀏覽器 console。",
            requestFailed: "請求失敗",
            servicesLoaded: "筆服務已從 /api 載入",
            enabled: "已啟用",
            disabled: "未啟用"
        },
        en: {
            button: "Refresh Data",
            waiting: "Waiting for response…",
            loading: "Loading",
            loadingMessage: "Fetching live data from the Domino API root endpoint.",
            success: "Success",
            successMessage: "Live data loaded successfully. The cards below reflect the current API service status.",
            error: "Error",
            errorMessage: "The live request failed. Check the endpoint, auth, or browser console for more detail.",
            requestFailed: "Request failed",
            servicesLoaded: " services loaded from /api",
            enabled: "Enabled",
            disabled: "Disabled"
        }
    };

    const state = {
        data: null,
        status: "loading",
        error: null
    };

    const elements = {
        apiUrl: document.getElementById("api-url"),
        refreshButton: document.getElementById("refresh-button"),
        total: document.getElementById("total-count"),
        enabled: document.getElementById("enabled-count"),
        disabled: document.getElementById("disabled-count"),
        lastRefresh: document.getElementById("last-refresh"),
        statusChip: document.getElementById("status-chip"),
        statusCopy: document.getElementById("status-copy"),
        servicesGrid: document.getElementById("services-grid"),
        rawJson: document.getElementById("raw-json"),
        panelMeta: document.getElementById("panel-meta")
    };

    elements.apiUrl.textContent = endpoint;

    function lang() {
        return document.body.getAttribute("data-lang") || "zh";
    }

    function renderStatus() {
        const current = text[lang()];
        elements.refreshButton.textContent = current.button;
        elements.statusChip.className = "status-chip " + state.status;
        elements.statusChip.textContent = current[state.status] || current.loading;

        if (state.status === "error") {
            elements.statusCopy.textContent = current.errorMessage;
        } else if (state.status === "success") {
            elements.statusCopy.textContent = current.successMessage;
        } else {
            elements.statusCopy.textContent = current.loadingMessage;
        }
    }

    function renderData() {
        const current = text[lang()];
        const services = state.data && Array.isArray(state.data.services) ? state.data.services : [];
        const enabledCount = services.filter(function (service) {
            return Boolean(service.enabled);
        }).length;

        elements.total.textContent = String(services.length);
        elements.enabled.textContent = String(enabledCount);
        elements.disabled.textContent = String(services.length - enabledCount);
        elements.lastRefresh.textContent = services.length ? new Date().toLocaleTimeString() : current.waiting;
        elements.panelMeta.textContent = services.length ? String(services.length) + current.servicesLoaded : current.waiting;
        elements.rawJson.textContent = state.error
            ? String(state.error && state.error.message ? state.error.message : state.error)
            : (state.data ? JSON.stringify(state.data, null, 2) : current.waiting);

        elements.servicesGrid.innerHTML = "";
        services.forEach(function (service, index) {
            const card = document.createElement("article");
            const href = new URL(service.href, window.location.origin).toString();
            const badge = service.enabled ? current.enabled : current.disabled;

            card.className = "service-card " + (service.enabled ? "enabled" : "disabled");
            card.style.animationDelay = (index * 70) + "ms";
            card.innerHTML = [
                '<div class="service-topline">',
                '<p class="service-name">' + service.name + "</p>",
                '<span class="service-badge ' + (service.enabled ? "enabled" : "disabled") + '">' + badge + "</span>",
                "</div>",
                '<p class="service-version">' + service.version + "</p>",
                '<a class="service-link" href="' + href + '" target="_blank" rel="noreferrer">' + service.href + "</a>"
            ].join("");
            elements.servicesGrid.appendChild(card);
        });
    }

    function renderAll() {
        renderStatus();
        renderData();
    }

    async function loadData() {
        elements.refreshButton.disabled = true;
        state.status = "loading";
        state.error = null;
        renderAll();

        try {
            const response = await fetch(endpoint, {
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            state.data = await response.json();
            state.status = "success";
        } catch (error) {
            state.data = null;
            state.error = error;
            state.status = "error";
            elements.panelMeta.textContent = text[lang()].requestFailed;
        } finally {
            elements.refreshButton.disabled = false;
            renderAll();
        }
    }

    elements.refreshButton.addEventListener("click", loadData);
    window.addEventListener("site-language-change", renderAll);

    renderAll();
    loadData();
})();
