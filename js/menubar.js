const add = (x) => {
  return (x) && parseInt(x);
}

/*再生ボタンと停止ボタン*/
document.getElementById("play").onclick = function() {
  if(play_flg == 0){
    document.getElementById("play").innerHTML = "□";
  }else{
    document.getElementById("play").innerHTML = "▷";
  }
};

/*helpボタン*/
var help = true;
document.getElementById("help").onclick = function() {
  if(help == true){
    document.getElementById("numbpm").style.backgroundColor = "#FFFF8A";
    help = false;
  }else{
    document.getElementById("numbpm").style.backgroundColor = "white";
    help = true
  }
};