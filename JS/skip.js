//skip song function
function skipVideo() {
  document.getElementById("skip_button").addEventListener("click", function () {
    let videoSrc = $("video").attr("src");
    let videoTitle = $("#video_title").text();

    // check if something is playing
    if (videoSrc == "") {
      jquery_modal({
        message:
          "Nothing is playing right now. Unable to skip. Restart the player.",
        title: "No Video Playing (ERROR)",
      });
      return;
    }

    // check if the video is not from a shuffle
    if (!dir_msg_collection.some((item) => videoTitle.includes(item))) {
      if (queue_array.length == 0) {
        jquery_modal({
          message:
            "No songs present in queued section. Last randomizer will resume if you skip.",
          title: "Queue is Empty",
          dialogClass: "show-closer",
          buttonText: "Force Skip",
          buttonAction: skipRandomizer,
        });
      } else {
        jquery_modal({
          message:
            "This skips the current song and plays the next song in the queue.",
          title: "Skip the Queue",
          buttonText: "Skip",
          dialogClass: "show-closer",
          buttonAction: function () {
            play_Queue();
          },
        });
      }
      return;
    }

    // skip the current video to next shuffle or queue
    jquery_modal({
      message:
        "This skips the playing song. Next song will be from the " +
        (queue_array.length == 0 ? "current randomizer." : "queue."),
      title: "Skip the Randomizer",
      dialogClass: "show-closer",
      buttonText: "Skip",
      buttonAction: skipRandomizer,
    });
  });
}

//skip randomizer by video end event
function skipRandomizer() {
  var video = document.getElementById("video");
  video.pause();
  var event = new Event("ended");
  video.dispatchEvent(event);
}
