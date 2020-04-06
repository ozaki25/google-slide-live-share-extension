const activate = document.querySelectorAll('input[name="activate"]');
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
}

function onChange(e) {
  const { value } = e.target;
  console.log({ value });
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { activateValue: value });
  });
}

window.addEventListener('load', onLoad);
activate.forEach(input => input.addEventListener('change', onChange));
