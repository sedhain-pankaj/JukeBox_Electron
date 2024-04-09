//when the user clicks on the song category, the cache is parsed by PHP for final render
$(document).on("click", ".button-left", function () {
  var id = $(this).attr("id");

  //check if the cache exists
  if (cache) {
    //find a <section> tag with the same ID as the button
    var section = cache.match(
      new RegExp('<section id="' + id + '">.*?</section>', "s")
    );
    
    //if the section exists, render the songs
    if (section) {
      showSongs(section[0]);
    }

    //start the category from top of the page everytime
    $("#div_img_video_loader").scrollTop(0);
  }
});

function showSongs(response) {
  $("#div_img_video_loader").html("<div id='showSongs'></div>");
  $("#showSongs").append(response);
}
