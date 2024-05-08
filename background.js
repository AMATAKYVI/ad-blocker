chrome.runtime.onInstalled.addListener(function() {
  console.log("Redirect Blocker installed.");
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!details || !details.url) {
      console.log("Error: Invalid request details");
      return;
    }

    // Get the domain of the current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTabUrl = tabs && tabs[0] ? tabs[0].url : null;
      const currentTabDomain = extractDomain(currentTabUrl);
      
      // Get the domain of the requested URL
      const requestedUrlDomain = extractDomain(details.url);
      
      // If the requested URL domain is different from the current tab domain, cancel the request
      if (requestedUrlDomain !== currentTabDomain) {
        console.log("Blocked redirect to:", details.url);
        return {cancel: true};
      }
    });
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!details || !details.type || !details.documentUrl) {
      console.log("Error: Invalid request details");
      return;
    }

    // Check if the request is from an element with zero opacity
    if (details.type === "sub_frame" && details.documentUrl) {
      chrome.tabs.executeScript(details.tabId, {
        code: `
          var element = document.elementFromPoint(${details.initiator ? details.initiator.frameId : 0}, ${details.originUrl ? 'event.clientX, event.clientY' : 0});
          if (element && element.tagName === "VIDEO" && element.style.opacity === "0") {
            console.log("Blocked redirect from hidden video element");
            return false;
          }
        `,
        frameId: details.frameId,
        runAt: "document_start"
      });
    }
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!details || !details.type || !details.documentUrl) {
      console.log("Error: Invalid request details");
      return;
    }

    // Check if the request is from a third-party source
    if (details.type === "sub_frame" && details.documentUrl) {
      chrome.tabs.executeScript(details.tabId, {
        code: `
          var element = document.elementFromPoint(${details.initiator ? details.initiator.frameId : 0}, ${details.originUrl ? 'event.clientX, event.clientY' : 0});
          if (element && !element.isSameNode(document.documentElement) && !element.isSameNode(document.body) && !element.isSameNode(document)) {
            var elementDomain = extractDomain(element.src);
            var currentTabDomain = "${details.documentUrl.replace(/[^/]*$/, '')}";
            if (elementDomain !== currentTabDomain) {
              console.log("Blocked third-party element:", element);
              element.style.display = "none";
            }
          }
        `,
        frameId: details.frameId,
        runAt: "document_start"
      });
    }
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!details || !details.type || !details.url) {
      console.log("Error: Invalid request details");
      return;
    }

    // Check if the request is a main frame navigation
    if (details.type === "main_frame" && details.url) {
      // Get the domain of the current tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTabUrl = tabs && tabs[0] ? tabs[0].url : null;
        const currentTabDomain = extractDomain(currentTabUrl);

        // Get the domain of the requested URL
        const requestedUrlDomain = extractDomain(details.url);

        // If the requested URL domain is different from the current tab domain, cancel the request
        if (requestedUrlDomain !== currentTabDomain) {
          console.log("Blocked automatic redirect to:", details.url);
          return {cancel: true};
        }
      });
    }
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);
// Listen for clicks
chrome.webNavigation.onCompleted.addListener(function(details) {
  chrome.tabs.executeScript(details.tabId, {
    code: `
      // Function to extract domain from URL
      function extractDomain(url) {
        if (!url) return null;
        let domain;
        // Find & remove protocol (http, https) and get domain
        if (url.indexOf("://") > -1) {
          domain = url.split('/')[2];
        } else {
          domain = url.split('/')[0];
        }
        // Find & remove www
        if (domain.indexOf("www.") > -1) {
          domain = domain.split('www.')[1];
        }
        return domain;
      }

      // Function to handle potential redirects
      function handleRedirects(event) {
        // Get the domain of the original page
        var originalDomain = extractDomain("${details.url}");

        // Get the domain of the clicked link
        var linkDomain = extractDomain(event.target.href || event.target.baseURI);

        // Check if the clicked link leads to a different domain
        if (linkDomain !== originalDomain) {
          console.log("Blocked click leading to a different domain:", linkDomain);
          // Prevent the default action of the click event
          event.preventDefault();
        }
      }

      // Listen for clicks on the document
      document.addEventListener("click", handleRedirects);
    `,
    runAt: "document_start"
  });
});

// Function to remove the specific <a> tag
function removeSpecificLink() {
  var specificLink = document.querySelector('a.poster.tooltipstered');
  if (specificLink) {
    specificLink.remove();
    console.log("Removed specific link.");
  }
}

// Mutation observer to continuously monitor changes in the DOM
var observer = new MutationObserver(function(mutationsList, observer) {
  for(var mutation of mutationsList) {
    if (mutation.type === 'childList') {
      removeSpecificLink();
    }
  }
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial removal of the specific link
removeSpecificLink();


// Function to remove the specific <section> element
function removeSpecificSection() {
  var specificSection = document.querySelector('section.adx');
  if (specificSection) {
    specificSection.remove();
    console.log("Removed specific section.");
  }
}

// Mutation observer to continuously monitor changes in the DOM
var observer = new MutationObserver(function(mutationsList, observer) {
  for(var mutation of mutationsList) {
    if (mutation.type === 'childList') {
      removeSpecificSection();
    }
  }
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial removal of the specific section
removeSpecificSection();





// Function to extract domain from URL
function extractDomain(url) {
  if (!url) return null;
  
  let domain;
  // Find & remove protocol (http, https) and get domain
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  // Find & remove www
  if (domain.indexOf("www.") > -1) {
    domain = domain.split('www.')[1];
  }
  return domain;
}

// Disable console.log
// Function to inject a script into the page
function injectScript(scriptContent) {
  const script = document.createElement('script');
  script.textContent = scriptContent;
  document.documentElement.appendChild(script);
  script.remove(); // Clean up after script execution
}

// Override console.log with an empty function
injectScript(`
  console.log = function() {};
`);


chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes("/console-api/")) {
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
); // due to the limitation we can not block from server side page
