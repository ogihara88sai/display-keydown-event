let mainTable;
let subTable;
let copyResult;
let inputHistory = [];
const propNames = ['key', 'keyCode', 'code', 'altKey', 'ctrlKey', 'shiftKey'];
function init() {
  mainTable = document.querySelector('#table_main tbody');
  subTable = document.querySelector('#table_sub tbody');
  copyResult = document.querySelector('#result');
  const isDownMap = {};
  window.addEventListener('keydown', e => {
    const str = document.getSelection().toString();
    if (str) return;
    if (isDownMap[e.key]) return e.preventDefault();
    isDownMap[e.key] = true;
    inputHistory.unshift(e);
    inputHistory = inputHistory.slice(0, 10);
    updateTable();
    console.log('=== keydown === ');
    console.log('key: ' + e.key);
    console.log('keyCode: ' + e.keyCode);
    console.log('code: ' + e.code);
    console.log('altKey: ' + e.altKey);
    console.log('ctrlKey: ' + e.ctrlKey);
    console.log('shiftKey: ' + e.shiftKey);
    e.preventDefault();
  });
  window.addEventListener('keyup', e => {
    isDownMap[e.key] = false;
  });
}
function updateTable() {
  if (inputHistory[0]) {
    mainTable.innerHTML = buildTrHTML(inputHistory[0], true);
  }
  let html = '';
  for (let i = 1; i < inputHistory.length; i++) {
    html += buildTrHTML(inputHistory[i]);
  }
  subTable.innerHTML = html;
}
function buildTrHTML(e, bool) {
  let html = '<tr>';
  for (const propName of propNames) {
    if (propName === 'key') {
      const id = bool ? 'key' : '';
      html += `<td>"<span id="${id}">${e[propName]}</span>"</td>`;
    } else {
      html += `<td>${e[propName]}</td>`;
    }
  }
  return html + '</tr>';
}
window.addEventListener('DOMContentLoaded', init);
function copy(bool) {
  if (inputHistory[0]) {
    let str = inputHistory[0].key;
    if (bool) str = '"' + str + '"';
    const onSuccess = () => {
      copyResult.innerHTML = `次の文字列をコピーしました: <span>${str}</span>`;
    };
    const onFailure = () => {
      copyResult.innerHTML = `文字列のコピーに失敗しました。`;
    };
    copyToClipboard(str, onSuccess, onFailure);
  }
}
/**
 * Thanks to @kumanobori !
 * https://qiita.com/kumanobori/items/25c1b49617c61b5ef4cd
 */
function copyToClipboard(value, onSuccess, onFailure) {
  if (typeof navigator.clipboard === 'object') {
    navigator.clipboard.writeText(value).then(
      function () {
        onSuccess();
      },
      function () {
        const result = copyToClipboard2(value);
        if (result) onSuccess();
        else onFailure();
      }
    );
    return;
  }
  if (typeof window.clipboardData === 'object') {
    window.clipboardData.setData('Text', value);
    onSuccess();
    return;
  }
  const result = copyToClipboard2(value);
  if (result) onSuccess();
  else onFailure();
}
/**
 * Thanks to @simiraaaa !
 * https://qiita.com/simiraaaa/items/2e7478d72f365aa48356
 */
function copyToClipboard2(str) {
  var tmp = document.createElement('div');
  var pre = document.createElement('pre');
  pre.style.userSelect = 'auto';
  tmp.appendChild(pre).textContent = str;
  var s = tmp.style;
  s.position = 'fixed';
  s.right = '200%';
  document.body.appendChild(tmp);
  document.getSelection().selectAllChildren(tmp);
  var result = document.execCommand('copy');
  document.body.removeChild(tmp);
  return result;
}
