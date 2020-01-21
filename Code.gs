var moment = Moment.load(); //moment = Moment.js(時間関係のライブラリ)を使えるように宣言。

// row = 行
// col = 列
// API の呼び出しは減らせば減らすだけ処理が速くなる。

function doPost(e) { //値を外部から受け取った時に反応する関数。
  var webhookData = JSON.parse(e.postData.contents).events[0]; //JSON データ形式 読み込んだJSON文字列を読み込み使う。
  //e.postData.contents >> POST bodyのcontent textを返す。 つまりテキストデータを抜き出す。 events[0] 配列で読み込んでいる？
  //書き方が少しC言語に似ている部分がある。
  // JSON確認。
  console.log(JSON.parse(e.postData.contents).events[0]);
  //topost,toget系はデータをユーザーに返す。
  
  
  var message, replyToken, replyText, userId; 
  var writingFlag  = false;
  /**** 
  var無しでも使えるがグローバル変数にしたくない時にはきちんと宣言したほうがいい。グローバル変数になる。
  変数宣言
  message = text形式のメッセージを取得
  replyToken = トークン取得
  replyText = テキストを返す為。
  userId = どの相手に返信するか把握する為にIDを取得
  writingFlag = 書き込み用のフラグ
  ***/
  message = webhookData.message.text;//text形式のメッセージを取得。
  //console.log(message);
  replyToken = webhookData.replyToken;//返信用のトークンを取得 トークン...場所を記す為の印のようなもの。
  userId = webhookData.source.userId;//どの相手に返信するか把握する為にIDを取得。
  
  //IDを使い検索用データを整える
  var insertionUserDataRow = ToPSheet(userId);
  //console.log(userId);
  ///////////////////////selectQuery(1);
  // resultのシートが整った
  // IDを返すので +1する
//  var insertionUserDataRow = insertSearchUseridRowNum() + 1;
  console.log("RC49:"+insertionUserDataRow);


  // DATEが登録されているかどうかの確認
  // もし同じときにはCONTENTを登録、違うときにはDATEを登録
  if (searchContent() == searchDate()){
    
    writingFlag = true;
  }
  

  console.log("RC45:"+writingFlag);
  
  
  var updateRow;


/*
  var userDataRow = searchUserDataRow(userId);//何行目にuserIdが入っていたかを判断 代入。
  
  var todo = getTodoCell(userDataRow).getValue();//TodoCellの中身を代入。 userDataRow = 何行目の内容か。  
  var todoDate = getDateCell(userDataRow).getValue(); //Dateセルの中身を代入。
  */
 console.log(message);
  switch (message) {
    case '使い方':
      replyText = 'あとで思い出したいことをラインしてくれれば、いつお知らせしてほしいか聞くよ\nまずは覚えて欲しいことを教えてね\nその後時間を聞くから「10分後」「11月11日11時11分」のように「○分後」か、「○月○日○時○分」形式で日時を教えてね！そうしないと正しく時間を登録できないよ！';
      break;
      // キャンセル処理へ移行
      // 変更
    case 'キャンセル':
      replyText = cancel(insertionUserDataRow);
      break;  
    case '確認':
      if (todoDate) {
        replyText = '「' + todo + '」を' + todoDate + 'に知らせるよ！';
      } else {
        replyText = '何も登録されていないよ！';
      }
      break;
    default: //何か登録したいものが送られてきた場合の登録の場合分け。
     /* if (todoDate) { //すでにリマインダーが登録がされている状態で新しい予定が入ってきた場合。 todoDateが空でない場合。
        replyText = '一つ登録されているよ！\nもし新しい予定を登録したい時には”キャンセル”って送ってね。';
      } else if (todo) { //すでにタスクが登録されている状態で何かが入力されたということは日時が登録されていないということで日時関係のsetDateにいく。
        replyText = setDate(userDataRow, message);
        
      }
      else { //リマインダーもタスクも登録されていないのでsetTodoから予定を登録する。
        replyText = setTodo(userDataRow, message);
      }
      */
     /*-----------------------------------------------------------------------------------------------------------------------------------------------------------
     1/17日ここまで アップデートタイムを登録するところ
     */

     if(writingFlag){ // タスク登録
      replyText = appendToSheetContent(userId, message);
     }else{ // 日時登録 ただし 名前の最後のところに記述（IDをもとに出す）
      replyText = setDate(insertionUserDataRow, message);
     }

  }
  //console.log(replyText);
  //console.log(replyToken);
  return sendLineMessageFromReplyToken(replyToken, replyText); //反応してラインに値を送る関数に引数を与える。
}
function searchUserDataRow(userId) { // userIdが登録されている検索。 何行目に入っていたかを返却。 ない場合にはfalseを返却。
  userDataRow = searchRowNum(userId, 1); //sheet.gsに関数あり。
  if (userDataRow === false) { //もし登録されていなければ
    appendToSheet(userId); //userIdをレコードの最後に追加。
  }
  return userDataRow; //userIdが何行目かを返却。
}
function setTodo(row, message) { //タスクを登録。
  setFromRowCol(message, row, 1);
  return '「' + message + ' 」だね。覚えたよ\nいつ教えてほしい？\n例：「10分後」「11月23日17時00分」など\n「○分後」か、「○月○日○時○分」形式で教えてね。そうしないと正しく時間を登録できないよ！\n「キャンセル」って言ってくれればやめるよ。';
}

function setDate(row, message) { //日時を書き込む為の関数。
  // 全角英数を半角に変換
  var date = Moment.moment().format('YYYY年MM月DD日H時m分');//現在日時取得。 YYYY年MM月DD日H時m分
  var truedate = date; // 正しい日付。
  // 全角英数を半角に変換
  message = message.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) { //新しい文字列を作る為の関数を指定。
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); // 全角英数を半角に変換。
  });
  message = message.replace(/一/g, 1); // 漢数字から数字へ
  message = message.replace(/二/g, 2);
  message = message.replace(/三/g, 3); 
  message = message.replace(/四/g, 4); 
  message = message.replace(/五/g, 5); 
  message = message.replace(/六/g, 6); 
  message = message.replace(/七/g, 7); 
  message = message.replace(/八/g, 8); 
  message = message.replace(/九/g, 9); 
  message = message.replace(/(\d)十/g, "$1"+0); // 漢数字から数字へ
  message = message.replace(/十/g, 10);  
  // 明日 明後日 明々後日
  if(message.match(/\d+[年月日時分]後|\d+[日時分]間後|\d+ヶ月後/)) { // 数字後の場合には現在の時刻から加算。
    if(message.match(/\d+年後/)){
      var match = message.match(/\d+年後/)[0].match(/\d+/)[0]; 
      match = parseInt(match, 10);
      date = Moment.moment(date, 'Y年M月D日H時m分').add(match, 'years').format('YYYY年MM月DD日H時m分');  
    } 
    if(message.match(/\d+月後|\d+ヶ月後/)){
      match = message.match(/\d+月後|\d+ヶ月後/)[0].match(/\d+/)[0]; 
      match = parseInt(match, 10);
      date = Moment.moment(date, 'Y年M月D日H時m分').add(match, 'months').format('YYYY年MM月DD日H時m分'); 
    }
    if(message.match(/\d+日後|\d+日間後/)){
      match = message.match(/\d+日後|\d+日間後/)[0].match(/\d+/)[0]; 
      match = parseInt(match, 10); 
      date = Moment.moment(date, 'Y年M月D日H時m分').add(match, 'days').format('YYYY年MM月DD日H時m分'); 
    }
    if(message.match(/\d+時後|\d+時間後/)){
      match = message.match(/\d+時後|\d+時間後/)[0].match(/\d+/)[0]; 
      match = parseInt(match, 10); 
      date = Moment.moment(date, 'Y年M月D日H時m分').add(match, 'hours').format('YYYY年MM月DD日H時m分'); 
    }
    if(message.match(/\d+分後|\d+分間後/)){
      match = message.match(/\d+分後|\d+分間後/)[0].match(/\d+/)[0]; 
      match = parseInt(match, 10); 
      date = Moment.moment(date, 'Y年M月D日H時m分').add(match, 'minutes').format('YYYY年MM月DD日H時m分'); 
    }   
    // ------------------------------------------------------------------------------------
  }
  if(message.match(/\d+[年月日時分]|\d+[日時分]間|d+ヶ月/)) {// 指定された日時を保存。
    if(message.match(/\d+年(?!後)/)){
      match = message.match(/\d+年(?!後)/)[0]; 
      date = date.replace(/\d+年/, match); 
    }
    if(message.match(/\d+月(?!後)|\d+ヶ月(?!後)/)){
      match = message.match(/\d+月(?!後)|\d+ヶ月(?!後)/)[0].match(/\d+/)[0]; 
      match = parseInt(match, 10);
      date = date.replace(/\d+月/, match+"月"); 
    }
    if(message.match(/\d+日(?!後)|\d+日間(?!後)/)){
      match = message.match(/\d+日(?!後)|\d+日間(?!後)/)[0].match(/\d+/)[0]; 
      match = parseInt(match, 10); 
      date = date.replace(/\d+日/, match+"日"); 
    }
    if(message.match(/\d+時(?!後)|\d+時間(?!後)/)){
      match = message.match(/\d+時(?!後)|\d+時間(?!後)/)[0].match(/\d+/)[0]; 
      match = parseInt(match, 10); 
      date = date.replace(/\d+時/, match+"時"); 
    }
    if(message.match(/\d+分(?!後)|\d+分間(?!後)/)){
      match = message.match(/\d+分(?!後)|\d+分間(?!後)/)[0].match(/\d+/)[0]; 
      match = parseInt(match, 10); 
      date = date.replace(/\d+分/, match+"分"); 
    } 
  }
  if(message.match("明日")){
    date = Moment.moment(date, 'Y年M月D日H時m分').add(1, 'days').format('YYYY年MM月DD日H時m分'); 
  }
  if(message.match("明後日")){
    date = Moment.moment(date, 'Y年M月D日H時m分').add(2, 'days').format('YYYY年MM月DD日H時m分'); 
  }
  if(message.match("明々後日")){
    date = Moment.moment(date, 'Y年M月D日H時m分').add(3, 'days').format('YYYY年MM月DD日H時m分'); 
  }
  if(message.match("来週")){
    date = Moment.moment(date, 'Y年M月D日H時m分').add(7, 'days').format('YYYY年MM月DD日H時m分'); 
  }  
  if(message.match("再来週")){
    date = Moment.moment(date, 'Y年M月D日H時m分').add(14, 'days').format('YYYY年MM月DD日H時m分'); 
  }  
  
  date = Moment.moment(date,'YYYY年M月D日H時m分').format('YYYY年MM月DD日H時m分');  
  
  if (date === truedate || date === 'Invalid date') { //時間文字列として無効な場合には 
    return '「10分後」「11月23日17時00分」など\n「○分後」か、「○月○日○時○分」形式で知らせる時間を教えてね。そうしないと正しく時間を登録できないよ！'
  } else if (Moment.moment(date) < Moment.moment(truedate)) { //現在の時刻よりも前ならば
    return '過去の時間に知らせてもらいたいなんて少し深めの闇を感じるね...'
  }
  var upDateDate;
  var upDateTime;
  upDateDate = Moment.moment(date,'YYYY年M月D日H時m分').format('YYYY-MM-DD'); 
  upDateTime = Moment.moment(date,'YYYY年M月D日H時m分').format('H:m:0');
  //setTrigger(row, date); //トリガーとなるIDを作成。
  setDateTimeRowCol(upDateDate, upDateTime, row); //その時間を書き込み。
  return date + 'だね。覚えたよ！\nその時間になったら知らせるね。' 
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------
     1/20 追加機能完了
     */


function cancel(row) { // キャンセルの場合に動く関数。 一番最新の値を消す。
  getTodoCell(row).clear(); //タスクセル .clear セルの値をクリア。
  getDateCell(row).clear(); //日付セル。
  triggerCell = getTriggerCell(row) //トリガーセルの値を代入。
  var triggerId = triggerCell.getValue(); //値を代入。
  if (triggerId) { // 値が0以外の時実行 何かある時は実行。
    deleteTrigger(triggerId); // トリガー削除。
  }
  triggerCell.clear(); //トリガーが保存されたセル。
  return 'キャンセルしたよ！'
}
function canceldata(row) { // キャンセルの場合に動く関数。
  getTodoCelldata(row).clear(); //タスクセル .clear セルの値をクリア。
  getDateCelldata(row).clear(); //日付セル。
  triggerCell = getTriggerCell(row) //トリガーセルの値を代入。
  var triggerId = triggerCell.getValue(); //値を代入。
  if (triggerId) { //値が0以外の時実行　何かある時は実行。
    deleteTrigger(triggerId); // トリガー削除。
  }
  triggerCell.clear(); //トリガーが保存されたセル。
  return 'キャンセルしたよ！'
}


function remind(e) { //　リマインダーの為のトリガーとなっているもの。　呼び出し元のトリガーのUniqueIdを調べて、スプレッドシートの4列目からそのUniqueIdが記録されている行を探す。
  //探してきた行からUserIdとtodoを特定して、LINEでメッセージを送ります。
  //UniqueId...日時と、実行する関数を指定して作成されたトリガーの固有ID。
  var userDataRow = searchRowNumData(e.triggerUid, 3);  //トリガーの内容が何行目かを判断。
  var userId = getUserIdCelldata(userDataRow).getValue(); //UserIdセルの中身を取得代入。 
  var todo = getTodoCelldata(userDataRow).getValue(); //Todoセルの中身を取得代入。
  var remindText = todo + 'の時間だよ！';
  cancel(userDataRow); 
  return sendLineMessageFromUserId(userId, remindText); //反応してラインに値を送る関数に引数を与える。
}

