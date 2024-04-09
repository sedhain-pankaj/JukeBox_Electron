//array to hold the shuffled songs
var shuffleArrays = {
  shuffle_5060: [],
  shuffle_70: [],
  shuffle_80: [],
  shuffle_90: [],
  shuffle_2000: [],
  shuffle_LatestHits: [],
  shuffle_Country: [],
  shuffle_SpecialOccasion: [],
  shuffle_ChristmasSong: [],
};

//array holds message to show shuffle is on for the directory
const dir_msg_collection = [
  "(50's & 60's Shuffle): ",
  "(70's Shuffle): ",
  "(80's Shuffle): ",
  "(90's Shuffle): ",
  "(2000's Shuffle): ",
  "(Latest Hits Shuffle): ",
  "(Country Shuffle): ",
  "(Special Occasion Shuffle): ",
  "(Christmas Song Shuffle): ",
];

//logic to get the shuffled songs
function shuffleAjaxCall(key, index) {
  // remove "shuffle_" from the key to get the id
  var id = key.replace("shuffle_", "");

  var intervalId = setInterval(function () {
    //check if the cache exists
    if (cache) {
      clearInterval(intervalId); // stop retrying once the cache is found

      //find a <section> tag with the same ID as the key
      var section = cache.match(
        new RegExp('<section id="' + id + '">.*?</section>', "s")
      );

      //if the section exists, render the songs
      if (section) {
        // find all <table> tags within the section
        var tables = section[0].match(/<table[^>]*>.*?<\/table>/gs);

        // find all the links to the directories within the tables
        var dirLinks = tables.map(function (table) {
          var match = table.match(
            /onclick="javascript:queue_array_create\('.*?', '.*?', '(.*?)'\)"/
          );
          return match ? match[1] : null;
        });

        if (dirLinks) {
          // shuffle the tables
          dirLinks.sort(function () {
            return 0.5 - Math.random();
          });
        }

        show_shuffle_msg(dirLinks, dir_msg_collection[index]);
      }
    }
  }, 100); // retry every 100ms
}

//call the ajax function on click of the randomizer buttons
$(function () {
  Object.keys(shuffleArrays).forEach(function (key, index) {
    $("#" + key).click(function () {
      shuffleAjaxCall(key, index);
    });
  });
});

function shuffler(array, dir_msg) {
  if (array.length == 0) {
    // Refresh #video
    $("#video_title").load(" #video_title");
    $("#video_container").empty();
    // Create a new media element in the video container
    $("#video_container").html(
      "<video id='video' src='' autoplay preload='auto'></video>"
    );
    // Video dimensions scale to fit the container
    video_scaler();

    //Jquery modal to show user that the 80's shuffle auto-started
    jquery_modal({
      message:
        "80's Shuffle triggers automatically when queued song or previous randomizer ends.",
      title: "80's Shuffle Started",
      closeTime: 5000,
    });

    //a random click on DOM element to trigger autoshuffle => checkActivity()
    //triggers 80s shuffle when previous shuffle ends
    $("#queue_header").click();
  } else {
    closeNav();

    //destroy mejs if title doesnt contains dir_msg_collection
    if (
      !dir_msg_collection.some((item) =>
        $("#video_title").text().includes(item)
      ) &&
      !$("#video_title").text().includes("Video Title")
    ) {
      $("#video_container").empty();
      //create a new media element in the video container
      $("#video_container").html(
        "<video id='video' src='' autoplay preload='auto'></video>"
      );
      //video dimensions scale to fit the container
      video_scaler();

      //alerts queue finished and going back to shuffle
      jquery_modal({
        message:
          "Queued songs have finished. The last played randomizer will resume.",
        title: "Resuming Previous Randomizer",
        closeTime: 5000,
      });
    }

    //if queue_array is not empty, play_Queue()
    function relooper_shuffle() {
      if (queue_array.length > 0) {
        play_Queue();
      } else {
        shuffler(array, dir_msg);
      }
    }

    //get the video element
    var video = document.getElementById("video");
    //set the source of the video element
    video.src = array[0];

    //mejs player
    mejs_media_Player(relooper_shuffle);

    //append video title to div with id="video_title"
    var video_title = document.getElementById("video_title");
    video_title.innerHTML = array[0].split("/").pop();
    video_title.innerHTML = video_title.innerHTML.slice(0, -4);
    video_title.innerHTML = dir_msg + video_title.innerHTML;

    //remove first element from array
    array.shift();
  }
}

function show_shuffle_msg(array, dir_msg) {
  if (
    $("video").attr("src") != "" &&
    dir_msg_collection.some((item) => $("#video_title").text().includes(item))
  ) {
    jquery_modal({
      message:
        "A previous randomizer was detected. Do you wish to overwrite it?",
      title: "Overwrite Previous Randomizer !!!",
      dialogClass: "show-closer",
      buttonText: "Overwrite",
      buttonAction: function () {
        $("#video_container").empty();
        $("#video_container").html(
          "<video id='video' src='' autoplay preload='auto'></video>"
        );
        video_scaler();
        shuffler(array, dir_msg);
      },
      closeTime: 30000,
    });
  } else {
    if (
      $("video").attr("src") != "" &&
      !dir_msg_collection.some((item) =>
        $("#video_title").text().includes(item)
      )
    ) {
      jquery_modal({
        message:
          "Queue gets priority over Randomizer. Wait for queued song to finish completely.",
        title: "Finish Queued Song First",
        buttonText: "Ok. I'll wait",
        closeTime: 15000,
      });
    } else {
      shuffler(array, dir_msg);
    }
  }
}
