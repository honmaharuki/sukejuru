//スプレットシートとのやり取りに使われる関数まとめ。

var spreadsheet = SpreadsheetApp.openById("1Gyw_0oNk-sR5VtjxZVsZlEzgl62aDNpcE-DHqTN9a1U");//IDによってどのスプレッドシートを選択するか指定。
var sheet = spreadsheet.getSheetByName('webhook');//シート名を指定。
var PSheet = spreadsheet.getSheetByName('param');//命令用のシートを選択。
var ReSheet = spreadsheet.getSheetByName('result');//表示用のシートを選択。
var dat = sheet.getDataRange().getValues(); //二次元配列で値を取得。
var ReDat = ReSheet.getDataRange().getValues(); //二次元配列で値を取得。


//-----------------------------------------------------------------------------------------------------

function searchContent() { //内容があるか確認 最終行のrowを出す
  //検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
    console.log(ReDat.length);
    return ReDat.length;
}

function searchDate() { //日付があるか確認 日付の最終行のrowを出す
    //検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
    lengthI = 0;
      for (var i = 0; i < ReDat.length; i++) { //.length 配列の要素の個数を返す。 datに入っている値の分回る。
        if (ReDat[i][2]) { //渡されたuserIdと一致する値があれば何行目に入っていたのかその値を返す。
          lengthI++;
        }
      }
       console.log(lengthI);
      return lengthI;
}

//-----------------------------------------------------------------------------------------------------


function appendToSheet(text) {
  sheet.appendRow([text]);//シートwebhookにレコードを追加。
}
function appendTodataSheet(text) {
  datasheet.appendRow([text]);//シートDataにレコードを追加。
}
function searchRowNum(searchVal, col) { //受け取ったシートのデータを二次元配列に取得。
//検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
  for (var i = 0; i < dat.length; i++) { //.length 配列の要素の個数を返す。　datに入っている値の分回る。
    if (dat[i][col] === searchVal) { //渡されたuserIdと一致する値があれば何行目に入っていたのかその値を返す。
      return i;
    }
  }
  return false;
}
function searchRowNumData(searchVal, col) { //受け取ったシートのデータを二次元配列に取得。
//検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
  for (var i = 0; i < dat.length; i++) { //.length 配列の要素の個数を返す。datに入っている値の分回る。
    if (dat[i][col] === searchVal) { //渡されたuserIdと一致する値があれば何行目に入っていたのかその値を返す。
      return i;
    }
  }
  return false;
}

function getFromRowCol(sheetName, row, col) {//row,colで場所指定、値 読み込み。
  return dat[row][col]; //行、列の指定された値を返す。
}
function setFromRowCol(val, row, col) {//row,colで場所指定、値 書き込み。
  datasheet.getRange(row + 1, col + 1).setValue(val);
}
function setFromRowColData(val, row, col) {//row,colで場所指定、値 書き込み。
  datasheet.getRange(row + 1, col + 1).setValue(val);
}
function getUserIdCell(row) {// UserId どのLINEから送られた情報か、端末を識別する為の情報のセルを取得
  return datasheet.getRange(row + 1, 1);
}
function getTodoCell(row) { //LINEから送られたタスクが保存されたセルを取得
  return sheet.getRange(row + 1, 2);
}
function getUserIdCelldata(row) {// UserId どのLINEから送られた情報か、端末を識別する為の情報のセルを取得
  return datasheet.getRange(row + 1, 1);
}
function getTodoCelldata(row) { //LINEから送られたタスクが保存されたセルを取得
  return datasheet.getRange(row + 1, 2);
}

function getDateCell(row) {//日付の情報が保存されたセルを取得
  return datasheet.getRange(row + 1, 3);
}
function getTriggerCell(row) {//トリガーが保存されたセルを取得
  return datasheet.getRange(row + 1, 4);
}