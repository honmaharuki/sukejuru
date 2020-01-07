//スプレットシート上でのQueryのやり取りに使われる関数まとめ。

var spreadsheet = SpreadsheetApp.openById("1Gyw_0oNk-sR5VtjxZVsZlEzgl62aDNpcE-DHqTN9a1U");//IDによってどのスプレッドシートを選択するか指定。
var sheet = spreadsheet.getSheetByName('webhook');//シート名を指定。
var PSheet = spreadsheet.getSheetByName('param');//命令用のシートを選択。
var ReSheet = spreadsheet.getSheetByName('result');//表示用のシートを選択。

function appendToReSheet(text) {
    ReSheet.getRange(1,1).setValue(text);//シートresultにレコードを追加。
}

// Psheetに入力
function appendToPSheet(text) {
    PSheet.getRange(1,1).setValue(text);//シートresultにレコードを追加。
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
