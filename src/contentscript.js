// variables
const urlList = [
  'src/libs/firebase-app.js',
  'src/libs/firebase-firestore.js',
  'src/inject.js',
];

// functions
function injectScripts(src) {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL(src);
  // eslint-disable-next-line
  s.onload = function() {
    this.remove();
    const event = new Event('script-loaded');
    document.dispatchEvent(event);
  };
  (document.head || document.documentElement).appendChild(s);
}

function onInit() {
  console.log('init');
}

function main() {
  let count = 0;
  document.addEventListener('script-loaded', () => {
    count += 1;
    if (count === urlList.length) onInit();
  });
  urlList.forEach(src => injectScripts(src));
}

function onMessage({ activateValue }) {
  console.log(`onMessage#activateValue: ${activateValue}`);
  chrome.storage.sync.get(['apiKey', 'projectId'], ({ apiKey, projectId }) => {
    const eventName = activateValue
      ? 'subscribe-firestore'
      : 'unsubscribe-firestore';
    const event = new CustomEvent(eventName, { detail: { apiKey, projectId } });
    document.dispatchEvent(event);
  });
}

function onChangeStorage({ activateValue }) {
  console.log(`onChangeStorage#activateValue: ${activateValue}`);
  const eventName = activateValue
    ? 'subscribe-firestore'
    : 'unsubscribe-firestore';
  const event = new Event(eventName);
  document.dispatchEvent(event);
}

// listeners
chrome.runtime.onMessage.addListener(onMessage);
chrome.storage.onChanged.addListener(onChangeStorage);

// executes
main();
