// variables
const button = document.querySelector('#submit');
const inputApiKey = document.querySelector('#apiKey');
const inputProjectId = document.querySelector('#projectId');
const clear = document.querySelector('#clear');

// functions
function onClickSubmit(e) {
  e.preventDefault();
  const apiKey = inputApiKey.value.trim();
  const projectId = inputProjectId.value.trim();
  if (!apiKey || !projectId) {
    alert('入力して下さい！！');
    return;
  }
  chrome.storage.sync.set({ apiKey, projectId }, () => {
    alert('保存しました！！');
  });
}

function onClickClear(e) {
  e.preventDefault();
  const res = window.confirm('保存したデータを削除します\nよろしいですか？');
  if (res) {
    chrome.storage.sync.clear(() => {
      alert('保存されたデータを削除しました');
    });
  }
}

function init() {
  chrome.storage.sync.get(['apiKey', 'projectId'], ({ apiKey, projectId }) => {
    inputApiKey.value = apiKey || '';
    inputProjectId.value = projectId || '';
  });
}

// listeners
button.addEventListener('click', onClickSubmit);
clear.addEventListener('click', onClickClear);

// executes
init();
