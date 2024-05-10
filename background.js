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
    runAt: "document_idle" // Change this line
  });
});



chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Check if the request is for an HTML page
    if (details.type === "main_frame" && details.url.startsWith("http")) {
      // Fetch the HTML content of the page
      fetch(details.url)
        .then(response => response.text())
        .then(html => {
          // Create a DOM element from the fetched HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // Remove the specific <a> tag
          const specificLink = doc.querySelector('a.poster.tooltipstered');
          if (specificLink) {
            specificLink.remove();
            console.log("Removed specific link.");
          }

          // Serialize the modified HTML back to string
          const modifiedHtml = new XMLSerializer().serializeToString(doc);

          // Return the modified HTML as a response to the request
          return { redirectUrl: "data:text/html;base64," + btoa(modifiedHtml) };
        })
        .catch(error => {
          console.error("Error fetching or modifying HTML:", error);
        });
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);


chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes("/console-api/")) {
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
); // due to the limitation we can not block from server side page


// Function to block ads and unwanted scripts
function blockAds(details) {
  // List of domains to allow
  const allowedDomains = ['asianc.to'];

  // Extract the domain from the request URL
  const url = new URL(details.url);
  const domain = url.hostname;

  // Check if the domain is allowed
  if (!allowedDomains.includes(domain)) {
    return { cancel: true };
  }

  // Block specific scripts by URL
  if (details.url.includes('//platform.bidgear.com/ads.php') || 
      details.url.includes('https://www.googletagmanager.com/gtag/js') ||
      details.url.includes('https://pladrac.net/js/common.min.js') ||
      details.url.includes('https://www.google.com/recaptcha/api2/bframe')) {
    return { cancel: true };
  }

  // Allow the request
  return { cancel: false };
}
chrome.webRequest.onBeforeRequest.addListener(
  blockAds,
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Function to block redirects to domains other than asianc.to
function blockRedirects(details) {
  // Get the original URL before redirect
  const originalUrl = new URL(details.url);
  // Get the redirect URL
  const redirectUrl = new URL(details.redirectUrl);
  // Check if the redirect is to a domain other than asianc.to
  if (redirectUrl.hostname !== 'asianc.to') {
    // Block the redirect
    return { cancel: true };
  }
  // Allow the redirect
  return { cancel: false };
}

// Add listener to block redirects to other domains
chrome.webRequest.onBeforeRedirect.addListener(
  blockRedirects,
  { urls: ["<all_urls>"] },
  ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
      if (details.type === 'main_frame' && details.url.startsWith('http') || !details.url.startsWith('https://asianc.to')|| !details.url.startsWith('https://animesuge.to')) {
          // Block the request if it's an HTTP redirect
          return {cancel: true};
      }
  },
  {urls: ['<all_urls>']},
  ['blocking']
);

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

// Block all
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
      console.log("I am going to block:", details.url)
      return {cancel: true}
  },
  {urls: blocked_sites_v2},
  ["blocking"]
)