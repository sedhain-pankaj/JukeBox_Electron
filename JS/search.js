//ajax to get the search results for all and karaoke
$(function () {
  //Ajax to get the search_all results
  $("#search_all").click(function () {
    performSearch("search_all", "Karaoke", "All Songs (except Karaoke)");
  });

  //Ajax to get the search_karaoke results
  $("#search_karaoke").click(function () {
    performSearch("search_karaoke", null, "Only Karaoke", "Karaoke");
  });
});


function performSearch(searchId, excludeKey, searchMsg, searchKey = null) {
  var searchValue = $(`#${searchId}`).val();

  // Guard clause for empty input field
  if (searchValue == "") {
    $("#div_img_video_loader").html(
      `<h3>Search activated for ${searchMsg}.<br>` +
        "Fullscreen halts if Keyboard is active.</h3>"
    );
    return; // Exit function early
  }

  var filteredResults = [];

  //search on the cache for the searchValue except for the excludeKey category
  for (var key in cache) {
    if (searchKey && key !== searchKey) continue;
    if (!searchKey && key === excludeKey) continue;

    var parser = new DOMParser();
    var doc = parser.parseFromString(cache[key].response, "text/html");

    // Iterate over each table element and get the last td element
    doc.querySelectorAll("table").forEach(function (row) {
      // Get the text content of the last td element
      var lastCellText = row.querySelector("td:last-child").textContent;

      // Compare the last cell's text content in lowercase with the search value
      if (lastCellText.toLowerCase().includes(searchValue.toLowerCase())) {
        var regex = new RegExp(searchValue, "gi");
        var highlightedText = lastCellText.replace(
          regex,
          (match) => `<span style="background-color: #ffff99;">${match}</span>`
        );
        row.querySelector("td:last-child").innerHTML = highlightedText;
        filteredResults.push({
          response: row.outerHTML,
        });
      }
    });
  }

  // Guard clause for no results
  if (filteredResults.length === 0) {
    $("#div_img_video_loader").html(
      "<h3>No results found for your search <br>" +
        "'" +
        searchValue +
        "'. <br><br>" +
        "Try YouTube Search.</h3>"
    );
    return; // Exit function early
  }

  // Display the filtered results
  $("#div_img_video_loader").html(
    `<h3> ${searchMsg} Results for : ' ${searchValue} '</h3><br>` +
      `<div id='${searchId}_results'></div>`
  );

  filteredResults.forEach(function (result) {
    $(`#${searchId}_results`).append(result.response);
  });

  // replace the original index with the new <table> index
  $("#div_img_video_loader table").each(function (index) {
    $(this)
      .find("th#index")
      .text(index + 1);
  });
}
