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

  browser.pageAction.setIcon({path: icon, tabId: tab.id});
}

browser.pageAction.onClicked.addListener(wantToListen);
