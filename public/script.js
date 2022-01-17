var step = 1;
var isOpened = false;
var refresh_delay = 1000;

function load_config() {
  $.get(window.location.href + "config", function(data) {
    // Set the title.
    $(".title-wrapper .left span").text(data.task_list_title + data.episode);
    // Set the title width.
    $(".title-wrapper .left").width(data.task_list_title_width);

    // Set up the item list.
    var $this = $("ul.task-list").empty();
    items = data.task_list_items;
    for (x in items) {
      var hideClass = items[x].show_in_list === false ? ' class="hidden" ' : '';
      $("<li "+hideClass+"/>").text(items[x].topic).appendTo($this);
    }
  });
}

function stepChanged(target){
  console.log('STEP CHANGED');
  target.addClass('visited');
}

function update_active_step() {
  $.get(window.location.href + "current", function(data) {
    console.log('DATA',data, isOpened,window.location.href + "current");
    // If the current step is changed, update list.
    if (Number(data) !== Number(step)) {
      $("ul.task-list li:nth-child(" + String(step) + ")").removeClass('active');
      stepChanged($("ul.task-list li:nth-child(" + String(step) + ")"));
      step = Number(data);
      $("ul.task-list li:nth-child(" + String(step) + ")").addClass('active');
    }
    else {
      $("ul.task-list li:nth-child(" + String(step) + ")").addClass('active');
    }
  });
 /* $.get(window.location.href + "isOpened", function(data) {
    console.log('isOpened',data);
    if(data !== isOpened){
      if(data === 'true'){
        $(".menu").removeClass('closed');
      }else{
        $(".menu").addClass('closed');
      }
    }
  });
  */
}

$(document).ready(function(e) {
  // Load configuration.
  load_config();

  // Set active step immediately, then update in loop.
  update_active_step();
  console.log(Number(step));
  $.get(window.location.href + "current",function(data){
    for(var i = 0; i < Number(data);i++){
      $("ul.task-list li:nth-child(" + i + ")").addClass('visited');
    }
  })
  
  var interval = setInterval(update_active_step, refresh_delay);
});
