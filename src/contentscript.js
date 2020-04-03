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
  chrome.storage.sync.get('checked', ({ checked }) => {
    const { hostname } = window.location;
    window.onMessage({ isChecked: checked && checked[hostname] });
  });
}

function main() {
  let count = 0;
  document.addEventListener('script-loaded', () => {
    count += 1;
    if (count === urlList.length) onInit();
  });
  urlList.forEach(src => injectScripts(src));
}

function onMessage({ isChecked }) {
  chrome.storage.sync.get(
    ['checked', 'apiKey', 'projectId'],
    ({ checked, apiKey, projectId }) => {
      const eventName = isChecked
        ? 'subscribe-firestore'
        : 'unsubscribe-firestore';
      const event = new CustomEvent(eventName, {
        detail: { apiKey, projectId },
      });
      document.dispatchEvent(event);

      const { hostname } = window.location;
      chrome.storage.sync.set({
        checked: { ...checked, [hostname]: isChecked },
      });
      console.log({ checked: { ...checked, [hostname]: isChecked } });
    },
  );
}

function onChangeStorage({ checked }) {
  const { newValue } = checked;
  const { hostname } = window.location;
  const eventName = newValue[hostname]
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
