//show or hide different search options
$(document).ready(function () {
  video_scaler();
  selectTextDisabled();
  searchCondition();
  autoShuffle();
  skipVideo();
  queue_scroll_top();
  volume_slider();
  volume_changer();
});

//call function closeNav() when click outside of class sidenav or id randomizer
$(document).click(function (e) {
  if (
    !$(e.target).closest(".sidenav").length &&
    !$(e.target).closest("#randomizer").length
  ) {
    closeNav();
  }
});

//function to scale down video to fit within video_container and pointer events to auto
function video_scaler() {
  $("video").css("width", $("#video_container").width());
  $("video").css("height", $("#video_container").height());
  $("video").css("pointer-events", "auto");
  $("video").attr("width", $("video").width());
  $("video").attr("height", $("video").height());

  //non-jQuery to apply for event generated video == $0
  document.getElementById("video").volume = $("#vol").html() / 100;
}

//disable select text on click in whole document
function selectTextDisabled() {
  $(document).on("selectstart", function (e) {
    e.preventDefault();
  });

  //disable image dragging
  $(document).on("dragstart", function (e) {
    e.preventDefault();
  });
}

//search options
function searchCondition() {
  $("#search_karaoke").hide();
  $("#select").selectmenu({
    change: function (event, data) {
      const isKaraoke = data.item.value == "karaoke";
      $("#search_karaoke").toggle(isKaraoke).focus();
      $("#search_all").toggle(!isKaraoke).focus();
    },
  });
}

//run the 80s shuffle function if no songs are playing
function autoShuffle() {
  var timeout = false;
  function checkActivity() {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      if ($("video").attr("src") == "" && queue_array.length == 0) {
        shuffleAjaxCall("shuffle_80", 2);
      }
    }, 1);
  }

  document.addEventListener("mousedown", checkActivity);
  document.addEventListener("mousemove", checkActivity);
  document.addEventListener("click", checkActivity);
  checkActivity();
}

//mejs player
function mejs_media_Player(func_restarter) {
  $("video").mediaelementplayer({
    iconSprite: "jquery-framework/images/mejs-controls.svg",
    success: function (mediaElement, DOMObject, player) {
      mediaElement.addEventListener("ended", function (e) {
        $("video").css("pointer-events", "auto");
        func_restarter();
      });

      //once the video starts, set the volume
      mediaElement.addEventListener("play", function (e) {
        document.getElementById("video").volume = $("#vol").html() / 100;
      });

      mediaElement.addEventListener("rendererready", function (e) {
        document.getElementById("video").volume = $("#vol").html() / 100;
      });

      mediaElement.addEventListener("loadedmetadata", function (e) {
        document.getElementById("video").volume = $("#vol").html() / 100;
      });

      //fullscreen the video afters 7s of inactivity if "video").attr("src") != ""
      //if not already fullscreen
      var timeout2 = false;
      function checkActivity2() {
        clearTimeout(timeout2);
        timeout2 = setTimeout(function () {
          //error handlers and conditions for fullscreen
          if (
            $("video").attr("src") != "" &&
            !player.isFullScreen &&
            !player.paused &&
            !player.error &&
            player.readyState == 4 &&
            //if a class called keyboard--hidden is present
            $(".keyboard--hidden").length
          ) {
            player.enterFullScreen();
            $("video").attr("width", $("video").width());
            $("video").attr("height", $("video").height());
            //console.log("video resized");
          }
        }, 7000);
      }

      document.addEventListener("mousedown", checkActivity2);
      document.addEventListener("mousemove", checkActivity2);
      document.addEventListener("click", checkActivity2);
      checkActivity2();

      //if player is fullscreen, exit fullscreen if user clicks on the video
      $("video").click(function () {
        if (player.isFullScreen) {
          player.exitFullScreen();
          $("video").attr("width", $("video").width());
          $("video").attr("height", $("video").height());
          //console.log("video resized");
        } else {
          //if player is paused, play the video
          if (player.paused) {
            player.play();
          }
        }
      });
    },

    error: function (e) {
      console.log("media element error:" + e);

      $("#video_container").empty();
      //create a new media element in the video container
      $("#video_container").html(
        "<video id='video' src='' autoplay preload='auto'></video>"
      );

      //video dimensions scale to fit the container
      video_scaler();

      //if queue_array is not empty, play_Queue()
      func_restarter();

      jquery_modal({
        message:
          "Error usually comes via YouTube's content restrictions. Skipping to next song.",
        title: "An Error was Detected",
      });
    },

    clickToPlayPause: false,
    features: [
      "playpause",
      "progress",
      "current",
      "duration",
      "volume",
      "fullscreen",
    ],
    enableKeyboard: false,
    useFakeFullscreen: true,
    enableAutosize: true,
  });
}

//function to move queue scrollbar to the top of the queue after 5 seconds of inactivity
function queue_scroll_top() {
  var timeout3 = false;
  function checkActivity3() {
    clearTimeout(timeout3);
    timeout3 = setTimeout(function () {
      $("#right-block-down").animate({ scrollTop: 0 }, 500);
    }, 10000);
  }

  document.addEventListener("mousedown", checkActivity3);
  document.addEventListener("mousemove", checkActivity3);
  document.addEventListener("click", checkActivity3);
  checkActivity3();
}

// create a jqueryUI slider to control volume for whole system
function volume_slider() {
  $("#slider").slider({
    animate: "fast",
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    slide: function (event, ui) {
      $("#vol").html(ui.value);
      document.getElementById("video").volume = ui.value / 100;

      //set color of slider to match volume
      if (ui.value == 0) {
        document.getElementById("video").muted = true;
        $("#mute").html("volume_off");
        $("#mute").css("color", "#7e0000");
        $("#slider").css("background-color", "#7e0000");
        $("#vol").css("color", "#7e0000");
      } else {
        document.getElementById("video").muted = false;
        $("#mute").html("volume_up");
        $("#mute").css("color", "#155d62");
        $("#slider").css("background-color", "white");
        $("#vol").css("color", "#033e30");
      }
    },
  });
}

function volume_changer() {
  // when clicked on id=vol_down, decrease slider value by 1 and set volume to that value
  $("#vol_down").click(function () {
    var vol = $("#vol").html();
    if (vol > 0) {
      vol--;
      $("#slider").slider("value", vol);
      document.getElementById("video").volume = vol / 100;
      $("#vol").html(vol);

      //make slider color #7e0000 if vol is 0 otherwise make it white
      if (vol == 0) {
        $("#slider").css("background-color", "#7e0000");
        $("#mute").html("volume_off");
        $("#mute").css("color", "#7e0000");
        document.getElementById("video").muted = true;
        $("#vol").css("color", "#7e0000");
      } else {
        $("#slider").css("background-color", "white");
        $("#mute").html("volume_up");
        $("#mute").css("color", "#155d62");
        document.getElementById("video").muted = false;
        $("#vol").css("color", "#033e30");
      }
    }
  });

  // when clicked on id=vol_up, increase slider value by 1 and set volume to that value
  $("#vol_up").click(function () {
    var vol = $("#vol").html();
    if (vol < 100) {
      vol++;
      $("#slider").slider("value", vol);
      document.getElementById("video").volume = vol / 100;
      $("#vol").html(vol);
    }

    //make slider color #7e0000 if vol is 0 otherwise make it white
    if (vol == 0) {
      $("#slider").css("background-color", "#7e0000");
      $("#mute").html("volume_off");
      $("#mute").css("color", "#7e0000");
      document.getElementById("video").muted = true;
      $("#vol").css("color", "#7e0000");
    }
    if (vol > 0) {
      $("#slider").css("background-color", "white");
      $("#mute").html("volume_up");
      $("#mute").css("color", "#155d62");
      document.getElementById("video").muted = false;
      $("#vol").css("color", "#033e30");
    }
  });

  // when clicked on id=mute, mute the video and change icon to volume_off
  $("#mute").click(function () {
    var vol = $("#vol").html();
    if (vol > 0) {
      $("#slider").slider("value", 0);
      document.getElementById("video").volume = 0;
      $("#vol").html(0);
      $("#slider").css("background-color", "#7e0000");
      $("#mute").html("volume_off");
      $("#mute").css("color", "#7e0000");
      document.getElementById("video").muted = true;
      $("#vol").css("color", "#7e0000");
    } else {
      jquery_modal({
        message:
          "Volume is already muted. Click on the slider to unmute. Use the + and - buttons for more precision.",
        title: "Volume Already Muted",
      });
    }
  });
}
