const defaultFilters = [
    "*://*.doubleclick.net/*",
    "*://partner.googleadservices.com/*",
    "*://*.googlesyndication.com/*",
    "*://*.google-analytics.com/*",
    "*://creative.ak.fbcdn.net/*",
    "*://*.adbrite.com/*",
    "*://*.exponential.com/*",
    "*://*.quantserve.com/*",
    "*://*.scorecardresearch.com/*",
    "*://*.zedo.com/*",
];

const rules = defaultFilters.map((filter, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: filter }
}));

chrome.runtime.onInstalled.addListener(() => {
    // Check the initial state from storage and apply rules if needed
    chrome.storage.sync.get(['adblockerEnabled'], (result) => {
        if (result.adblockerEnabled) {
            enableAdblocker();
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOGGLE_ADBLOCKER') {
        if (message.enabled) {
            enableAdblocker();
        } else {
            disableAdblocker();
        }
    }
});

function enableAdblocker() {
    // First, remove all existing rules
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
        const existingRuleIds = existingRules.map(rule => rule.id);
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRuleIds,
            addRules: rules
        });
    });
}

function disableAdblocker() {
    // Remove all rules
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
        const existingRuleIds = existingRules.map(rule => rule.id);
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRuleIds
        });
    });
}
