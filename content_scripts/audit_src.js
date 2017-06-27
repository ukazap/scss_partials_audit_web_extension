var reworkcss = require('css');

function getStylesheets() {
  var stylesheets = [];
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href !== null) {
      stylesheets.push({'index': i, 'href': document.styleSheets[i].href});
    }
  }
  sendMessage('listStylesheets', stylesheets);
}

function auditStylesheet(index) {
  var url = document.styleSheets[index].href;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var cssSource = request.responseText;
      var lines = cssSource.match(/^.*([\n\r]+|$)/gm);
      var partials = [{"name": "", "content": ""}];
      var partialNames = [];
      
      var currentPartialName = "";
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        alert(line);
        if (line.indexOf("/* line") === 0 && line.indexOf(" */") > 0) {
          currentPartialName = line.match(/(?!.+\,)(?=\/).+(?=\s\*\/)/)[0];
          if (partialNames.indexOf(currentPartialName) == -1) {
            partialNames.push(currentPartialName);
            partials.push({"name": currentPartialName, "content": ""});
          }
        } else {
          line += "\n";
          partials[partialNames.indexOf(currentPartialName)].content += line;
        }
      }

      for (var i = 0; i < partials.length; i++) {
        var partial = partials[i];
        // sheet = reworkcss.parse(partial.content);
      }
    } else {
      // We reached our target server, but it returned an error
      alert('We reached our target server, but it returned an error');
    }
  };
  request.onerror = function () {
    alert('There was a connection error of some sort');
  };
  request.send();
  // sendMessage('showReport', document.styleSheets[index].href);
}

function sendMessage(fn, data) {
  data = (typeof data !== 'undefined') ? data : '';
  chrome.runtime.sendMessage({'fn': fn, 'data': data});
}

chrome.runtime.onMessage.addListener(function (request) {
  switch (request.fn) {
    case 'getStylesheets': getStylesheets(); break;
    case 'auditStylesheet': auditStylesheet(request.data); break;
    default: alert('what?');
  }
});