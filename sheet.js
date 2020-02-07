//スプレットシートとのやり取りに使われる関数まとめ。

// メモ化を行う関数
function getMainSheet(){
  if(getMainSheet.memoSheet){return getMainSheet.memoSheet;}
  getMainSheet.memoSheet = SpreadsheetApp.openById("1Gyw_0oNk-sR5VtjxZVsZlEzgl62aDNpcE-DHqTN9a1U");//IDによってどのスプレッドシートを選択するか指定。
  return getMainSheet.memoSheet;
}
// webhookシートを指定する。
function getWbhook(){
  if(getWbhook.memoSheet){return getWbhook.memoSheet;}

  getWbhook.memoSheet = getMainSheet().getSheetByName('webhook');
  return getWbhook.memoSheet;
}
// paramシートを指定する。
function getParam(){
  if(getParam.memoSheet){return getParam.memoSheet;}
  getParam.memoSheet = getMainSheet().getSheetByName('param');
  
  return getParam.memoSheet;
}
// resultシートを指定する。
function getResult(){
  if(getResult.memoSheet){return getResult.memoSheet;}
  getResult.memoSheet = getMainSheet().getSheetByName('result');
  
  return getResult.memoSheet;
}
// IDResultシートを指定する。
function getIDResult(){
  if(getIDResult.memoSheet){return getIDResult.memoSheet;}

  getIDResult.memoSheet = getMainSheet().getSheetByName('IDResult');
  return getIDResult.memoSheet;
}
// CheckScheduleシートを指定する。
function getCheckSchedule(){
  if(getCheckSchedule.memoSheet){return getCheckSchedule.memoSheet;}

  getCheckSchedule.memoSheet = getMainSheet().getSheetByName('CheckSchedule');
  return getCheckSchedule.memoSheet;
}
///--------------------------------------------------------------------------------------
// dataの取得
function getValuesWbhook(){

  dat = getWbhook().getDataRange().getValues(); //二次元配列で値を取得。
  return dat;
}
function getValuesIDResult(){
  ReDat = getIDResult().getDataRange().getValues(); //二次元配列で値を取得。
  return ReDat;
}
function getValuesResult(){
  ResultDat = getResult().getDataRange().getValues(); //二次元配列で値を取得。
  return ResultDat;
}
function getValuesCheckSchedule(){
  CheckScheduleDat = getCheckSchedule().getDataRange().getValues(); //二次元配列で値を取得。
  console.log("SR61:"+CheckScheduleDat);

  return CheckScheduleDat;
}

//-----------------------------------------------------------------------------------------------------
///--------------------------------------------------------------------------------------
// // dataの取得
// var dat = getWbhook.getDataRange().getValues(); //二次元配列で値を取得。
// var ReDat = getParam.getDataRange().getValues(); //二次元配列で値を取得。

// //-----------------------------------------------------------------------------------------------------

function searchContent() { //内容があるか確認 最終行のrowを出す
  var ReDat = getValuesIDResult();
  //検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
    //console.log("R16:"+ReDat.length);
    return ReDat.length;
}

function searchDate() { //日付があるか確認 日付の最終行のrowを出す
  var ReDat = getValuesIDResult();

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
  var sheet = getWbhook();
  sheet.appendRow(["",userId,"","",text,updateDateNow(),updateTimeNow()]);//シートwebhookにレコードを追加。
  return '「' + text + ' 」だね。覚えたよ\nいつ教えてほしい？\n例：「10分後」「11月23日17時00分」など\n「○分後」か、「○月○日○時○分」形式で教えてね。そうしないと正しく時間を登録できないよ！\n「キャンセル」って言ってくれればやめるよ。';
}

function setAAAAAColData() {//row,colで場所指定、値 書き込み。
  var sheet = getWbhook();

  var  val = 1;

  sheet.getRange(2, 5).setValue(val);
}

// レコードの最後に追加
function appendToSheet(text) {
  var sheet = getWbhook();
  sheet.appendRow([,text]);//シートwebhookにレコードを追加。
  
}
function appendTodataSheet(text) {
  var sheet = getWbhook();
  sheet.appendRow([,text]);//シートDataにレコードを追加。
  
}
function searchRowNum(searchVal, col) { //受け取ったシートのデータを二次元配列に取得。
//検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
var dat = getValuesWbhook();
  for (var i = 0; i < dat.length; i++) { //.length 配列の要素の個数を返す。datに入っている値の分回る。
    if (dat[i][col] === searchVal) { //渡されたuserIdと一致する値があれば何行目に入っていたのかその値を返す。
      return i;
    }
  }
  return false;
}
function searchCheckScheduleRowNum(searchVal, col) { //受け取ったシートのデータを二次元配列に取得。
  //検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
  var dat = getValuesCheckSchedule();
    for (var i = 0; i < dat.length; i++) { //.length 配列の要素の個数を返す。datに入っている値の分回る。
      if (dat[i][col] === searchVal) { //渡されたuserIdと一致する値があれば何行目に入っていたのかその値を返す。
        return i;
      }
    }
    return false;
  }
function searchCheckUserDataRow(userId) { // userIdが登録されている検索。 何行目に入っていたかを返却。 ない場合にはfalseを返却。
  userDataRow = searchCheckScheduleRowNum(userId, 0); //sheet.gsに関数あり。
  console.log("SR144:"+userDataRow);

  if (userDataRow === false) { //もし登録されていなければ
    userDataRow = false;
  }
  return userDataRow; //userIdが何行目かを返却。
}
// 日付を入れるべきrowを取得
function insertSearchUseridRowNum() { //受け取ったシートのデータを二次元配列に取得。
  var ReDat = getValuesIDResult();
  // ReSheet = spreadsheet.getSheetByName('IDResult');//登録用のシートを選択。  
  // console.log("RS61:"+ReSheet);
  // ReDat = ReSheet.getDataRange().getValues(); //二次元配列で値を取得。
  // console.log("RS63:"+ReDat);
  //検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
    if(ReDat.length == 1){
      return false;
    }else{
      // console.log("RS64:"+ReDat);
      // console.log("RS65:"+ReDat[1][0]);
       return ReDat[1][0];
    }
    
  }
function searchRowNumData(searchVal, col) { //受け取ったシートのデータを二次元配列に取得。
//検索する値とcolを指定して、見つけた行の番号を返す。なければfalseを返す。
var dat = getValuesWbhook();  
for (var i = 0; i < dat.length; i++) { //.length 配列の要素の個数を返す。datに入っている値の分回る。
    if (dat[i][col] === searchVal) { //渡されたuserIdと一致する値があれば何行目に入っていたのかその値を返す。
      return i;
    }
  }
  return false;
}

function getFromRowCol(sheetName, row, col) {//row,colで場所指定、値 読み込み。
  var dat = getValuesWbhook();  

  return dat[row][col]; //行、列の指定された値を返す。
}

function setFromRowCol(val, row, col) {//row,colで場所指定、値 書き込み。
  var sheet = getWbhook();
  sheet.getRange(row, col).setValue(val);
  updateNowSet(row);
}
function setDateTimeRowCol(valDate,valTime, row) {//row,colで場所指定、値 書き込み。
  var sheet = getWbhook();

  sheet.getRange(row, 3).setValue(valDate); //date
  sheet.getRange(row, 4).setValue(valTime); //time
  updateNowSet(row);
}
function setFromRowColData(val, row, col) {//row,colで場所指定、値 書き込み。
  var sheet = getWbhook();

  sheet.getRange(row, col).setValue(val);
}
function getUserIdCell(row) {// UserId どのLINEから送られた情報か、端末を識別する為の情報のセルを取得
  var sheet = getWbhook();

  return sheet.getRange(row + 1, 1);
}
function getTodoCell(row) { //LINEから送られたタスクが保存されたセルを取得
  var sheet = getWbhook();
  return sheet.getRange(row + 1, 2);
}
function HeritageGetUserIdCelldata(row) {// UserId どのLINEから送られた情報か、端末を識別する為の情報のセルを取得
  var sheet = getWbhook();
  return sheet.getRange(row + 1, 1);
}
function getUserIdCelldata(row) {// UserId どのLINEから送られた情報か、端末を識別する為の情報のセルを取得 resultから取得
  var sheet = getResult();
  return sheet.getRange(row + 1, 2);
}
function getTodoCelldata(row) { //LINEから送られたタスクが保存されたセルを取得
  var sheet = getResult();
  return sheet.getRange(row + 1, 5);
}

function getDateCell(row) {//日付の情報が保存されたセルを取得
  var sheet = getWbhook();
  return sheet.getRange(row + 1, 3);
}
function getTriggerCell(row) {//トリガーが保存されたセルを取得
  var sheet = getWbhook();
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
  var sheet = getWbhook();

  sheet.getRange(row, 6).setValue(updateDateNow());
  sheet.getRange(row, 7).setValue(updateTimeNow());
}

function getDeleteCellWbhook(row){
  var sheet = getWbhook();
  sheet.deleteRows(row,1)
  return "キャンセルしたよ！";
}



/****************       param       *****************/
function setPsheetFromRowColData(val, row, col) {//row,colで場所指定、値 書き込み。
  var PSheet = getParam();

  PSheet.getRange(row, col).setValue(val);
}

/****************      result       ****************/
function getIdCelldata(row) {// Id resultから取得
  var sheet = getResult();
  return sheet.getRange(row + 1, 1);
}


/****************      CheckSchedule       ****************/


function appendToCheckScheduleSheet(text) {
  var sheet = getCheckSchedule();
  sheet.appendRow([text]);//シートDataにレコードを追加。
  
}


/*
-----------------------------------------------------------------------------------------------
*/


function appendToReSheet(text) {
 var ReSheet = getIDResult();
  ReSheet.getRange(1,1).setValue(text);//シートresultにレコードを追加。
}

// Psheetに入力
function ToPSheet(text) {
  var PSheet = getParam();

  PSheet.getRange(1,1).setValue(text);//シートresultにレコードを追加。
  // console.log("RS222:"+text);
  var insertionUserDataRow = insertSearchUseridRowNum() + 1;
  // console.log("RS221:"+insertSearchUseridRowNum() + 1);
  return insertionUserDataRow;
}

function selectQuery(number){
  
  switch(number){
      case 1:
          appendToReSheet("=Query(webhook!A:F, \"Where B = '\"&param!A1&\"' Order by C asc\")");
          // クエリにてWHO情報をもとに一致するデータを抜き出す。
          break;
      case 2:
          // 
          break;
      default :
          break;
  }

}
















