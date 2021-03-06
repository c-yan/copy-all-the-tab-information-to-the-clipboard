'use strict';
(() => {
    const MENU_ITEM_ID = 'copy-tab-info-to-clipboard';

    function copyToClipboardWrapper(text) {
        const script = `
            (text => {
                function onCopy(event) {
                    document.removeEventListener('copy', onCopy, true);
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    event.clipboardData.setData('text/plain', text);
                }
                document.addEventListener('copy', onCopy, true);
                document.execCommand('copy');
            })(${JSON.stringify(text)});
        `;
        browser.tabs.executeScript({ code: script });
    }

    async function onCopyAllTabInfoToClipboard(info, tab) {
        const tabs = await browser.tabs.query({});
        let result = '';
        for (const t of tabs) {
            result += `${t.title} ${t.url}\r\n`;
        }
        copyToClipboardWrapper(result);
    }

    browser.menus.onClicked.addListener((info, tab) => {
        if (info.menuItemId == MENU_ITEM_ID) onCopyAllTabInfoToClipboard(info, tab);
    });

    browser.menus.create({ id: MENU_ITEM_ID, title: browser.i18n.getMessage('menuItemTitle'), contexts: ['page', 'tools_menu'] });
})();
