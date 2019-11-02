jQuery(function($){
    //タブ管理 & nextボタン
    var next_index = 0;
    var pages_index = 2;
    var select_flg = [0];
    //タブ管理
    $('.Progress_number').click(function(){
        if(select_flg[0] == 1 && select_flg[1] == 1 && select_flg[2] == 1){
            $('.is-active').removeClass('is-active');
            $(this).addClass('is-active');
            $('.is-show').removeClass('is-show');
            pages_index = $(this).index();
            $('.start_page').eq(pages_index).addClass('is-show');
            next_index = $(this).index();
        }
    });
    //nextボタン
    $(".start_next-btn").click(function(){
        if(next_index <= 2){
            if(select_flg[next_index] > 0){
                next_index = next_index + 1;
                $('.is-active').removeClass('is-active');
                $('.Progress_number').eq(next_index).addClass('is-active');
                $('.is-show').removeClass('is-show');
                $('.start_page').eq(next_index).addClass('is-show');
            } else {
                alert("選択してください。");
            }
        } else {
            location.href = "./DAW.html";
        }
    });
    //artistボタン
    $(".artists_item").click(function(){
      $(".artists_is-select").removeClass("artists_is-select");
      $(this).addClass('artists_is-select');
      artist = $(".artists_is-select").html();
      select_flg[0] = 1;
    });
    //keyボタン
    $(".keys_item").click(function(){
      $(".keys_is-select").removeClass("keys_is-select");
      $(this).addClass('keys_is-select');
      key = $(".keys_is-select").html();
      select_flg[1] = 1;
    });
    //beatボタン
    $(".beats_item").click(function(){
      $(".beats_is-select").removeClass("beats_is-select");
      $(this).addClass('beats_is-select');
      rythem_pattern = $(".beats_is-select").html();
      select_flg[2] = 1;
    });
});