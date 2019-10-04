jQuery(function($){
  //MIDIinput_grids生成
  var MIDI_Mscale = 72; //音階数 重すぎるのでヤマハ式のC1〜B6まで
  var notes_measure = 216; //notesの列数 (デフォルト>> 16小節 * 16拍 = 216)
  var Mscale = ["ド", "ド#", "レ", "レ#", "ミ", "ファ", "ファ#", "ソ", "ソ#", "ラ", "ラ#", "シ"];
  //小節
  for(var h = 1; h-1 < notes_measure/16; h++){
    $(".Measure_grid").append("<div class=\"measures\"><p>"+h);
  }
  //音階
  for(var i = 0; i < MIDI_Mscale; i++){
    var Mscale_index = Math.floor((i+12) / 12); //国際式はi-12 ヤマハ式はi-24
    $(".Mscale_grid").append("<div class=\"Mscale_notes\"><p>" + Mscale[i%12] + Mscale_index);
  }
  //入力部分
  for(var j = 0; j < notes_measure; j++){
    $(".note_grid").append("<div class=\"MIDI_notes\">");
    for(var k = 0; k < MIDI_Mscale; k++){
      $(".MIDI_notes").eq(j).append("<div class=\"notes\">");
    }
  }

  //Measure_grid, note_gridの横幅の設定（場合によってはwindow_resizeも追記）
  var MIDIinput_right_width = $(".main").width() - $(".inst_bar").width() - 100;
  $(".Measure_grid").css("width", MIDIinput_right_width);
  $(".note_grid").css("width", MIDIinput_right_width);

  //スクロール連動 小節, 音階
  $(".note_grid").scroll(function() {
    $(".Measure_grid").scrollLeft(
      $(".note_grid").scrollLeft()
    );
    $(".Mscale_grid").scrollTop(
      $(".note_grid").scrollTop()
    );
  });

  //notes縦横可変
  var measure_width = 800; //measureの最低幅 ページ読み込み時の初期サイズは1600px
  var note_width = 50; //notesの最低幅 ページ読み込み時の初期サイズは100px
  var note_height = 20; //notesの最低高さ ページ読み込み時の初期サイズは40px

  $(".Mscale_notes").css({"width":note_width*2, "height":note_height*2});
  $(".notes").css({"width":note_width*2, "height":note_height*2});

  $(".width_scale_bar").on("input",function(){
    var measure_resize_width = measure_width * ($(".width_scale_bar").val() / 50);
    $(".measures").css("width", measure_resize_width);
    var note_resize_width = note_width * ($(".width_scale_bar").val() / 50);
    $(".notes").css("width", note_resize_width);
  });
  $(".height_scale_bar").on("input",function(){
    var note_resize_height = note_height * ($(".height_scale_bar").val() / 50);
    $(".Mscale_notes").css("height", note_resize_height);
    $(".notes").css("height", note_resize_height);
  });
  
  //MIDI色切り替え
  $(".notes").mousedown(function () {
    isMouseDown = true;
    $(this).toggleClass(".notes.highlighted");
    return false; // prevent text selection
  })
  .mouseover(function () {
    if (isMouseDown) {
      $(this).toggleClass(".notes.highlighted");
    }
  })
  .bind("selectstart", function () {
    return false; // prevent text selection in IE
  });
  $(document).mouseup(function () {
    isMouseDown = false;
  });
  var isMouseDown = false;
  $(".notes").mousedown(function () {
    isMouseDown = true;
    $(this).toggleClass("highlighted");
    return false; // prevent text selection
  })
  .mouseover(function () {
    if (isMouseDown) {
      $(this).toggleClass("highlighted");
    }
  })
  .bind("selectstart", function () {
    return false; // prevent text selection in IE
  });
  $(document).mouseup(function () {
    isMouseDown = false;
  });
});