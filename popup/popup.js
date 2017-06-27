function listStylesheets(stylesheets) {
  document.getElementById("subtitle").innerHTML = "choose stylesheet:";
  document.getElementById("stylesheets-list").innerHTML = "";

  var stylesheetsCount = stylesheets.length;
  for (var i = 0; i < stylesheetsCount; i++) {
    var div = document.createElement("div");

    var href = stylesheets[i].href;
    var textnode = document.createTextNode(href.substring(href.lastIndexOf("/")+1).split("?")[0]);
    div.appendChild(textnode);

    div.className = "option";
    div.id = stylesheets[i].index;
    
    document.getElementById("stylesheets-list").appendChild(div);
  }
}

function showReport(partials) {
  document.getElementById("subtitle").innerHTML = "Report";
  document.getElementById("stylesheets-list").innerHTML = "\
    <table>\
      <thead>\
        <tr>\
          <th>No.</th>\
          <th>Partial Name</th>\
          <th>Unused Rules</th>\
        </tr>\
      </thead>\
      <tbody class='list' id='partials-list'>\
      </tbody>\
    </table>";

  for (var i = 0; i < partials.length; i++) {
    document.getElementById('partials-list').innerHTML += "\
      <tr>\
        <td>" + (i+1) +"</td>\
        <td>" + partials[i].name + "</td>\
        <td>" + partials[i].unused + " of " + partials[i].rules_length + "</td>\
      </tr>";
  }

  document.body.style.cursor = "";
}

function sendMessage(fn, data) {
  var data = (typeof data !== 'undefined') ?  data : "";
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {"fn": fn, "data": data});
  });
}

chrome.runtime.onMessage.addListener(function(request) {
  switch (request.fn) {
    case 'listStylesheets': listStylesheets(request.data); break;
    case 'showReport': showReport(request.data); break;
    default: alert('what?');
  }
});

sendMessage("getStylesheets");

document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("option")) return;

  var stylesheetId = e.target.id;
  document.body.style.cursor = "wait";

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {"fn": "auditStylesheet", data: stylesheetId});
  });
});

var options = {valueNames: ['name', 'unused']};
var stylesheetList = new List('stylesheets-list', options);