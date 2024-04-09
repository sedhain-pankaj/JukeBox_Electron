//array to hold songs that are queued
var queue_array = [];

//function to queue songs via "add to queue" button
function queue_array_create(filename, img, dir) {
  // Guard clause: if dir is already in queue_array, display message
  if (queue_array.includes(dir)) {
    jquery_modal({
      message:
        "This song exists already in queue. Once it is played from the queue, it can be added again.",
      title: "Song Already Queued",
    });
    return;
  }

  // Guard clause: if video.src is same as dir, display message
  if (decodeURIComponent(new URL(video.src).pathname.slice(1)) == dir) {
    jquery_modal({
      message:
        "This song is being played currently. Once it ends completely, it can be re-added to queue.",
      title: "Song Being Played Currently",
    });
    return;
  }

  //if it passes the guard clauses, add dir to queue_array and append to right-block-down
  queue_array.push(dir);
  $("#right-block-down").append(
    "<div class='queue_div'>" +
      "<button class='queue_remove_button' onclick='queue_array_remove(this, \"" +
      dir +
      "\")'>Remove <i class='material-icons' id='backspace'>backspace</i></button>" +
      "<img src='" +
      img +
      "'>" +
      "<li class='queue_name'>" +
      filename +
      "</li></div>"
  );

  //scroll to bottom of queue when a song is added
  $("#right-block-down").animate(
    { scrollTop: $("#right-block-down").prop("scrollHeight") },
    500
  );

  //run play_Queue function when first song is added i.e.autoplay
  if (queue_array.length == 1 && $("video").attr("src") == "") {
    play_Queue();
  }
}

function play_Queue() {
  // Guard clause: if queue_array is empty, display message and return
  if (queue_array.length == 0) {
    //refresh #video
    $("#video_title").load(" #video_title");

    $("#video_container").empty();
    //create a new media element in the video container
    $("#video_container").html(
      "<video id='video' src='' autoplay preload='auto'></video>"
    );

    //video dimensions scale to fit the container
    video_scaler();

    jquery_modal({
      message:
        "No more songs left in the queue. Click on the thumbnail to add a song in the queue.",
      title: "Queue is Empty",
    });
    return;
  }

  //get the video element
  var video = document.getElementById("video");
  //set the source of the video element
  video.src = queue_array[0];

  //mejs player
  mejs_media_Player(play_Queue);

  //append video title to div with id="video_title"
  var video_title = document.getElementById("video_title");
  //use text of class queue_name of first child of right block down
  video_title.innerHTML = $("#right-block-down")
    .children(":first")
    .children(".queue_name")
    .text();

  //remove first element/song from queue_array
  queue_array.shift();
  //console.log(queue_array);

  //remove the first queue_div from the right-block-down.
  var firstQueueItem = $(".queue_div").first();
  firstQueueItem.remove();
}
