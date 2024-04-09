// remove songs from queue and from queue_array
function queue_array_remove(element, dir) {
  jquery_modal({
    message: "This removes selected song from queue. Do you want to proceed?",
    title: "Delete Song from Queue",
    dialogClass: "show-closer",
    closeTime: 30000,
    buttonId: "delete_song_button",
    buttonIcon: "ui-icon-closethick",
    buttonText: "Remove Song",
    buttonColor: "#fd5c63",
    buttonAction: function () {
      var queue_array_index = queue_array.indexOf(dir);
      queue_array.splice(queue_array_index, 1);
      $(element).parent().remove();
    },
  });
}

function clear_Queue() {
  // Guard clause: checks if queue_array is empty, display message and return
  if (queue_array.length == 0) {
    jquery_modal({
      message:
        "The queue is already empty. Songs can also be removed individually from the queue.",
      title: "Queue Already Empty",
    });
    return;
  }

  // If it passes the guard clause means queue_array is not empty
  jquery_modal({
    message:
      "<input placeholder='Enter Password To Continue' id='clear_queue_input' autocomplete='off'>",
    title: "Clear the Queue. CAUTION !!!",
    dialogClass: "show-closer",
    closeTime: 45000,
    buttonId: "clear_queue_button",
    buttonIcon: "ui-icon-trash",
    buttonText: "Clear Queue",
    buttonColor: "#fd5c63",
    buttonAction: clearQueueAction,
    closeOnClick: false,
  });
}

function clearQueueAction() {
  var password = $("#clear_queue_input").val();

  // Guard clause: if password is incorrect, display message and return
  if (password !== "craig") {
    $("#clear_queue_input").css("background-color", "red");
    $("#clear_queue_input").effect("shake", {
      direction: "left",
      distance: 20,
      times: 3,
    });
    setTimeout(function () {
      $("#clear_queue_input").css("background-color", "white");
    }, 1000);
    $("#clear_queue_input").val("");
    $("#clear_queue_input").attr(
      "placeholder",
      "Wrong Password Entered. Click to try again."
    );
    return;
  }

  // if it passes the guard clause, clear the old modal and its timer
  clearInterval(countdownInterval);
  $("#dialog-confirm").dialog("close");

  // splices the queue_array and refreshes #right-block-down div
  $("#right-block-down").html("");
  queue_array.splice(0, queue_array.length);

  // display msg with jquery_modal.
  // 0.5 sec delay to avoid cleared pswd timer affecting this modal
  setTimeout(function () {
    jquery_modal({
      message:
        "The queue was cleared succcessfully. Click on thumbnails to repopulate it.",
      title: "Queue Cleared Successfully",
    });
  }, 500);
}
