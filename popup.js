document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggleSwitch');

    // Initialize the toggle switch state
    chrome.storage.sync.get(['adblockerEnabled'], (result) => {
        toggleSwitch.checked = result.adblockerEnabled || false;
    });

    // Listen for toggle switch changes
    toggleSwitch.addEventListener('change', () => {
        const isEnabled = toggleSwitch.checked;

        chrome.storage.sync.set({ adblockerEnabled: isEnabled }, () => {
            chrome.runtime.sendMessage({ type: 'TOGGLE_ADBLOCKER', enabled: isEnabled });
        });
    });
});
