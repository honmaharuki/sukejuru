//LINEに関わる関数

//LINEにアクセスする為のトークンを代入。 トークン...トークンとは場所を記す為の印のようなもの。
var channel_access_token = "XhvCDRvIv58DGyuFq0pADwWH8cbiREYtY3uAwjAucjCwDtcRc6mNTymbdEueYIY8lniaJd9Gk6Fx6yRfLANNdlsIOm8sMXe5dxwODtK6WwDcsFuUGbEDv3EmNhOCdg2flvhQY7KrWgpQliop6ykWdwdB04t89/1O/w1cDnyilFU=";

//時間
var moment = Moment.load(); //Momentライブラリをつけるようにする。
var headers = {
  "Content-Type": "application/json; charset=UTF-8",
  "Authorization": "Bearer " + channel_access_token
};

//ユーザーからのメッセージに反応して返答する関数。
function sendLineMessageFromReplyToken(token, replyText) {
  var url = "https://api.line.me/v2/bot/message/reply"; //応答の為のurl。
  var postData = {
    "replyToken": token, //どこに返信するか。
    "messages": [{
      "type": "text",
      "text": replyText //送るテキストの情報。
    }]
  };
  var options = {
    "method": "POST", //POST で送る。
    "headers": headers, 
    "payload": JSON.stringify(postData)
  };
  return UrlFetchApp.fetch(url, options); //LINEに送信。
}



//指定されたUserldにアプリ側から自発的にメッセージを送る関数。　リマインダー機能には必須。
function sendLineMessageFromUserId(userId, text) { //誰に何を送るのかを引数として取得。
  var url = "https://api.line.me/v2/bot/message/push"; //送る為のurl。
  var postData = {
    "to": userId, //誰に送るか。
    "messages": [{
      "type": "text",
      "text": text //何を送るか。
    }]
  };
  var options = {
    "method": "POST",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };
  return UrlFetchApp.fetch(url, options); //LINEに返信。
}