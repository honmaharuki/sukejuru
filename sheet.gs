//スプレットシートとのやり取りに使われる関数まとめ。

var spreadsheet = SpreadsheetApp.openById("1Gyw_0oNk-sR5VtjxZVsZlEzgl62aDNpcE-DHqTN9a1U");//IDによってどのスプレッドシートを選択するか指定。
var sheet = spreadsheet.getSheetByName('webhook');//シート名を指定。
var PSheet = spreadsheet.getSheetByName('param');//命令用のシートを選択。
var ReSheet = spreadsheet.getSheetByName('IDResult');//登録用のシートを選択。
var dat = sheet.getDataRange().getValues(); //二次元配列で値を取得。
var ReDat = ReSheet.getDataRange().getValues(); //二次元配列で値を取得。
//console.log("SR9:"+ReSheet);
// 行を持ってくる時に本当にすべてを持ってきている。
console.log("SR10"+ReSheet.getDataRange().getValues());

//-----------------------------------------------------------------------------------------------------

function searchContent() { //内容があるか確認 最終行のrowを出す
  //検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
    //console.log("R16:"+ReDat.length);
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
      // console.log("R28:"+lengthI);
      return lengthI;
}

//-----------------------------------------------------------------------------------------------------
// レコードの最終行にタスクを登録
function appendToSheetContent( userId, text ) {
  sheet.appendRow(["",userId,"","",text,updateDateNow(),updateTimeNow()]);//シートwebhookにレコードを追加。
  return '「' + text + ' 」だね。覚えたよ\nいつ教えてほしい？\n例：「10分後」「11月23日17時00分」など\n「○分後」か、「○月○日○時○分」形式で教えてね。そうしないと正しく時間を登録できないよ！\n「キャンセル」って言ってくれればやめるよ。';
}

// レコードの最後に追加
function appendToSheet(text) {
  sheet.appendRow([,text]);//シートwebhookにレコードを追加。
  
}
function appendTodataSheet(text) {
  sheet.appendRow([,text]);//シートDataにレコードを追加。
  
}
function searchRowNum(searchVal, col) { //受け取ったシートのデータを二次元配列に取得。
//検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
  for (var i = 0; i < dat.length; i++) { //.length 配列の要素の個数を返す。datに入っている値の分回る。
    if (dat[i][col] === searchVal) { //渡されたuserIdと一致する値があれば何行目に入っていたのかその値を返す。
      return i;
    }
  }
  return false;
}
// 日付を入れるべきrowを取得
function insertSearchUseridRowNum() { //受け取ったシートのデータを二次元配列に取得。
  // ReSheet = spreadsheet.getSheetByName('IDResult');//登録用のシートを選択。  
  // console.log("RS61:"+ReSheet);
  // ReDat = ReSheet.getDataRange().getValues(); //二次元配列で値を取得。
  // console.log("RS63:"+ReDat);
  //検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
    if(ReDat.length == 1){
      return false;
    }else{
      console.log("RS64:"+ReDat);
      console.log("RS65:"+ReDat[1][0]);
      return ReDat[1][0];
    }
    
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
  sheet.getRange(row, col).setValue(val);
  updateNowSet(row);
}
function setDateTimeRowCol(valDate,valTime, row) {//row,colで場所指定、値 書き込み。
  sheet.getRange(row, 3).setValue(valDate); //date
  sheet.getRange(row, 4).setValue(valTime); //time
  updateNowSet(row);
}
function setFromRowColData(val, row, col) {//row,colで場所指定、値 書き込み。
  sheet.getRange(row, col).setValue(val);
}
function getUserIdCell(row) {// UserId どのLINEから送られた情報か、端末を識別する為の情報のセルを取得
  return sheet.getRange(row + 1, 1);
}
function getTodoCell(row) { //LINEから送られたタスクが保存されたセルを取得
  return sheet.getRange(row + 1, 2);
}
function getUserIdCelldata(row) {// UserId どのLINEから送られた情報か、端末を識別する為の情報のセルを取得
  return sheet.getRange(row + 1, 1);
}
function getTodoCelldata(row) { //LINEから送られたタスクが保存されたセルを取得
  return sheet.getRange(row + 1, 2);
}

function getDateCell(row) {//日付の情報が保存されたセルを取得
  return sheet.getRange(row + 1, 3);
}
function getTriggerCell(row) {//トリガーが保存されたセルを取得
  return sheet.getRange(row + 1, 4);
}
// 今の日付を返す。
function updateDateNow(){
  
  return  Moment.moment().format('YYYY-MM-DD');
}
// 今の時間を返す。
function updateTimeNow(){
  return  Moment.moment().format('H:m:0');
}
// // 今の時間を返す。
// function updateNow(){
//   return  Moment.moment().format('YYYY-MM-DD!H:m:s');
// }
// 送られてきた行に今の時間を書き込み
function updateNowSet(row){
  sheet.getRange(row, 6).setValue(updateDateNow());
  sheet.getRange(row, 7).setValue(updateTimeNow());
}


/****************       param       *****************/
function setPsheetFromRowColData(val, row, col) {//row,colで場所指定、値 書き込み。
  PSheet.getRange(row, col).setValue(val);
}