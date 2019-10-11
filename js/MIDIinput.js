jQuery(function($){
  //MIDIinput_grids生成 ?191009
  var MIDI_Mscale = 72; //音階数 重すぎるのでヤマハ式のC1〜B6まで(72)
  var notes_measure = 32; //notesの列数 (デフォルト>> 16小節 * 16拍 = 216)
  var notes_amount = MIDI_Mscale * notes_measure;
  var Mscale_Do = ["ド", "ド#", "レ", "レ#", "ミ", "ファ", "ファ#", "ソ", "ソ#", "ラ", "ラ#", "シ"];
  var Mscale_C = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  Mscale_Do.reverse(); //逆から表示するために反転している
  Mscale_C.reverse(); //同上
  //小節
  for(var h = 1; h-1 < notes_measure/16; h++){
    $(".Measure_grid").append("<div class=\"measures\"><p>"+h);
  }
  //音階
  for(var i = 0; i < MIDI_Mscale; i++){
    var Mscale_index = Math.ceil((MIDI_Mscale-i) / 12); //国際式はi-12 ヤマハ式はi-24
    $(".Mscale_grid").append("<div class=\"Mscale_notes\"><p>" + Mscale_C[i%12] + Mscale_index);
  }
  //入力部分
  for(var j = 0; j < notes_measure; j++){
    $(".note_grid").append("<div class=\"MIDI_notes\">");
    for(var k = 0; k < MIDI_Mscale; k++){
      if(j % 16 == 0){ 
        $(".MIDI_notes").eq(j).append("<div class=\"notes measure_first_notes\">");
      }else if(j % 4 == 0){
        $(".MIDI_notes").eq(j).append("<div class=\"notes measure_beat_notes\">");
      }else{
        $(".MIDI_notes").eq(j).append("<div class=\"notes\">");
      }
    }
  }

  //Measure_grid, note_gridの横幅の設定（場合によってはwindow_resizeも追記）
  var MIDIinput_right_width = $(".main").width() - $(".inst_bar").width() - 100;
  $(".Measure_grid").css("width", MIDIinput_right_width);
  $(".note_grid").css("width", MIDIinput_right_width);
  //ウィンドウサイズをリサイズした時 追記1005
  $(window).resize(function(){
    var MIDIinput_right_width = $(".main").width() - $(".inst_bar").width() - 100;
    $(".Measure_grid").css("width", MIDIinput_right_width);
    $(".note_grid").css("width", MIDIinput_right_width);
  });
  
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
  
  //MIDI色切り替え, 音声出力
  var isMouseDown = false;
  let polysynth = new Tone.PolySynth().toMaster();
  function synthset(time, note) {
    polysynth.triggerAttackRelease(note, '8n', time);
  }
  var MIDI_Melody = []; //小節:拍:拍内小節, 音名 保存に使用
  for(x=0; x<2; x++){
    for(y=0; y<4; y++){
      for(z=0; z<4; z++){
        MIDI_Melody.push([x+":"+y+":"+z, [""]]);
      }
    }
  }

  $(".notes").mousedown(function () {
    isMouseDown = true;
    $(this).toggleClass(".notes.highlighted");
    var note_name = $('.notes').index(this) % 12;
    var pitch =  Math.ceil((MIDI_Mscale-$('.notes').index(this)%MIDI_Mscale) / 12);
    var MIDI_note = Mscale_C[note_name] + pitch;
    var measure_count = $(this).parent().index();
    if($(this).hasClass('highlighted') == false){
      polysynth.triggerAttackRelease(Mscale_C[note_name]+pitch, '16n');

      if(MIDI_Melody[measure_count][1] == ""){
        MIDI_Melody[measure_count][1].splice(0, 1, MIDI_note);
        console.log("新規追加");
        console.log(MIDI_Melody);
      }else{
        MIDI_Melody[measure_count][1].push(MIDI_note);
        console.log("追加");
        console.log(MIDI_Melody);
      }
    }else{
      var highlight_index = $.inArray(MIDI_note, MIDI_Melody[measure_count][1]);
      MIDI_Melody[measure_count][1].splice(highlight_index, 1);
      console.log("削除");
      console.log(MIDI_Melody);
    }
    return false; // prevent text selection
  })
  .mouseover(function () {
    if (isMouseDown) {
      $(this).toggleClass(".notes.highlighted");
      var note_name = $('.notes').index(this) % 12;
      var pitch =  Math.ceil((MIDI_Mscale-$('.notes').index(this)%MIDI_Mscale) / 12);
      var MIDI_note = Mscale_C[note_name] + pitch;
      var measure_count = $(this).parent().index();
      if($(this).hasClass('highlighted') == false){
        polysynth.triggerAttackRelease(Mscale_C[note_name]+pitch, '16n');

        if(MIDI_Melody[measure_count][1] == ""){
          MIDI_Melody[measure_count][1].splice(0, 1, MIDI_note);
          console.log("新規追加");
          console.log(MIDI_Melody);
        }else{
          MIDI_Melody[measure_count][1].push(MIDI_note);
          console.log("追加");
          console.log(MIDI_Melody);
        }
      }else{
        var highlight_index = $.inArray(MIDI_note, MIDI_Melody[measure_count][1]);
        MIDI_Melody[measure_count][1].splice(highlight_index, 1);
        console.log("削除");
        console.log(MIDI_Melody);
      }
    }
  })
  .bind("selectstart", function () {
    return false; // prevent text selection in IE
  });
  $(document).mouseup(function () {
    isMouseDown = false;
  });
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
  
  //受け渡された情報から表示する 読み込みに使用
  var test_data = [
    ["0:0:0", ["C4", "E4", "G4"]],
    ["0:0:1", [""]],
    ["0:0:2", ["C4", "E4", "G4"]],
    ["0:0:3", []],
    ["0:1:0", ["E4", "G4", "B4"]],
    ["0:1:1", []],
    ["0:1:2", ["E4", "G4", "B4"]],
    ["0:1:3", [""]]
  ]
  var Mscale_number = {"C":11, "C#":10, "D":9, "D#":8, "E":7, "F":6, "F#":5, "G":4, "G#":3, "A":2, "A#":1, "B":0}; //逆順
  for(y=0; y<test_data.length; y++){
    if(test_data[y][1].length > 0 && test_data[y][1][0] != ""){
      for(z=0; z<test_data[y][1].length; z++){
        if(MIDI_Melody[y][1] == ""){
          MIDI_Melody[y][1].splice(0, 1, test_data[y][1][0]);
        }else{
          MIDI_Melody[y][1].push(test_data[y][1][z]);
        }
        var pitch = test_data[y][1][z].slice(-1);
        if(test_data[y][1][z].length == 3){ //C#3
          var note_name = test_data[y][1][z].slice(0, 2);
        }else{
          var note_name = test_data[y][1][z].slice(0, 1);
        }
        $(".notes").eq(
          Mscale_number[note_name] + (6-pitch)*12 + y*MIDI_Mscale
        ).addClass("highlighted");
      }
    }
  }
  console.log("保存データ読み込み")
  console.log(MIDI_Melody);
  
  
  //再生処理
  Tone.Transport.bpm.value = 120;
  var play_flg = 0;
  $("#play").click(function(){
    if(play_flg == 0){
      var play_MIDI_Melody = []; //再生用に無駄な情報を省いたもの
      for(z=0; z<notes_measure; z++){
        if(MIDI_Melody[z][1].length > 0 && MIDI_Melody[z][1][0] != ""){
          play_MIDI_Melody.push(MIDI_Melody[z]);
        }
      }
      console.log("再生");
      console.log(play_MIDI_Melody);
      var Music = new Tone.Part(synthset, play_MIDI_Melody).start();
      Tone.Transport.start();
      play_flg = 1;
    }else{
      Tone.Transport.stop();
      Tone.Transport.cancel();
      play_flg = 0;
    }
  })
});