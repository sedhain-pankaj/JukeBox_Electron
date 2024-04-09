//skip song function
function skipVideo() {
  document.getElementById("skip_button").addEventListener("click", function () {
    if (
      $("video").attr("src") != "" &&
      dir_msg_collection.some((item) => $("#video_title").text().includes(item))
    ) {
      jquery_modal({
        message:
          "This skips the playing song. Next song will be from the " +
          (queue_array.length == 0 ? "current randomizer." : "queue."),
        title: "Skip the Randomizer",
        dialogClass: "show-closer",
        buttonText: "Skip",
        buttonAction: skipRandomizer,
      });
    } else {
      if ($("video").attr("src") == "") {
        jquery_modal({
          message:
            "Nothing is playing right now. Unable to skip. Restart the player.",
          title: "No Video Playing (ERROR)",
        });
      } else {
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
      }
    }
  });
}

function skipRandomizer() {
  //set current time of video to value of class="mejs__duration" event
  var current_time = $(".mejs__duration").text();

  //convert current time MM:SS to seconds
  current_time =
    parseInt(current_time.substring(0, current_time.indexOf(":"))) * 60 +
    parseInt(current_time.substring(current_time.indexOf(":") + 1));

  $("video")[0].currentTime = current_time;
  $("video")[0].play();
}
