const iconSuccess = 'icons/success.png';
const iconError = 'icons/error.png';

async function wantToListen(tab) {
  response = await fetch("https://digs.fm/queued/add-from-extension", {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({query: tab.url})
  });

  let icon;

  if (response.status == 201 || response.status == 409) {
    icon = iconSuccess;
  } else {
    icon = iconError;
  }

  chrome.pageAction.setIcon({path: icon, tabId: tab.id});
}

function showAction(tabId, changeInfo, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.pageAction.show(tabs[0].id);
  });
};

chrome.tabs.onUpdated.addListener(showAction);
chrome.pageAction.onClicked.addListener(wantToListen);
