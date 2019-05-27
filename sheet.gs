//スプレットシートとのやり取りに使われる関数まとめ。

var spreadsheet = SpreadsheetApp.openById("1pMbk7Bv6XfMwTzV2yrnTSmZTPRYpSb_YNIk7q7bMIYQ");//IDによってどのスプレッドシートを選択するか指定。
var sheet = spreadsheet.getSheetByName('webhook');//シート名を指定。
function appendToSheet(text) {
  sheet.appendRow([text]);//変数sheetにレコードを追加。
}
function searchRowNum(searchVal, col) { //受け取ったシートのデータを二次元配列に取得。
//検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
  var dat = sheet.getDataRange().getValues(); //二次元配列で値を取得。
  for (var i = 0; i < dat.length; i++) { //.length 配列の要素の個数を返す。　datに入っている値の分回る。
    if (dat[i][col] === searchVal) { //渡されたuserIdと一致する値があれば何行目に入っていたのかその値を返す。
      return i;
    }
  }
  return false;
}
function getFromRowCol(sheetName, row, col) {//row,colで場所指定、値　読み込み。
  var dat = sheet.getDataRange().getValues(); // sheet.getDataRange().getValues()でシートのデータ全てを二次元配列で取得している。
  return dat[row][col]; //行、列の指定された値を返す。
}
function setFromRowCol(val, row, col) {//row,colで場所指定、値　書き込み。
  sheet.getRange(row + 1, col + 1).setValue(val);
}
function getUserIdCell(row) {// UserId どのLINEから送られた情報か、端末を識別する為の情報のセルを取得
  return sheet.getRange(row + 1, 1);
}
function getTodoCell(row) { //LINEから送られたタスクが保存されたセルを取得
  return sheet.getRange(row + 1, 2);
}
function getDateCell(row) {//日付の情報が保存されたセルを取得
  return sheet.getRange(row + 1, 3);
}
function getTriggerCell(row) {//トリガーが保存されたセルを取得
  return sheet.getRange(row + 1, 4);
}