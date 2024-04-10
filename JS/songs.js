//when the user clicks on the song category, the cache is parsed by PHP for final render
$(document).on("click", ".button-left", function () {
  var id = $(this).attr("id");

  //check if the cache exists
  if (cache) {
    //check if an array exist in the cache with its key as the button id
    var section = cache.find((section) => section.hasOwnProperty(id));
    if (section) {
      $("#div_img_video_loader").html(section[id]);
    }

    //start the category from top of the page everytime
    $("#div_img_video_loader").scrollTop(0);
  }
});
