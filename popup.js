document.getElementById("cleanBtn").addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tab || !tab.id) {
        document.getElementById("status").innerText = "No active tab found!";
        return;
    }

    try {

        await chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            func: cleanPage
        });

        document.getElementById("status").innerText =
            "✅ Page cleaned!";

    } catch (error) {

        console.error(error);

        document.getElementById("status").innerText =
            "❌ Cannot clean this page.";

    }

});


document.getElementById("restoreBtn").addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tab || !tab.id) {
        return;
    }

    try {

        await chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            func: restorePage
        });

        document.getElementById("status").innerText =
            "🔄 Page restored!";

    } catch (error) {

        console.error(error);

        document.getElementById("status").innerText =
            "❌ Cannot restore this page.";

    }

});


function cleanPage() {

    const selectors = [
        "aside",
        "nav",
        "[role='complementary']",
        "[role='navigation']",

        "[class*='sidebar']",
        "[class*='side-bar']",
        "[id*='sidebar']",

        "[class*='advert']",
        "[id*='advert']",
        "[class*='ads']",
        "[id*='ads']",

        "[class*='popup']",
        "[class*='modal']",
        "[id*='popup']",
        "[id*='modal']",

        "[class*='social']",
        "[class*='share']",

        "[class*='recommended']",
        "[class*='related']",
        "[class*='suggested']"
    ];

    let count = 0;

    selectors.forEach(selector => {

        document.querySelectorAll(selector).forEach(element => {

            if (element.dataset.cleanpageHidden !== "true") {

                element.dataset.cleanpageHidden = "true";

                element.dataset.cleanpageDisplay =
                    element.style.display;

                element.style.display = "none";

                count++;
            }

        });

    });

    alert("CleanPage removed " + count + " elements.");
}


function restorePage() {

    document
        .querySelectorAll("[data-cleanpage-hidden='true']")
        .forEach(element => {

            element.style.display =
                element.dataset.cleanpageDisplay || "";

            delete element.dataset.cleanpageHidden;
            delete element.dataset.cleanpageDisplay;

        });

    alert("CleanPage restored the page.");
}
