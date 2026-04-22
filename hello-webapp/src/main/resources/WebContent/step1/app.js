(() => {
    const messages = {
        zh: {
            yes: "是",
            check: "請確認部署路徑",
            labels: [
                "目前網址",
                "步驟路徑是否正確",
                "JavaScript 是否成功載入",
                "目前階段",
                "時間戳記"
            ],
            stage: "步驟一靜態 sample"
        },
        en: {
            yes: "yes",
            check: "check deployment path",
            labels: [
                "Current URL",
                "Step path looks correct",
                "JavaScript loaded",
                "Stage",
                "Timestamp"
            ],
            stage: "Step 1 static sample"
        }
    };

    const list = document.getElementById("checks");

    function render() {
        const lang = document.body.getAttribute("data-lang") || "zh";
        const text = messages[lang];
        const checks = [
            [text.labels[0], window.location.href],
            [text.labels[1], window.location.pathname.includes("/step1/") ? text.yes : text.check],
            [text.labels[2], text.yes],
            [text.labels[3], text.stage],
            [text.labels[4], new Date().toLocaleString()]
        ];

        list.innerHTML = "";
        for (const [label, value] of checks) {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${label}:</strong> ${value}`;
            list.appendChild(li);
        }
    }

    window.addEventListener("site-language-change", render);
    render();
})();
