function search_youtube() {
  //create a input field for user to enter search query
  $("#div_img_video_loader").html(
    //create an input field with class="use-keyboard-input"
    "<input type='text' id='search_query' placeholder='Search YouTube' autocomplete='off'>" +
      "<button id='search_button'> &#9658; </button>" +
      "<h3>Interaction is restricted  for YouTube contents.<br><br>" +
      "API Keys provided by Google LLC. <br>" +
      "Copyright&copy; belongs to YouTube. <br><br>" +
      "<button class='button-left' id='speedtest' onclick='internet_speed()'> Perform SpeedTest </button>" +
      "<p id='internet_speed' style='font-size:clamp(1vw, 1.2vw, 2vw);'></p></h3>"
  );
}

//function to load youtube video
const load_youtube = () => {
  const search_query = $("#search_query").val();
  const search_query_url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search_query}&type=video&maxResults=10&key=${YT_API_Key}`;

  $.ajax({
    url: search_query_url,
    method: "GET",
    dataType: "json",
    success: (data) => {
      $("#div_img_video_loader").html(
        `<h3>
          Top 10 YouTube Results for : ' ${search_query} '
        </h3><br>
        <div id='search_results'></div>`
      );

      data.items.forEach((item, i) => {
        const search_result = `
          <table class='search_result_table'> 
            <th id='index'>${i + 1}.</th>
            <th class='search_result_img'>
              <img src='${item.snippet.thumbnails.default.url}'>
            </th>
            <td class='yt_video_title'>${item.snippet.title}</td>
            <td class='yt_video_id' style='display:none;'>${
              item.id.videoId
            }</td>
          </table>`;

        $("#search_results").append(search_result);
      });

      loadYoutubeIframeAPI();

      $(".search_result_table").click(handleSearchResultClick);
    },
    error: (error) => {
      console.log(error);
      $("#div_img_video_loader").html(`<h3>Error: ${error.statusText}</h3>`);
    },
  });
};

const loadYoutubeIframeAPI = () => {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

const handleSearchResultClick = function () {
  const yt_dir = `https://www.youtube.com/embed/${$(this)
    .find(".yt_video_id")
    .text()}`;

  if (queue_array.includes(yt_dir)) {
    jquery_modal({
      message:
        "This song exists already in queue. Once it is played from the queue, it can be added again.",
      title: "Song Already Queued",
    });
    return;
  }

  if (video.src.includes($(this).find(".yt_video_id").text())) {
    jquery_modal({
      message:
        "This song is being played currently. Once it ends completely, it can be re-added to queue.",
      title: "Song Being Played Currently",
    });
    return;
  }

  queue_array.push(yt_dir);

  $("#right-block-down").append(
    `<div class='queue_div'>
      <button class='queue_remove_button' onclick='queue_array_remove(this, "${yt_dir}")'>Remove <i class='material-icons' id='backspace'>backspace</i></button>
      <img src='${$(this).find(".search_result_img img").attr("src")}'>
      <li class='queue_name'>(YouTube) : ${$(this)
        .find(".yt_video_title")
        .text()}</li>
    </div>`
  );

  $("#right-block-down").animate(
    { scrollTop: $("#right-block-down").prop("scrollHeight") },
    500
  );

  if (queue_array.length === 1 && $("video").attr("src") === "") {
    play_Queue();
  }
};

function internet_speed() {
  //add a spinning icon to id="internet_speed"
  $("#internet_speed").html(
    "Wait <br> <i class='material-icons' style='font-size:clamp(1vw, 4vw, 5vw);'>network_check</i>"
  );

  var imageAddr = "https://hackthestuff.com/images/test.jpg";
  var downloadSize = 13055440;
  window.setTimeout(MeasureConnectionSpeed, 0);

  function MeasureConnectionSpeed() {
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
      endTime = new Date().getTime();
      showResults();
    };
    download.onerror = function (err) {
      console.log(err);
      $("#internet_speed").html("Error: " + err.statusText);
    };
    startTime = new Date().getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    function showResults() {
      var duration = (endTime - startTime) / 1000;
      var bitsLoaded = downloadSize * 8;
      var speedBps = (bitsLoaded / duration).toFixed(2);
      var speedKbps = (speedBps / 1024).toFixed(2);
      var speedMbps = (speedKbps / 1024).toFixed(2);

      let speed = speedBps + " bps (may not be accurate)";
      if (speedKbps > 1) {
        speed = speedKbps + " Kbps (may not be accurate)";
      }
      if (speedMbps > 1) {
        speed = speedMbps + " Mbps (may not be accurate)";
      }

      $("#internet_speed").html(
        "<i class='material-icons' style='font-size:clamp(1vw, 4vw, 5vw);'>verified</i> <br>" +
          speed
      );
    }
  }
}
