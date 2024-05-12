chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.msg === 'image') {
    fetch('https://some-random-api.ml/img/pikachu')
      .then((response) => response.text())
      .then((data) => {
        let dataObj = JSON.parse(data);
        senderResponse({ data: dataObj, index: message.index });
      })
      .catch((error) => console.log('error', error));
    return true; // Will respond asynchronously.
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!details || !details.url) {
      // console.log("Error: Invalid request details");
      return;
    }

    // Get the domain of the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabUrl = tabs && tabs[0] ? tabs[0].url : null;
      const currentTabDomain = extractDomain(currentTabUrl);

      // Get the domain of the requested URL
      const requestedUrlDomain = extractDomain(details.url);

      // If the requested URL domain is different from the current tab domain, cancel the request
      if (requestedUrlDomain !== currentTabDomain) {
        console.log('Blocked redirect to:', details.url);
        return { cancel: true };
      }
    });
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!details || !details.type || !details.documentUrl) {
      return;
    }

    // Check if the request is from an element with zero opacity
    if (details.type === 'sub_frame' && details.documentUrl) {
      chrome.tabs.executeScript(details.tabId, {
        code: `
          var element = document.elementFromPoint(${
            details.initiator ? details.initiator.frameId : 0
          }, ${details.originUrl ? 'event.clientX, event.clientY' : 0});
          if (element && element.tagName === "VIDEO" && element.style.opacity === "0") {
            console.log("Blocked redirect from hidden video element");
            return false;
          }
        `,
        frameId: details.frameId,
        runAt: 'document_start',
      });
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!details || !details.type || !details.documentUrl) {
      return;
    }

    // Check if the request is from a third-party source
    if (details.type === 'sub_frame' && details.documentUrl) {
      chrome.tabs.executeScript(details.tabId, {
        code: `
          var element = document.elementFromPoint(${
            details.initiator ? details.initiator.frameId : 0
          }, ${details.originUrl ? 'event.clientX, event.clientY' : 0});
          if (element && !element.isSameNode(document.documentElement) && !element.isSameNode(document.body) && !element.isSameNode(document)) {
            var elementDomain = extractDomain(element.src);
            var currentTabDomain = "${details.documentUrl.replace(
              /[^/]*$/,
              ''
            )}";
            if (elementDomain !== currentTabDomain) {
              console.log("Blocked third-party element:", element);
              element.style.display = "none";
            }
          }
        `,
        frameId: details.frameId,
        runAt: 'document_start',
      });
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!details || !details.type || !details.url) {
      return;
    }

    // Check if the request is a main frame navigation
    if (details.type === 'main_frame' && details.url) {
      // Get the domain of the current tab
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTabUrl = tabs && tabs[0] ? tabs[0].url : null;
        const currentTabDomain = extractDomain(currentTabUrl);

        // Get the domain of the requested URL
        const requestedUrlDomain = extractDomain(details.url);

        // If the requested URL domain is different from the current tab domain, cancel the request
        if (requestedUrlDomain !== currentTabDomain) {
          console.log('Blocked automatic redirect to:', details.url);
          return { cancel: true };
        }
      });
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.includes('/console-api/')) {
      return { cancel: true };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
); // due to the limitation we can not block from server side page

// Function to extract domain from URL
function extractDomain(url) {
  if (!url) return null;

  let domain;
  // Find & remove protocol (http, https) and get domain
  if (url.indexOf('://') > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  // Find & remove www
  if (domain.indexOf('www.') > -1) {
    domain = domain.split('www.')[1];
  }
  return domain;
}

// handling the links
chrome.webRequest.onBeforeRequest.addListener(function (details) {
  var removeAllATagWithBlank = document.querySelectorAll('a[target="_blank"]');
  if (removeAllATagWithBlank) {
    removeAllATagWithBlank.forEach(function (atag) {
      console.log(atag);
    });
  }
});
chrome.webRequest.onBeforeRequest.addListener(function (details) {
  var element = document.querySelectorAll('a[target*="_blank"]');
  console.log(element);
  if (element) {
    element.forEach(function (atag) {
      console.log(atag);
    });
  }
});
//remove some images with width 300
chrome.webRequest.onBeforeRequest.addListener(function (details) {
  var element = document.querySelectorAll('img[width="300"]');
  if (element) {
    element.forEach(function (img) {
      img.remove();
      console.log('Removed element with width 300');
    });
  }
});

// Block all
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log('I am going to block:', details.url);
    return { cancel: true };
  },
  { urls: blocked_sites_v2 },
  ['blocking']
);
