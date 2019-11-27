const add = (x) => {
  return (x) && parseInt(x);
}
/*saveボタン・ウィンドウ*/
$(function() { //Enterを押しても送信されないようにする。
  $(document).on("keypress", "input:not(.allow_submit)", function(event) {
    return event.which !== 13;
  });
});
var save_flg = 0;
$("#save").click(function(){
  $(".save-window").css("display", "block");
});
$(".times").click(function(){
  $(".save-window").css("display", "none");
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
$('#play').click(function() {
  if(play_flg == 0){
    $('.play-btn').css('display','none');
    $('.stop-btn').css('display','block');
  }else{
    $('.play-btn').css('display','block');
    $('.stop-btn').css('display','none');
  }
});

/*作曲情報バー*/
var artist = "THEE MICHELLE GUN ELEPHANT";
var key = "C";

$('.artist').html(artist);
$('.key').html(key);


//BPM
$('.bpm_value').html(bpm);
$('.bpm_slider').on('input change', function() {
  bpm = $(this).val();
  $('.bpm_value').html(bpm);
});

