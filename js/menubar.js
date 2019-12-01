const add = (x) => {
  return (x) && parseInt(x);
}
/*saveボタン・ウィンドウ*/
$(function() { //Enterを押しても送信されないようにする。
  $(document).on("keypress", "input:not(.allow_submit)", function(event) {
    return event.which !== 13;
  });
  
  var save_flg = 0;
  $("#save").click(function(){
    $(".save-window").show();
  });
  $(".times").click(function(){
    $(".save-window").hide();
  });
  $(".new_save-btn").click(function(){
    var song_name = document.getElementById("song_name_input").value;
    if(song_name.length > 0){
      alert("保存しました。");
      console.log(song_name);
      $(".save-window").css("display", "none");
    }else{
      alert("ファイル名を入力してください。");
    }
  });
  $(".ow_save-btn").click(function(){
    var song_name = document.getElementById("song_name_input").value;
    if(song_name.length > 0){
      alert("保存しました。");
      console.log(song_name);
      $(".save-window").css("display", "none");
    }else{
      alert("ファイル名を入力してください。");
    }
  });

  /*helpボタン*/
  $('#help').click(function() {
    if(help_flg == false){
      $('#help').css('background','#ffff7f');
      help_flg = true;
    }else{
      $('#help').css('background','#8fdfda');
      $(".callout").hide();
      help_flg = false;
    }
  });

  $("#back").click(function(){
    if(confirm('保存していない内容は破棄されますが、本当にプロジェクト選択画面に戻りますか。')){
      location.href = "create.html";
    }else{
      return false;
    }
  });

  /*再生ボタンと停止ボタン*/
  function play_change(){
    if(play_flg == false){
      $('.play-btn').hide();
      $('.stop-btn').show();
      play_flg = true;
    }else{
      $('.play-btn').show();
      $('.stop-btn').hide();
      play_flg = false;
    }
  }
  $('#play').click(function() {
    play_change();
  });
  

  /*作曲情報バー*/
  $('.artist').html(Artist);
  $('.key').html(Key);


  //BPM
  $('.bpm_value').html(bpm);
  $('.bpm_slider').on('input change', function() {
    bpm = $(this).val();
    $('.bpm_value').html(bpm);
  });
  
  //ショートカットキー
  $(document).on("keydown", function(e){
    if(e.metaKey && e.keyCode == 83){ //Cmd+Sで保存
      if(e.preventDefault){
        e.preventDefault();
      }
      $(".save-window").show();
    }
    if(e.keyCode == 27){ //Escでセーブウィンドウ・チュートリアルを閉じる
      if(e.preventDefault){
        e.preventDefault();
      }
      if($(".save-window").css("display") == "block"){
        $(".save-window").hide();
      }
      if($(".l-wrapper").css("display") == "block"){
        $(".l-wrapper").hide();
      }
    }
    //Enterで再生位置を初期位置に戻す >> MIDIinput.jsに記載
    if(e.keyCode == 32){ //スペースキーで再生・停止
      if(e.preventDefault){
        e.preventDefault();
      }
      play_change();
    }
  });
});

