jQuery(function($){
  //MIDIinput_grids生成 ?191009
  var MIDI_Mscale = 42; //音階数 重すぎるのでヤマハ式のC1〜B6まで(72) スケール内の音だけなら7*6=42音
  var notes_measure = 128; //notesの列数 (デフォルト>> 16小節 * 16拍 = 256) 重い場合はここを調整してください(コード自動生成等の都合上、ここをいじるだけだとエラーを吐きます)
  var Mscale_Do = ["ド", "ド#", "レ", "レ#", "ミ", "ファ", "ファ#", "ソ", "ソ#", "ラ", "ラ#", "シ"];
  var Mscale_C = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const Scales = { //C〜Bという順番 後々反転
    "C/Am":  ["C","D","E","F","G","A","B"],
    "Db/Bbm":["C","Db","Eb","F","Gb","Ab","Bb"],
    "D/Bm":  ["C#","D","E","F#","G","A","B"],
    "Eb/Cm": ["C","D","Eb","F","G","Ab","Bb"],
    "E/Dbm": ["Cb","Db","E","Fb","Gb","A","B"],
    "F/Dm":  ["C","D","E","F","G","A","Bb"],
    "Gb/Ebm":["Db","Eb","F","Gb","Ab","Bb","B"],
    "G/Em":  ["C","D","E","F#","G","A","B"],
    "Ab/Fm": ["C","Db","Eb","F","G","Ab","Bb"],
    "A/Gbm": ["Cb","D","E","Fb","Gb","A","B"],
    "Bb/Gm": ["C","D","Eb","F","G","A","Bb"],
    "B/Abm": ["Cb","Db","E","Fb","Gb","Ab","B"]
  };
  const Scales_DoReMi = { //ド〜シという順番 後々反転
    "C/Am":  ["ド","レ","ミ","ファ","ソ","ラ","シ"],
    "Db/Bbm":["ド","レb","ミb","ファ","ソb","ラb","シb"],
    "D/Bm":  ["ド#","レ","ミ","ファ#","ソ","ラ","シ"],
    "Eb/Cm": ["ド","レ","ミb","ファ","ソ","ラb","シb"],
    "E/Dbm": ["ドb","レb","ミ","ファb","ソb","ラ","シ"],
    "F/Dm":  ["ド","レ","ミ","ファ","ソ","ラ","シb"],
    "Gb/Ebm":["レb","ミb","ファ","ソb","ラb","シb","シ"],
    "G/Em":  ["ド","レ","ミ","ファ#","ソ","ラ","シ"],
    "Ab/Fm": ["ド","レb","ミb","ファ","ソ","ラb","シb"],
    "A/Gbm": ["ドb","レ","ミ","ファb","ソb","ラ","シ"],
    "Bb/Gm": ["ド","レ","ミb","ファ","ソ","ラ","シb"],
    "B/Abm": ["ドb","レb","ミ","ファb","ソb","ラb","シ"]
  };
  
  var Keys = {"C":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,"E":4,"F":5,"F#":6,"Gb":6,"G":7,"G#":8,"Ab":8,"A":9,"A#":10,"Bb":10,"B":11};
  var chord_list =[ //C3のインデックス基準 テンションコードは別で付与 逆順で表示しているため、+-が逆
    [0, 0, 0], //Major
    [0, 1, 0], //Minor
    [0, 2, 0], //sus2
    [0, -1, 0], //sus4
    [0, 0, -1], //aug
    [0, 1, 1] //dim
  ]
  var Tensions = [
    2, //6th
    3, //7th
    4, //M7th
    6, //add9thb
    7 //add9th
  ];
  Mscale_Do.reverse(); //逆から表示するために反転している
  Mscale_C.reverse(); //同上
  Scales["C/Am"].reverse();Scales["Db/Bbm"].reverse();Scales["D/Bm"].reverse();Scales["Eb/Cm"].reverse();Scales["E/Dbm"].reverse();Scales["F/Dm"].reverse();Scales["Gb/Ebm"].reverse();Scales["G/Em"].reverse();Scales["Ab/Fm"].reverse();Scales["A/Gbm"].reverse();Scales["Bb/Gm"].reverse();Scales["B/Abm"].reverse();
  Scales_DoReMi["C/Am"].reverse();Scales_DoReMi["Db/Bbm"].reverse();Scales_DoReMi["D/Bm"].reverse();Scales_DoReMi["Eb/Cm"].reverse();Scales_DoReMi["E/Dbm"].reverse();Scales_DoReMi["F/Dm"].reverse();Scales_DoReMi["Gb/Ebm"].reverse();Scales_DoReMi["G/Em"].reverse();Scales_DoReMi["Ab/Fm"].reverse();Scales_DoReMi["A/Gbm"].reverse();Scales_DoReMi["Bb/Gm"].reverse();Scales_DoReMi["B/Abm"].reverse();
  
  //小節
  for(var h = 1; h-1 < notes_measure/16; h++){
    $(".Measure_grid").append("<div class=\"measures\"><p>"+h);
  }
  //音階
  for(var i = 0; i < MIDI_Mscale; i++){
    var Mscale_index = Math.ceil((MIDI_Mscale-i) / 7); //国際式はi-12 ヤマハ式はi-24
    $(".Mscale_grid").append("<div class=\"Mscale_notes\"><p>" + Scales[Key][i%7] + Mscale_index);
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
  //ウィンドウサイズをリサイズした時
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
  
  $(".Measure_grid").scroll(function(){
    $(".note_grid").scrollLeft(
      $(".Measure_grid").scrollLeft()
    );
  });
  $(".Mscale_grid").scroll(function(){
    $(".note_grid").scrollTop(
      $(".Mscale_grid").scrollTop()
    );
  });

  //notes縦横可変
  const measure_width = 800; //measuresの最低幅 ページ読み込み時の初期サイズは1600px
  const note_width = 50; //notesの最低幅 ページ読み込み時の初期サイズは100px
  const note_height = 20; //notesの最低高さ ページ読み込み時の初期サイズは40px
  var note_resize_width = 100; //notesの現在幅
  var measure_resize_width = 1600; //measuresの現在幅

  $(".Mscale_notes").css({"width":note_width*2, "height":note_height*2});
  $(".notes").css({"width":note_width*2, "height":note_height*2});

  $(".width_scale_bar").on("input",function(){
    measure_resize_width = measure_width * ($(".width_scale_bar").val() / 50);
    $(".measures").eq(Seek_measure).css("width",measure_resize_width+3);
    $(".measures").css("width", measure_resize_width);
    note_resize_width = note_width * ($(".width_scale_bar").val() / 50);
    $(".notes").css("width", note_resize_width);
  });
  $(".height_scale_bar").on("input",function(){
    var note_resize_height = note_height * ($(".height_scale_bar").val() / 50);
    $(".Mscale_notes").css("height", note_resize_height);
    $(".notes").css("height", note_resize_height);
  });
  
  //MIDI色切り替え, 音声出力
  var isMouseDown = false; //マウスを押下しているか
  var isShiftDown = false; //シフトキーをマウス押下時に押下していたか
  var polysynth_melody = new Tone.PolySynth().toMaster(); //Melody用
  var polysynth_chord = new Tone.PolySynth().toMaster(); //Chord用
  var plucksynth = new Tone.PluckSynth().toMaster(); //Bass用
  /*Samplerについての注意事項
  初期状態ではXHRでローカルファイルを持ってくることはセキュリティ上できないため、
  ローカルで起動する場合はWebブラウザの設定が必要。
  Firefoxならstrict_origin_policy = True(既定値) → Falseにする。(非推奨)*/
  var Vocaloid_sampler = new Tone.Sampler({
    "C3":"./audio/Vocaloid/C3.mp3",
    "G3":"./audio/Vocaloid/G3.mp3",
    "C4":"./audio/Vocaloid/C4.mp3",
    "G4":"./audio/Vocaloid/G4.mp3",
    "C5":"./audio/Vocaloid/C5.mp3"
  }).toMaster();
  var Piano_sampler = new Tone.Sampler({
    "C3" : "./audio/Piano/Piano_C3.wav",
  }, {attack:0.05 ,release:1.0}).toMaster();
  var Guitar_sampler = new Tone.Sampler({"C3" : "./audio/Guitar/GuitarC4.wav",},{attack:0.05,release:2.0}).toMaster();
  var Drum_sampler = new Tone.Sampler({
    "C1" : "./audio/Drum/Kick_C1.wav",
    "C#1" : "./audio/Drum/Snare_Cs1.wav",
    "D1" : "./audio/Drum/Snare_D1.wav",
    "E1" : "./audio/Drum/Snare_E1.wav",
    "F1" : "./audio/Drum/LowTom_F1.wav",
    "F#1" : "./audio/Drum/CH_Fs1.wav",
    "G1" : "./audio/Drum/LowTom_G1.wav",
    "G#1" : "./audio/Drum/CHF_Gs1.wav",
    "A1" : "./audio/Drum/MidTom_A1.wav",
    "A#1" : "./audio/Drum/OH_As1.wav",
    "B1" : "./audio/Drum/MidTom_B1.wav",
    "C2" : "./audio/Drum/HighTom_C2.wav",
    "C#2" : "./audio/Drum/CrashLeft_Cs2.wav",
    "D2" : "./audio/Drum/HighTom_D2.wav",
    "D#2" : "./audio/Drum/Ride_Ds2.wav",
    "E2" : "./audio/Drum/OH_E2.wav"
  }).toMaster();
  //メロディ・コード・ベース・ドラムのinst情報
  const Melody_inst = [polysynth_melody, Vocaloid_sampler];
  const Chord_inst = [Guitar_sampler, polysynth_chord, Piano_sampler]; //コード用楽器リスト
  var Instruments = [Melody_inst[melody_idx], Chord_inst[chord_idx], plucksynth, Drum_sampler];
  
  function addMelody(time, note) {
    Instruments[0].triggerAttackRelease(note.note, note.duration, time);
  }
  function addChord(time, note) {
    Instruments[1].triggerAttackRelease(note.note, note.duration, time);
  }
  function addBass(time, note) {
    Instruments[2].triggerAttackRelease(note, '16n', time);
  }
  function addDrum(time, note) {
    Instruments[3].triggerAttackRelease(note, '1n', time);
  }
  
  //楽器選択(メロディ)
  var melody_inst_name = $(".melody_inst_item").eq(melody_idx).html();
  $(".melody_inst").html(melody_inst_name);
  
  $(".melody_inst_item").on("click", function(){
    melody_idx = $(".melody_inst_item").index(this);
    //楽器のボリューム等の情報を渡す
    if($(".mute").eq(0).hasClass("active")){
      Melody_inst[melody_idx].volume.value = -Infinity; //ミュート
    }else{
      Melody_inst[melody_idx].volume.value = volume[0]; //ボリューム
    }
    Melody_inst[melody_idx].connect(efpan[0]); //エフェクト・パン
    
    Instruments[0] = Melody_inst[melody_idx];
    melody_inst_name = $(".melody_inst_item").eq(melody_idx).html();
    $(".melody_inst").html(melody_inst_name);
    $(".inst_item_melody > details").removeAttr("open");
  });
  
  //楽器選択(コード)
  var chord_inst_name = $(".chord_inst_item").eq(chord_idx).html();
  $(".chord_inst").html(chord_inst_name);
  
  $(".chord_inst_item").on("click", function(){
    chord_idx = $(".chord_inst_item").index(this);
    //楽器のボリューム等の情報を渡す
    if($(".mute").eq(1).hasClass("active")){
      Chord_inst[chord_idx].volume.value = -Infinity; //ミュート
    }else{
      Chord_inst[chord_idx].volume.value = volume[1]; //ボリューム
    }
    Chord_inst[chord_idx].connect(efpan[1]); //エフェクト・パン
    
    Instruments[1] = Chord_inst[chord_idx];
    chord_inst_name = $(".chord_inst_item").eq(chord_idx).html();
    $(".chord_inst").html(chord_inst_name);
    $(".inst_item_chord > details").removeAttr("open");
  });
  
  
  //ボリューム・ミュート・パン
  //ボリューム
  //ロード処理
  for(var x=0; x<Instruments.length; x++){
    Instruments[x].volume.value = volume[x];
    $('.volume').eq(x).val(volume[x]);
  }
  
  //クリック時の処理
  $('.volume').on('input change', function() {
    var idx = $(".volume").index(this);
    volume[idx] = $(this).val();
    $('.volume').eq(idx).html(volume[idx]);
    if($(".mute").eq(idx).hasClass("active") == false){
      Instruments[idx].volume.value = volume[idx];
    }
  });
  
  //ミュート
  $(".mute").on("click", function(){
    var idx = $(".mute").index(this);
    if($(this).hasClass("active")){
      Instruments[idx].volume.value = -Infinity;
    }else{
      Instruments[idx].volume.value = volume[idx];
    }
  });
  
  //パン
  //ロード処理
  var efpan = ["", "", "", ""]; //全楽器のエフェクト・パン
  for(var x=0; x<pan.length; x++){
    efpan[x] = new Tone.Panner(pan[x]);
    $('.pan').eq(x).val(pan[x]);
    Instruments[x].connect(efpan[x]);
    efpan[x].toMaster();
  }
  
  //クリック時の処理
  $('.pan').on('input change', function() {
    var idx = $(".pan").index(this);
    pan[idx] = $(this).val();
    efpan[idx].pan.value = pan[idx];
    $('.pan').eq(idx).html(efpan[idx])
  });
  
  //エフェクト
  var effect_list = [
    "", "", "", "", ""
  ];
  effect_list[0] = new Tone.Freeverb().toMaster(); //リバーブ
  effect_list[1] = new Tone.Chorus().toMaster(); //コーラス
  effect_list[2] = new Tone.Distortion().toMaster(); //ディストーション
  effect_list[3] = new Tone.FeedbackDelay().toMaster(); //ディレイ
  effect_list[4] = new Tone.AutoWah(50, 8, 0).toMaster(); //ワウ
  effect_list[4].Q.value = 6;
  console.log(effect_list[4])
  
  //エフェクトコントロール関数
  function ef_control(inst, idx, load){ //配列の値が1ならエフェクトオン loadなら処理をスキップ
    if(effect_selecter[inst][idx] == 1){
      efpan[inst].connect(effect_list[idx]);
    }else if(load){

    }else{
      efpan[inst].disconnect(effect_list[idx]);
    }
  }
  
  //ロード処理
  var count = 0;
  const ef_amount = effect_selecter[0].length;
  for(var x=0; x<4; x++){
    for(var y=0; y<ef_amount; y++){
      if(effect_selecter[x][y] == 1){
        $(".effect_list > li").eq(count).addClass("ef_selected");
      }
      ef_control(x, y, true);
      count += 1;
    }
  }
  //クリック時の処理
  $(".effect_list > li").on("click", function(){
    $(this).toggleClass("ef_selected");
    var ef_idx = $('.effect_list > li').index(this) % ef_amount;
    var ef_inst = Math.floor($('.effect_list > li').index(this) / ef_amount);
    if(effect_selecter[ef_inst][ef_idx] == 0){
      effect_selecter[ef_inst][ef_idx] = 1;
    }else{
      effect_selecter[ef_inst][ef_idx] = 0;
    }
    ef_control(ef_inst, ef_idx, false);
    console.log(effect_selecter);
  });
  
  for(x=0; x<notes_measure/16; x++){ //
    for(y=0; y<4; y++){
      for(z=0; z<4; z++){
        MIDI_Melody.push({"time":x+":"+y+":"+z, "note":[""], "duration":"16n"});
      }
    }
  }
  var note_position = 0;
  var ml_column = 0; //どの行？
  var ml_line = 0; //どの列？
  var first_line = 0; //最初の列
  var line_count = 0; //現在ml_highlitedにした列数
  var remove_flg = 0; //消す処理をしているか否か
  
  //リドゥ・アンドゥ用配列 (計5つまで)
  var Melody_log = []; //初期状態では起動後の状態を保存したログが一つ入っている
  var Undo_idx = -1;
  
  $(".notes").mousedown(function(event) {
    isMouseDown = true;
    if(Melody_log.length != Undo_idx+2){ //Undo_idxは常にMelody_logの最後尾-1に位置する
      Melody_log.splice(Undo_idx+2, Melody_log.length-Undo_idx+2);
    }
    
    note_position = $('.notes').index(this); //ノートの全体からの位置
    var note_name = note_position % 7;
    var pitch =  Math.ceil((MIDI_Mscale-note_position%MIDI_Mscale) / 7);
    var MIDI_note = Scales[Key][note_name] + pitch;
    var measure_count = $(this).parent().index(".MIDI_notes");
    console.log("measure:" + measure_count);
    if($(this).hasClass('highlighted') == false){
      Instruments[0].triggerAttackRelease(MIDI_note, '16n');

      if(MIDI_Melody[measure_count].note == ""){
        MIDI_Melody[measure_count].note.splice(0, 1, MIDI_note);
        console.log("新規追加");
        console.log(MIDI_Melody);
      }else{
        MIDI_Melody[measure_count].note.push(MIDI_note);
        console.log("追加");
        console.log(MIDI_Melody);
      }
    }else{
      var highlight_index = $.inArray(MIDI_note, MIDI_Melody[measure_count].note);
      MIDI_Melody[measure_count].note.splice(highlight_index, 1);
      console.log("削除");
      console.log(MIDI_Melody);
    }
    $(this).toggleClass("highlighted");
    return false; // prevent text selection
  })
  .mouseover(function() {
    if (isMouseDown) {
      note_position = $('.notes').index(this); //ノートの全体からの位置
      var note_name = note_position % 7;
      var pitch =  Math.ceil((MIDI_Mscale-note_position%MIDI_Mscale) / 7);
      var MIDI_note = Scales[Key][note_name] + pitch;
      var measure_count = $(this).parent().index(".MIDI_notes");
      if($(this).hasClass('highlighted') == false){
        Instruments[0].triggerAttackRelease(MIDI_note, '16n');

        if(MIDI_Melody[measure_count].note == ""){
          MIDI_Melody[measure_count].note.splice(0, 1, MIDI_note);
          console.log("新規追加");
          console.log(MIDI_Melody);
        }else{
          MIDI_Melody[measure_count].note.push(MIDI_note);
          console.log("追加");
          console.log(MIDI_Melody);
        }
        $(this).addClass("highlighted");
      }else{
        var highlight_index = $.inArray(MIDI_note, MIDI_Melody[measure_count].note);
        MIDI_Melody[measure_count].note.splice(highlight_index, 1);
        console.log("削除");
        console.log(MIDI_Melody);
        $(this).removeClass("highlighted");
      }
      //$(this).toggleClass("highlighted");
    }
  })
  .bind("selectstart", function () {
    return false; // prevent text selection in IE
  });
  
  $(document).mouseup(function() {
    if(isMouseDown){ //リドゥ・アンドゥ用のLog
      if(Melody_log.length < 100){
        Melody_cup = JSON.parse(JSON.stringify(MIDI_Melody));
        Melody_log.push(Melody_cup);
      }else{
        Melody_log.shift();
        Melody_cup = JSON.parse(JSON.stringify(MIDI_Melody));
        Melody_log.push(Melody_cup);
      }
      if(Undo_idx < 98){
        Undo_idx++;
      }
    }
    isMouseDown = false;
    
    //変数の初期化
    remove_flg = 0;
    ml_line = 0;
    line_count = 0;
    isShiftDown = false;
  })
  
  //受け渡された情報からメロディを表示する 読み込みに使用
  //Polysynthは和音に対応 三次元配列で記述可
  var test_Melody = [
    {"time":"0:0:0", "note":["A5"], "duration":"16n"},
    {"time":"0:0:1", "note":[""], "duration":"16n"},
    {"time":"0:0:2", "note":["F5"], "duration":"16n"},
    {"time":"0:0:3", "note":[], "duration":"16n"},
    {"time":"0:1:0", "note":["G5"], "duration":"16n"},
    {"time":"0:1:1", "note":[], "duration":"16n"},
    {"time":"0:1:2", "note":["A5"], "duration":"16n"},
    {"time":"0:1:3", "note":[""], "duration":"16n"},
    {"time":"0:2:0", "note":[], "duration":"16n"},
    {"time":"0:2:1", "note":[""], "duration":"16n"},
    {"time":"0:2:2", "note":["F6"], "duration":"16n"},
    {"time":"0:2:3", "note":[], "duration":"16n"},
    {"time":"0:3:0", "note":["E6"], "duration":"16n"},
    {"time":"0:3:1", "note":[], "duration":"16n"},
    {"time":"0:3:2", "note":["F6"], "duration":"16n"},
    {"time":"0:3:3", "note":[], "duration":"16n"},
    {"time":"1:0:0", "note":["E6"], "duration":"16n"},
    {"time":"1:0:1", "note":[""], "duration":"16n"},
    {"time":"1:0:2", "note":["F6"], "duration":"16n"},
    {"time":"1:0:3", "note":[], "duration":"16n"},
    {"time":"1:1:0", "note":["E6"], "duration":"8n"},
    {"time":"1:1:1", "note":[], "duration":"16n"},
    {"time":"1:1:2", "note":[""], "duration":"16n"},
    {"time":"1:1:3", "note":[""], "duration":"16n"},
    {"time":"1:2:0", "note":["C6"], "duration":"16n"},
    {"time":"1:2:1", "note":[""], "duration":"16n"},
    {"time":"1:2:2", "note":["D6"], "duration":"16n"},
    {"time":"1:2:3", "note":[], "duration":"16n"},
    {"time":"1:3:0", "note":["A5"], "duration":"16n"},
    {"time":"1:3:1", "note":[], "duration":"16n"},
    {"time":"1:3:2", "note":["G5"], "duration":"16n"},
    {"time":"1:3:3", "note":[""], "duration":"16n"},
    {"time":"2:0:0", "note":["F5"], "duration":"16n"},
    {"time":"2:0:1", "note":[""], "duration":"16n"},
    {"time":"2:0:2", "note":[""], "duration":"16n"},
    {"time":"2:0:3", "note":[], "duration":"16n"},
    {"time":"2:1:0", "note":["G5"], "duration":"16n"},
    {"time":"2:1:1", "note":[], "duration":"16n"},
    {"time":"2:1:2", "note":[""], "duration":"16n"},
    {"time":"2:1:3", "note":[""], "duration":"16n"},
    {"time":"2:2:0", "note":["F5"], "duration":"16n"},
    {"time":"2:2:1", "note":[""], "duration":"16n"},
    {"time":"2:2:2", "note":[""], "duration":"16n"},
    {"time":"2:2:3", "note":[], "duration":"16n"},
    {"time":"2:3:0", "note":["G5"], "duration":"16n"},
    {"time":"2:3:1", "note":[], "duration":"16n"},
    {"time":"2:3:2", "note":["D5"], "duration":"16n"},
    {"time":"2:3:3", "note":[], "duration":"16n"},
    {"time":"3:0:0", "note":[""], "duration":"16n"},
    {"time":"3:0:1", "note":[""], "duration":"16n"},
    {"time":"3:0:2", "note":["D5"], "duration":"16n"},
    {"time":"3:0:3", "note":[], "duration":"16n"},
    {"time":"3:1:0", "note":["A5"], "duration":"16n"},
    {"time":"3:1:1", "note":[], "duration":"16n"},
    {"time":"3:1:2", "note":[""], "duration":"16n"},
    {"time":"3:1:3", "note":[""], "duration":"16n"},
    {"time":"3:2:0", "note":["G5"], "duration":"16n"},
    {"time":"3:2:1", "note":[""], "duration":"16n"},
    {"time":"3:2:2", "note":[""], "duration":"16n"},
    {"time":"3:2:3", "note":[], "duration":"16n"},
    {"time":"3:3:0", "note":["F5"], "duration":"16n"},
    {"time":"3:3:1", "note":[], "duration":"16n"},
    {"time":"3:3:2", "note":["G5"], "duration":"16n"},
    {"time":"3:3:3", "note":[], "duration":"16n"},
    {"time":"4:0:0", "note":["A5"], "duration":"16n"},
    {"time":"4:0:1", "note":[""], "duration":"16n"},
    {"time":"4:0:2", "note":[""], "duration":"16n"},
    {"time":"4:0:3", "note":[], "duration":"16n"},
    {"time":"4:1:0", "note":["G5"], "duration":"16n"},
    {"time":"4:1:1", "note":[], "duration":"16n"},
    {"time":"4:1:2", "note":["F5"], "duration":"16n"},
    {"time":"4:1:3", "note":[""], "duration":"16n"},
    {"time":"4:2:0", "note":[], "duration":"16n"},
    {"time":"4:2:1", "note":[""], "duration":"16n"},
    {"time":"4:2:2", "note":[""], "duration":"16n"},
    {"time":"4:2:3", "note":[], "duration":"16n"},
    {"time":"4:3:0", "note":["C6"], "duration":"16n"},
    {"time":"4:3:1", "note":[], "duration":"16n"},
    {"time":"4:3:2", "note":[""], "duration":"16n"},
    {"time":"4:3:3", "note":[], "duration":"16n"},
    {"time":"5:0:0", "note":[""], "duration":"16n"},
    {"time":"5:0:1", "note":[""], "duration":"16n"},
    {"time":"5:0:2", "note":["G5"], "duration":"16n"},
    {"time":"5:0:3", "note":[], "duration":"16n"},
    {"time":"5:1:0", "note":[""], "duration":"16n"},
    {"time":"5:1:1", "note":[], "duration":"16n"},
    {"time":"5:1:2", "note":["A5"], "duration":"16n"},
    {"time":"5:1:3", "note":[""], "duration":"16n"},
    {"time":"5:2:0", "note":["A#5"], "duration":"16n"},
    {"time":"5:2:1", "note":[""], "duration":"16n"},
    {"time":"5:2:2", "note":["A5"], "duration":"16n"},
    {"time":"5:2:3", "note":[], "duration":"16n"},
    {"time":"5:3:0", "note":["G5"], "duration":"16n"},
    {"time":"5:3:1", "note":[], "duration":"16n"},
    {"time":"5:3:2", "note":[""], "duration":"16n"},
    {"time":"5:3:3", "note":[], "duration":"16n"},
    {"time":"6:0:0", "note":["A5"], "duration":"16n"},
    {"time":"6:0:1", "note":[""], "duration":"16n"},
    {"time":"6:0:2", "note":[""], "duration":"16n"},
    {"time":"6:0:3", "note":[], "duration":"16n"},
    {"time":"6:1:0", "note":["G5"], "duration":"16n"},
    {"time":"6:1:1", "note":[], "duration":"16n"},
    {"time":"6:1:2", "note":["C6"], "duration":"16n"},
    {"time":"6:1:3", "note":[""], "duration":"16n"},
    {"time":"6:2:0", "note":["F5"], "duration":"16n"},
    {"time":"6:2:1", "note":[""], "duration":"16n"},
    {"time":"6:2:2", "note":[""], "duration":"16n"},
    {"time":"6:2:3", "note":[], "duration":"16n"},
    {"time":"6:3:0", "note":["G5"], "duration":"16n"},
    {"time":"6:3:1", "note":[], "duration":"16n"},
    {"time":"6:3:2", "note":[""], "duration":"16n"},
    {"time":"6:3:3", "note":[], "duration":"16n"},
    {"time":"7:0:0", "note":["F5"], "duration":"16n"},
    {"time":"7:0:1", "note":[""], "duration":"16n"},
    {"time":"7:0:2", "note":[""], "duration":"16n"},
    {"time":"7:0:3", "note":[], "duration":"16n"},
    {"time":"7:1:0", "note":["G5"], "duration":"16n"},
    {"time":"7:1:1", "note":[], "duration":"16n"},
    {"time":"7:1:2", "note":[""], "duration":"16n"},
    {"time":"7:1:3", "note":[""], "duration":"16n"},
    {"time":"7:2:0", "note":["A5"], "duration":"16n"},
    {"time":"7:2:1", "note":[""], "duration":"16n"},
    {"time":"7:2:2", "note":[""], "duration":"16n"},
    {"time":"7:2:3", "note":[], "duration":"16n"},
    {"time":"7:3:0", "note":["F5"], "duration":"16n"},
    {"time":"7:3:1", "note":[], "duration":"16n"},
    {"time":"7:3:2", "note":[""], "duration":"16n"},
    {"time":"7:3:3", "note":[], "duration":"16n"}
  ];
  
  function Melody_display(Mel){
    for(y=0; y<Mel.length; y++){
      if(Mel[y].note.length > 0 && Mel[y].note[0] != ""){
        for(z=0; z<Mel[y].note.length; z++){
          var pitch = Mel[y].note[z].slice(-1);
          if(Mel[y].note[z].length == 3){ //C#3
            var note_name = Mel[y].note[z].slice(0, 2);
          }else{
            var note_name = Mel[y].note[z].slice(0, 1);
          }
          
          if(Scales[Key].indexOf(note_name) < 0){
            //エラー処理 エラーがあれば音情報を組み込まず表示もしない
            console.log("この音は"+Key+"内に存在しません："+note_name+pitch);
          }else{
            if(MIDI_Melody[y].note == ""){ //音情報
              MIDI_Melody[y].note.splice(0, 1, Mel[y].note[0]);
            }else{
              MIDI_Melody[y].note.push(Mel[y].note[z]);
            }
            $(".notes").eq( //highlighted
              Scales[Key].indexOf(note_name) + (6-pitch)*7 + y*MIDI_Mscale
            ).addClass("highlighted");
          }
        }
      }
    }
    console.log("保存データ読み込み")
    console.log(MIDI_Melody);
  };
  //Melody_display(test_Melody); //ダミーデータを読み込み >> 保存データを読み込み
  
  
  //コード(文字列からの生成)
  var gene_chords = Generated_chord.split(" ");
  var bassline = [];
  var key = [];
  var chord = [];
  var tension = [];
  var MIDI_chord = [];
  var cc_index = 0;
  for(var x=0; x<notes_measure/16; x++){
    if(gene_chords[x%4].indexOf("/") >= 0){
      bassline.push(gene_chords[x%4].slice(gene_chords[x%4].indexOf("/")+1));
    }else if(gene_chords[x%4].indexOf("#") == 1 || gene_chords[x%4].indexOf("b") == 1){
      bassline.push(gene_chords[x%4].slice(0, 2));
    }else{
      bassline.push(gene_chords[x%4].slice(0, 1));
    }
    
    if(gene_chords[x%4].indexOf("#") == 1 || gene_chords[x%4].indexOf("b") == 1){
      key.push(gene_chords[x%4].slice(0, 2));
    }else{
      key.push(gene_chords[x%4].slice(0, 1));
    }
    
    if(gene_chords[x%4].indexOf("dim") >= 0){
      chord.push(chord_list[5]);
    }else if(gene_chords[x%4].indexOf("aug") >= 0){
      chord.push(chord_list[4]);
    }else if(gene_chords[x%4].indexOf("sus4") >= 0){
      chord.push(chord_list[3]);
    }else if(gene_chords[x%4].indexOf("sus2") >= 0){
      chord.push(chord_list[2]);
    }else if(gene_chords[x%4].indexOf("m") >= 0){
      chord.push(chord_list[1]);
    }else{
      chord.push(chord_list[0]);
    }
    
    if(gene_chords[x%4].indexOf("add9b") >= 0){
      tension.push(Tensions[3]);
    }else if(gene_chords[x%4].indexOf("add9") >= 0){
      tension.push(Tensions[4]);
    }else if(gene_chords[x%4].indexOf("M7") >= 0){
      tension.push(Tensions[2]);
    }else if(gene_chords[x%4].indexOf("7") >= 0){
      tension.push(Tensions[1]);
    }else if(gene_chords[x%4].indexOf("6") >= 0){
      tension.push(Tensions[0]);
    }else{
      tension.push(0);
    }
    
    for(var y=0; y<16; y++){
      if(chord_stroke[Rythem_pattern][x*16+y].note.length > 0 && chord_stroke[Rythem_pattern][x*16+y].note[0] != ""){
        MIDI_chord.push(chord_stroke[Rythem_pattern][x*16+y]);
        for(var z=0; z<3; z++){
          MIDI_chord[cc_index].note[z] -= Keys[key[x]];
          MIDI_chord[cc_index].note[z] += chord[x][z];
        }
        if(tension[x] != 0){
          MIDI_chord[cc_index].note.push(MIDI_chord[cc_index].note[2] - tension[x]);
        }
        for(var aa=0; aa<MIDI_chord[cc_index].note.length; aa++){
          var note_name = MIDI_chord[cc_index].note[aa] % 12;
          var pitch =  Math.ceil((72-MIDI_chord[cc_index].note[aa]%72) / 12);
          var MIDI_note = Mscale_C[note_name] + pitch;
          MIDI_chord[cc_index].note.splice(aa, 1, MIDI_note);
        }
        cc_index += 1;
      }
    }
  }
  console.log(MIDI_chord);
  
  //ベース(コードからの自動生成)
  /*2拍に1回のペースでルート音を演奏。(C2〜B2)
  分数コードの場合は、該当する音を演奏。*/
  var MIDI_bass = [];
  for(x=0; x<notes_measure/16; x++){ //
    for(y=0; y<4; y++){
      for(z=0; z<4; z++){
        if(z%2 == 0){
          MIDI_bass.push([x+":"+y+":"+z, bassline[x]+2]);
        }
      }
    }
  }
  //console.log(MIDI_bass);
  
  
  
  //再生処理
  var Seekbar_position = 0;
  function Seekbar_move(){ //再生時, →の処理
    if(Seekbar_position > notes_measure){
      Seekbar_position = 0;
      $(".Seekbar").remove();
      $(".MIDI_notes").eq(Seekbar_position).after("<div class=\"Seekbar\">");
    }else{
      $(".Seekbar").remove();
      $(".MIDI_notes").eq(Seekbar_position).after("<div class=\"Seekbar\">");
      Seekbar_position++;
    }
    $(".note_grid").scrollLeft(note_resize_width*Seekbar_position);
    Mwidth_control();
  }
  function Seekbar_back(){ //←の処理
    Seekbar_position--;
    $(".Seekbar").remove();
    $(".MIDI_notes").eq(Seekbar_position).before("<div class=\"Seekbar\">");
    $(".note_grid").scrollLeft(note_resize_width*Seekbar_position);
    Mwidth_control();
  }
  var Measure_position = "0:0:0";
  function Measure_calc(num){
    var a = Math.floor(num / 16);
    var b = Math.floor(num / 4) % 4;
    var c = num % 4;
    if(a > 7){
      Measure_position = "0:0:0";
    }else{
      Measure_position = (a+":"+b+":"+c);
    }
    var Disp_Measure_position = ((a+1)+":"+b+":"+c); //表示用
    $(".exbar .gr").html(Disp_Measure_position);
  }
  var Seek_measure = 0;
  function Mwidth_control(){
    Seek_measure = Math.floor(Seekbar_position / 16);
    $(".measures").css("width",measure_resize_width);
    $(".measures").eq(Seek_measure).css("width",measure_resize_width+3);
  }
  $(".exbar .gr").html("1:0:0");
  $(".extime .gr").html("00:00");
  
  function music_back(){
    Tone.Transport.stop();
    Tone.Transport.cancel();
    play_flg = false;
    $('.play-btn').show();
    $('.stop-btn').hide();
    Seekbar_position = 0;
    $(".Seekbar").remove();
    $(".MIDI_notes").eq(Seekbar_position).before("<div class=\"Seekbar\">");
    Measure_position = "0:0:0";
    $(".exbar .gr").html("1:0:0");
    $(".extime .gr").html("00:00");
    $(".note_grid").scrollLeft(0);
  }
  $("#backward").on("click", function(){ //シークバーを初期位置に戻すよ
    music_back();
  });
  
  function music_play(){
    Tone.Transport.bpm.value = bpm; //bpm
    if(play_flg == false){
      var play_MIDI_Melody = []; //再生用に無駄な情報を省いたもの
      var play_MIDI_Drum =[];
      for(z=0; z<drum_pattern[Rythem_pattern].length; z++){ //本来はz<notes_measure
        if(MIDI_Melody[z].note.length > 0 && MIDI_Melody[z].note[0] != ""){
          play_MIDI_Melody.push(MIDI_Melody[z]);
        }
        if(drum_pattern[Rythem_pattern][z][1].length > 0 && drum_pattern[Rythem_pattern][z][1][0] != ""){
          play_MIDI_Drum.push(drum_pattern[Rythem_pattern][z]);
        }
      }
      var Melody = new Tone.Part(addMelody, play_MIDI_Melody).start();
      var Chord = new Tone.Part(addChord, MIDI_chord).start();
      var Bass = new Tone.Part(addBass, MIDI_bass).start();
      var Drum = new Tone.Part(addDrum, play_MIDI_Drum).start();
      
      Tone.Transport.seconds = Measure_position; //再生位置
      Tone.Transport.scheduleRepeat(function(){ //シークバー他再生時の処理
        Tone.Transport.bpm.value = bpm;
        Seekbar_move();
        Measure_calc(Seekbar_position);
        if(Tone.Transport.getSecondsAtTime()%60 > 10){
          var Seekbar_time = "0"+Math.floor(Tone.Transport.getSecondsAtTime()/60)+":"+Math.floor(Tone.Transport.getSecondsAtTime()%60);
        }else{
          var Seekbar_time = "0"+Math.floor(Tone.Transport.getSecondsAtTime()/60)+":"+"0"+Math.floor(Tone.Transport.getSecondsAtTime()%60);
        }
        $(".extime .gr").html(Seekbar_time);
        //console.log($('.Seekbar').offset().left);
        //console.log($('.note_grid').offset().left);
      }, "16n");
      Tone.Transport.loop = true;
      Tone.Transport.loopEnd = "8:0:0";
      Tone.Transport.start();
    }else{
      music_stop();
    }
  }
  function music_stop(){
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
  
  $("#play").click(function(){
    music_play();
  });
  
  /*ショートカット*/
  $(document).on("keydown", function(e){ 
    if($(".save-window").css("display") == "none"){
      if(e.keyCode == 32){ //space 再生・停止
        e.preventDefault();
        music_play();
      }
      if(e.keyCode == 13){ //enter 再生位置を初期位置に戻す
        if(e.preventDefault){
          e.preventDefault();
        }
        music_back();
      }
      if(e.keyCode == 37){ //← 再生位置を戻す
        e.preventDefault();
        if(Seekbar_position > 0){
          if(play_flg){
            music_stop();
          }
          Seekbar_back();
          Measure_calc(Seekbar_position);
        }
      }
      if(e.keyCode == 39){ //→ 再生位置を進める
        e.preventDefault();
        if(Seekbar_position < 128){
          if(play_flg){
            music_stop();
          }
          Seekbar_move();
          Measure_calc(Seekbar_position);
        }
      }
      if(e.metaKey && e.keyCode == 89 && Undo_idx+2 < Melody_log.length){ //cmd + y リドゥ
        if(e.preventDefault){
          e.preventDefault();
        }
        Redo_Melody();
      }
      if(e.metaKey && e.keyCode == 90 && Undo_idx >= 0){ //cmd + z アンドゥ
        if(e.preventDefault){
          e.preventDefault();
        }
        Undo_Melody();
      }
    }
  })
  
  function Redo_Melody(){
    $(".notes").removeClass("highlighted");
    
    Melody_cup = JSON.parse(JSON.stringify(Melody_log[Undo_idx+2]));
    MIDI_Melody = Melody_cup;
    
    for(y=0; y<MIDI_Melody.length; y++){
      if(MIDI_Melody[y].note.length > 0 && MIDI_Melody[y].note[0] != ""){
        for(z=0; z<MIDI_Melody[y].note.length; z++){
          var pitch = MIDI_Melody[y].note[z].slice(-1);
          if(MIDI_Melody[y].note[z].length == 3){ //C#3
            var note_name = MIDI_Melody[y].note[z].slice(0, 2);
          }else{
            var note_name = MIDI_Melody[y].note[z].slice(0, 1);
          }
          $(".notes").eq( //highlighted
            Scales[Key].indexOf(note_name) + (6-pitch)*7 + y*MIDI_Mscale
          ).addClass("highlighted");
        }
      }
    }
    Undo_idx++;
  }
  function Undo_Melody(){
    $(".notes").removeClass("highlighted");
    
    Melody_cup = JSON.parse(JSON.stringify(Melody_log[Undo_idx]));
    MIDI_Melody = Melody_cup;
    
    for(y=0; y<MIDI_Melody.length; y++){
      if(MIDI_Melody[y].note.length > 0 && MIDI_Melody[y].note[0] != ""){
        for(z=0; z<MIDI_Melody[y].note.length; z++){
          var pitch = MIDI_Melody[y].note[z].slice(-1);
          if(MIDI_Melody[y].note[z].length == 3){ //C#3
            var note_name = MIDI_Melody[y].note[z].slice(0, 2);
          }else{
            var note_name = MIDI_Melody[y].note[z].slice(0, 1);
          }
          $(".notes").eq( //highlighted
            Scales[Key].indexOf(note_name) + (6-pitch)*7 + y*MIDI_Mscale
          ).addClass("highlighted");
        }
      }
    }
    Undo_idx--;
  }
  
  //起動後の初期状態をMelody_logに入れておく
  Melody_cup = JSON.parse(JSON.stringify(MIDI_Melody));
  Melody_log.push(Melody_cup);
});