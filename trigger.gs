//トリガーに関する関数

function setTrigger(row, date) { //トリガーの作成と、トリガーのUniqueIdの書き込みを行う関数。　コード.gsのsetDate関数から呼ばれる。
//UniqueId...日時と、実行する関数を指定して作成されたトリガーの固有ID。
  var triggerDay = moment(date,'YYYY年MM月DD日H時m分').toDate(); // moment(date,'YYYY年MM月DD日H時m分')　時間文字列を渡す。
  // .toDate dete型　日付用の型で情報を抜き出す。
  var trigger =  ScriptApp.newTrigger("remind").timeBased().at(triggerDay).create(); //時間になったら"remind"を起動。
  setFromRowCol(trigger.getUniqueId(), row, 3); //トリガーとなっているラインのトリガーを書き込み。
}
function deleteTrigger(uniqueId) { //不要になったトリガーを削除する関数。
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getUniqueId() === uniqueId) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}