jQuery(function(){
  //ユーザウィンドウ
  $(".user_name").html(user_name+"さん");

  $(".user_prof").on("click", function(){
    if($(".user_window").css("display") == "none"){
      $(".user_window").show();
    }else{
      $(".user_window").hide();
    }
  });
  $(".logout-btn").on("click", function(){
    if(confirm("本当にログアウトしますか。")){
      //Djangoのログアウト処理を記入
    }else{
      return false;
    }
  });
});