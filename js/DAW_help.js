var help_trigger = [".save_callout", ".help_callout"];

jQuery(function(){
  $(".trigger").hover(
    function() {
      var callout_idx = $(".trigger").index(this);
      if(help_flg){
        $(help_trigger[callout_idx]).show();
      }
    },
    function() {
      if(help_flg){
        $(".callout").hide();
      }
    }
  );
});