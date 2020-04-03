const checkbox = document.querySelector('#activate');
const initialized = document.querySelector('.initialized');
const uninitialized = document.querySelector('.uninitialized');

function onLoad() {
  chrome.storage.sync.get(['apiKey', 'projectId'], ({ apiKey, projectId }) => {
    if (apiKey && projectId) {
      initialized.style.display = 'block';
      uninitialized.style.display = 'none';
    } else {
      initialized.style.display = 'none';
      uninitialized.style.display = 'block';
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const { url } = tabs[0];
    const { hostname } = new URL(url);
    chrome.storage.sync.get('checked', ({ checked }) => {
      checkbox.checked = checked[hostname];
    });
  });
}

function onChange(e) {
  const isChecked = e.target.checked;
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { isChecked });
  });
}

window.addEventListener('load', onLoad);
checkbox.addEventListener('change', onChange);
