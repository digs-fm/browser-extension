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

  chrome.action.setIcon({path: icon, tabId: tab.id});
}

function showAction(tabId, changeInfo, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let tab = tabs[0];
    let url = tab.url;

    if (url.startsWith('https://www.discogs.com/master/*') ||
      url.startsWith('https://www.discogs.com/release/*')  ||
      url.startsWith('https://open.spotify.com/album/*')   ||
      url.startsWith('https://www.mixcloud.com/*/*')       ||
      url.startsWith('https://*.bandcamp.com/album/*')) {
      chrome.pageAction.show(tabs.id);
    } else {
      chrome.pageAction.hide(tabs.id);
    }
  });
};

chrome.tabs.onUpdated.addListener(showAction);
chrome.action.onClicked.addListener(wantToListen);
