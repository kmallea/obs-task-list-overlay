var step = 1;
var refresh_delay = 1000;

function load_config() {
  $.get(window.location.origin + "/config", function(data) {
    // Set the title.
    //$(".title-wrapper .left span").text(data.task_list_title + data.episode);
    // Set the title width.
   //$(".title-wrapper .left").width(data.task_list_title_width);

    // Set up the item list.
    var $this = $("ul.lower-thirds-list").empty();
    items = data.lower_thirds_items;
    console.log('ITEMS',items);
    for (x in items) {
      //var hideClass = items[x].show_in_list === false ? ' class="hidden" ' : '';
      var titleDiv = $("<div class=\"title\"/>").text(items[x].title);
      var subTitleDiv = $("<div class=\"sub-title\"/>").text(items[x].sub_title);
      var li = $("<li id=\"third-"+x+"\" class=\"hidden\" />");
      titleDiv.appendTo(li);
      subTitleDiv.appendTo(li);
      li.appendTo($this);
    }
  });
}

function update_active_step() {
  $.get(window.location.origin + "/config", function(data) {
    // If the current step is changed, update list.
    if (data !== step) {
      $("ul.task-list li:nth-child(" + String(step) + ")").removeClass('active').addClass('visited');
      step = Number(data);
      $("ul.task-list li:nth-child(" + String(step) + ")").addClass('active');
    }
    else {
      $("ul.task-list li:nth-child(" + String(step) + ")").addClass('active');
    }
  });
}

$(document).ready(function(e) {
  // Load configuration.
  load_config();

  // Set active step immediately, then update in loop.
  //update_active_step();
  //var interval = setInterval(update_active_step, refresh_delay);
});
