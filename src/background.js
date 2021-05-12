// eslint-disable-next-line no-unused-vars
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    browser.tabs.executeScript({
        file: 'content-script.js',
    });
});