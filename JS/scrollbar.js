// scroll up and down for song thumbnails
function scroll_up() {
  //move the scroll bar up by 400px from current position
  $("#div_img_video_loader").animate(
    {
      scrollTop: $("#div_img_video_loader").scrollTop() - 400,
    },
    400
  );
}

function scroll_down() {
  //move the scroll bar down by 400px from current position
  $("#div_img_video_loader").animate(
    {
      scrollTop: $("#div_img_video_loader").scrollTop() + 400,
    },
    400
  );
}

// scroll up and down for queue
function scroll_up_queue() {
  //move the scroll bar up by 500px from current position
  $("#right-block-down").animate(
    {
      scrollTop: $("#right-block-down").scrollTop() - 500,
    },
    500
  );
}

function scroll_down_queue() {
  //move the scroll bar down by 500px from current position
  $("#right-block-down").animate(
    {
      scrollTop: $("#right-block-down").scrollTop() + 500,
    },
    500
  );
}

//function to open & close the side nav for Randomizer
function modifyNav(width, margin) {
  document.getElementById("mySidenav").style.width = width;
  document.getElementById("mySidenav").style.marginLeft = margin;
}
function openNav() {
  modifyNav("19vw", "0.5%");
}
function closeNav() {
  modifyNav("0", "0");
}
