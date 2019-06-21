(function() {
  'use strict';

  var app = {
    feedUrl: '',
    feedList: [[], []],
  };

  document.getElementById('reloadButton').addEventListener('click', function() {
    app.reloadFeed(app.feedUrl);
  });

  document.getElementById('selectButton').addEventListener('click', function() {
    document.getElementById('urlDialog').style.display = "block";
  });

  document.getElementById('closeDialog').addEventListener('click', function() {
    document.getElementById('urlDialog').style.display = "none";
  });
  
  document.getElementById('urlButton').addEventListener('click', function() {
    document.getElementById('urlDialog').style.display = "none";
    app.feedUrl = document.getElementById('urlInput').value;
    app.reloadFeed(app.feedUrl);
  });

  document.getElementById('feedSelect').addEventListener('change', function() {
    document.getElementById('urlInput').value = document.getElementById('feedSelect').value;
  });

  app.reloadFeed = function(url) {
    let qURL = 'https://query.yahooapis.com/v1/public/yql?format=json&q=select * from xml where url="' + url + '"';
    if ('caches' in window) {
      caches.match(qURL).then(function(response) {
        if (response) {
          response.json().then(function reloadFromCache(json) {
            var results = json.query.results;
            console.log('loaded from cache: ', results);
            app.updateFeedDisplay(url, results);
          });
        }
      });
    }
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.query.results;
          console.log('loaded from net: ', results);
          app.updateFeedDisplay(url, results);
        }
      }
    }
    request.open('GET', qURL);
    request.send();
  }

  app.updateFeedDisplay = function(url, results) {
    if (results.RDF) {
      results = results.RDF;
    } else if (results.rss) {
      results = results.rss;
    }
    let tLink = results.channel.link;
    if (typeof tLink !== 'string') {
      tLink = tLink[0];
    }
    let rawHtml = '<a href="' + tLink + '" target="_blank"><h1>' + results.channel.title + '</h1></a><hr>';
    document.getElementById('content').innerHTML = rawHtml;
    app.updateFeedList(url, results.channel.title);
    var items = results.item;
    if (!items && results.channel.item) {
      items = results.channel.item;
    }
    items.map(function(item) {
      let rawHtml = '<a href="' + item.link + '" target="_blank"><h3>' + item.title + '</h3></a>';
      if (item.description) {
        let desc = document.createElement('html');
        desc.innerHTML = item.description;
        let pText = desc.getElementsByTagName('p')[0];
        if (pText) {
          rawHtml += '<p>' + pText.innerText + '</p>';
        } else {
          rawHtml += '<p>' + item.description + '</p>';
        }
      }
      if (item.date) {
        rawHtml += '<p>(' + new Date(item.date).toLocaleString() + ')</p><hr>';
      } else if (item.pubDate) {
        rawHtml += '<p>(' + new Date(item.pubDate).toLocaleString() + ')</p><hr>';
      }
      document.getElementById('content').innerHTML += rawHtml;
    })
  }

  app.updateFeedList = function(url, title) {
    if (app.feedList[0].indexOf(url) === -1) {
      app.feedList[0].push(url);
      app.feedList[1].push(title);
      app.saveFeedList();
      app.rebuildFeedMenu();
    }
    document.getElementById('feedSelect').value = url;
  }

  app.saveFeedList = function() {
    var feedList = JSON.stringify(app.feedList);
    localStorage.feedList = feedList;
  };

  app.rebuildFeedMenu = function() {
    let rawHtml = '';
    for (let i in app.feedList[0]) {
      rawHtml += '<option value="' + app.feedList[0][i] + '">' + app.feedList[1][i] + '</option>';
    }
    document.getElementById('feedSelect').innerHTML = rawHtml;
  }

  app.feedList = localStorage.feedList;
  if (app.feedList) {
    app.feedList = JSON.parse(app.feedList);
    app.reloadFeed(app.feedList[0][0]);
    app.rebuildFeedMenu();
  } else {
    app.feedList = [[], []];
    app.feedUrl = 'http://cloud.watch.impress.co.jp/cda/rss/cloud.rdf'
    app.reloadFeed(app.feedUrl);
    app.saveFeedList();
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./serviceworker.js')
             .then(function() {
                console.log('Service Worker Registered');
                navigator.serviceWorker.getRegistration().then(function(reg) {
                  console.log('Displaying the first Notification...');
                  reg.showNotification('The First Notification!').then(function(event) {
                    console.log(event)
                  }, function(error) {
                    console.log(error);
                  });
                }, function(error) {
                  console.log(error);
                });
             });
  }

  Notification.requestPermission(function(status) {
    console.log('Notification permission requested:', status);
  });
  
  function displayNotification() {
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        console.log('Displaying a Notification by request...');
        reg.showNotification('通知が届きました！');
      });
    }
  }
})();
