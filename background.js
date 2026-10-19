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

// The pages Digs can add releases from. Keep in sync with `show_matches` on the
// firefox branch.
const supportedPages = [
  { hostEquals: 'www.discogs.com', pathPrefix: '/master/' },
  { hostEquals: 'www.discogs.com', pathPrefix: '/release/' },
  { hostEquals: 'open.spotify.com', pathPrefix: '/album/' },
  { originAndPathMatches: '^https://www\\.mixcloud\\.com/[^/]+/[^/]+' },
  { hostSuffix: '.bandcamp.com', pathPrefix: '/album/' },
  { hostEquals: 'musicbrainz.org', pathPrefix: '/release/' },
  { hostEquals: 'musicbrainz.org', pathPrefix: '/release-group/' },
  { originAndPathMatches: '^https://soundcloud\\.com/[^/]+/[^/]+' },
  { hostSuffix: '.tidal.com', pathPrefix: '/album/' },
  { hostSuffix: '.tidal.com', pathPrefix: '/browse/album/' },
  // only albums' playlist IDs start with OLAK5uy_
  { hostEquals: 'music.youtube.com', pathEquals: '/playlist', queryPrefix: 'list=OLAK5uy_' }
];

// The button starts disabled and Chrome enables it on supported pages, so the
// extension never reads the tab's address (that would need a permission that
// warns about access to the browsing history).
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: supportedPages.map(pageUrl => new chrome.declarativeContent.PageStateMatcher({ pageUrl })),
      actions: [new chrome.declarativeContent.ShowAction()]
    }]);
  });
});

chrome.action.onClicked.addListener(wantToListen);
