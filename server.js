// Load the express module.
var express = require("express");
var app = express();
var path = require("path");
var step = 1;
var lowerStep = 1;
var isOpened = false;
var fs = require("fs");

// Load in the config.
let rawconfig = fs.readFileSync("config.json");
let config = JSON.parse(rawconfig);

const writeTopic = (content, currentNext) => {
  writePath = "currentSegment.txt";
  if (currentNext === "N") {
    writePath = "nextSegment.txt";
  }
  console.log(content, writePath);
  fs.writeFile(
    "/obs stream/assets/kharys crib/live-stream/headlines/" + writePath,
    content,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

const getTickerLabels = (config) => {
  const finalStringSeperator = "  •  ";
  let finalString = `Khary's Crib #Live!${finalStringSeperator}`;
  config.task_list_items.forEach((topic) => {
    console.log(topic.tickerLabel);
    if (topic.tickerLabel) {
      finalString = `${finalString}${topic.tickerLabel}${finalStringSeperator}`;
    }
  });
  finalString = `${finalString}Call in at 813-559-3339${finalStringSeperator}`;
  fs.writeFile(
    "/obs stream/assets/kharys crib/live-stream/headlines/ticker1.txt",
    finalString,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
  console.log("Ticker Written:", finalString);
};

// Set up the static asset directory.
app.use(express.static("public"));

// Respond to requests for / with index.html.
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "", "index.html"));
});

// Respond to requests for /current with current step.
app.get("/current", function (req, res) {
  res.send(String(step));
});

app.get("/isOpened", function (req, res) {
  res.send(String(isOpened));
});

// Respond to requests for /config with current config.
app.get("/config", function (req, res) {
  res.send(config);
});

app.get("/update", function (req, res) {
  rawconfig = fs.readFileSync("config.json");
  config = JSON.parse(rawconfig);
  res.send(config);
});

// Allow incrementing or decrementing the step via /up or /down.
app.get("/lower-thirds", function (req, res) {
  res.sendFile(path.join(__dirname, "", "lower-thirds.html"));
});

// Allow incrementing or decrementing the step via /up or /down.
app.get("/up", function (req, res) {
  if (step < config.task_list_items.length) {
    step++;
  }
  console.log("UP /");
  writeTopic(config.task_list_items[step - 1].topic, "C");
  console.log("UP NEXT", config.task_list_items[step].topic);
  if (typeof config.task_list_items[step] != "undefined") {
    if (config.task_list_items[step].show_in_list === true) {
      writeTopic("Up Next: " + config.task_list_items[step].topic, "N");
    } else {
      writeTopic("", "N");
    }
  } else {
    writeTopic("", "N");
  }

  res.send("New value: " + step);
});
app.get("/down", function (req, res) {
  if (step > 1) {
    step--;
  }
  writeTopic(config.task_list_items[step - 1].topic, "C");
  res.send("New value: " + step);
});

app.get("/open", function (req, res) {
  isOpened = true;
  res.send("New value: " + isOpened);
});

app.get("/close", function (req, res) {
  isOpened = false;
  res.send("New value: " + isOpened);
});

// Start listening on configured port.
app.listen(config.server_port);
console.log("Server listening on port " + config.server_port + ".");
getTickerLabels(config);
writeTopic(config.task_list_items[0].topic, "C");
