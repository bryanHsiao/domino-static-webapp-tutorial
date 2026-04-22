(function () {
    var storageKey = "tutorial-site-lang";

    function applyLanguage(lang) {
        document.body.setAttribute("data-lang", lang);
        document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";

        var buttons = document.querySelectorAll(".lang-toggle");
        buttons.forEach(function (button) {
            button.textContent = lang === "zh"
                ? (button.getAttribute("data-label-zh") || "English")
                : (button.getAttribute("data-label-en") || "中文");
        });

        window.dispatchEvent(new CustomEvent("site-language-change", {
            detail: { lang: lang }
        }));
    }

    function toggleLanguage() {
        var current = document.body.getAttribute("data-lang") || "zh";
        var next = current === "zh" ? "en" : "zh";
        localStorage.setItem(storageKey, next);
        applyLanguage(next);
    }

    window.addEventListener("DOMContentLoaded", function () {
        var saved = localStorage.getItem(storageKey) || "zh";
        applyLanguage(saved);
    });

    document.addEventListener("click", function (event) {
        var button = event.target.closest(".lang-toggle");
        if (button) {
            toggleLanguage();
        }
    });
})();
