var moment = Moment.load(); //moment = Moment.js(時間関係のライブラリ)を使えるように宣言。

// row = 行
// col = 列

function doPost(e) { //値を外部から受け取った時に反応する関数。
  var webhookData = JSON.parse(e.postData.contents).events[0];　//JSON データ形式 読み込んだJSON文字列を読み込み使う。
  //e.postData.contents >> POST bodyのcontent textを返す。　つまりテキストデータを抜き出す。　events[0] 配列で読み込んでいる？
  //書き方が少しC言語に似ている部分がある。
  
  
  //topost,toget系はデータをユーザーに返す。
  
  
  var message, replyToken, replyText, userId; 
  /**** 
  var無しでも使えるがグローバル変数にしたくない時にはきちんと宣言したほうがいい。グローバル変数になる。
  変数宣言　
  message = text形式のメッセージを取得
  replyToken = トークン取得
  replyText = テキストを返す為。
  userId = どの相手に返信するか把握する為にIDを取得
  ***/
  message = webhookData.message.text;//text形式のメッセージを取得。
  replyToken = webhookData.replyToken;//返信用のトークンを取得　トークン...場所を記す為の印のようなもの。
  userId = webhookData.source.userId;//どの相手に返信するか把握する為にIDを取得。
  var userDataRow = searchUserDataRow(userId);//何行目にuserIdが入っていたかを判断　代入。
  var todo = getTodoCell(userDataRow).getValue();//TodoCellの中身を代入。　userDataRow = 何行目の内容か。  
  var todoDate = getDateCell(userDataRow).getValue(); //Dateセルの中身を代入。
  switch (message) {
    case '使い方':
      replyText = 'あとで思い出したいことをラインしてくれれば、いつお知らせしてほしいか聞くよ\nまずは覚えて欲しいことを教えてね\nその後時間を聞くから「10分後」「11月11日11時11分」のように「○分後」か、「○月○日○時○分」形式で日時を教えてね！そうしないと正しく時間を登録できないよ！';
      break;
    case 'キャンセル':
      replyText = cancel(userDataRow);
      break;  
    case '確認':
      if (todoDate) {
        replyText = '「' + todo + '」を' + todoDate + 'に知らせるよ！';
      } else {
        replyText = '何も登録されていないよ！';
      }
      break;
    case '明日':
      if (todoDate) { //すでにリマインダーが登録がされている状態で新しい予定が入ってきた場合。 todoDateが空でない場合。
        replyText = '一つ登録されているよ！\nもし新しい予定を登録したい時には”キャンセル”って送ってね。';
      } else if (todo) { //すでにタスクが登録されている状態で何かが入力されたということは日時が登録されていないということで日時登録。
        replyText = asita(userDataRow);
      }
      else { //リマインダーもタスクも登録されていないのでsetTodoから予定を登録する。
        replyText = setTodo(userDataRow, message);
      }
      break;
    default: //何か登録したいものが送られてきた場合の登録の場合分け。
      if (todoDate) { //すでにリマインダーが登録がされている状態で新しい予定が入ってきた場合。 todoDateが空でない場合。
        replyText = '一つ登録されているよ！\nもし新しい予定を登録したい時には”キャンセル”って送ってね。';
      } else if (todo) { //すでにタスクが登録されている状態で何かが入力されたということは日時が登録されていないということで日時関係のsetDateにいく。
        replyText = setDate(userDataRow, message);
      }
      else { //リマインダーもタスクも登録されていないのでsetTodoから予定を登録する。
        replyText = setTodo(userDataRow, message);
      }
  }
  return sendLineMessageFromReplyToken(replyToken, replyText); //反応してラインに値を送る関数に引数を与える。
}
function searchUserDataRow(userId) {　// userIdが登録されている検索。　何行目に入っていたかを返却。　ない場合にはfalseを返却。
  userDataRow = searchRowNum(userId, 0); //sheet.gsに関数あり。
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
  message = message.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) { //新しい文字列を作る為の関数を指定。
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); // 全角英数を半角に変換。
  });
  var date = Moment.moment(message, 'M月D日H時m分', true).format('YYYY年MM月DD日H時m分'); //英数字を抜き出し、YYYY年MM月DD日H時m分の形に直す。
  if (date === 'Invalid date') { //もし無効な時間文字列が渡された場合には
    var match = message.match(/\d+/g); //検索して一番初めにマッチした半角数字を返す。
    if (match !== null) { //もし何か数字があった時には数字を抜き出し英数字を抜き出し、YYYY年MM月DD日H時m分の形に直す。 ただしこの時に抜き出した数字は全て何分後かの形式になる。
      date = Moment.moment().add(+match[0], 'minutes').format('YYYY年MM月DD日H時m分');
    }
  }
  if (date === 'Invalid date') { //時間文字列として無効な場合には 
    return '「10分後」「11月23日17時00分」など\n「○分後」か、「○月○日○時○分」形式で知らせる時間を教えてね。そうしないと正しく時間を登録できないよ！'
  } else if (date < Moment.moment()) { //現在の時刻よりも前ならば
    return '過去の時間に知らせてもらいたいなんて少し深めの闇を感じるね...'
  }
  setTrigger(row, date); //トリガーとなるIDを作成。
  setFromRowCol(date, row, 2); //その時間を書き込み。
  return date + 'だね。覚えたよ！\nその時間になったら知らせるね。';
}

function cancel(row) { // キャンセルの場合に動く関数。
  getTodoCell(row).clear(); //タスクセル .clear セルの値をクリア。
  getDateCell(row).clear(); //日付セル。
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
  var userDataRow = searchRowNum(e.triggerUid, 3);  //トリガーの内容が何行目かを判断。
  var userId = getUserIdCell(userDataRow).getValue(); //UserIdセルの中身を取得代入。 
  var todo = getTodoCell(userDataRow).getValue(); //Todoセルの中身を取得代入。
  var remindText = todo + 'の時間だよ！';
  cancel(userDataRow); 
  return sendLineMessageFromUserId(userId, remindText); //反応してラインに値を送る関数に引数を与える。
}
function asita(row){
        var date = Moment.moment().add(1,'days').format('YYYY年MM月DD日H時m分');
        setTrigger(row, date); //トリガーとなるIDを作成。
        setFromRowCol(date, row, 2); //その時間を書き込み。
        return date + 'だね。覚えたよ！\nその時間になったら知らせるね。';
}

/*******
スクリプト...書いてすぐ実行できるプログラム


参考にしたサイト
https://note.mu/tatsuaki_w/n/nfed622429f4a
 プログラミング初心者でも無料で簡単にLINE BOTが作れるチュートリアル
https://note.mu/toshioakaneya/n/ndd1c6647d53d
LINEで予定を登録→通知してくれるリマインダーアプリを作ろう 
*******/