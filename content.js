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



  document.addEventListener("DOMContentLoaded", function() {
    // Find all <a> tags with the class "poster" and "tooltipstered"
    var specificLinks = document.querySelectorAll('a.poster.tooltipstered');
    // Loop through each specific link and add a click event listener
    specificLinks.forEach(function(link) {
      link.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Link click intercepted, redirect prevented.");
      });
    });
  });
  
  
  document.addEventListener("DOMContentLoaded", function() {
    // Find the video element
    var video = document.querySelector('video.jw-video');
  
    // Find the masking div
    var maskingDiv = document.getElementById('dontfoid');
  
    // Function to handle click events on the masking div
    function handleMaskingDivClick(event) {
      event.preventDefault(); // Prevent the default action of the click event
      console.log("Click intercepted on masking div, redirect prevented.");
      // Optionally, you can remove the masking div
      this.remove(); // Remove the masking div
    }
  
    // Mutation observer to continuously monitor changes in the DOM
    var observer = new MutationObserver(function(mutationsList, observer) {
      mutationsList.forEach(function(mutation) {
        // Check if nodes were added to the masking div
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Loop through added nodes
          mutation.addedNodes.forEach(function(node) {
            // Check if the added node is a hidden element or link
            if (node.nodeType === Node.ELEMENT_NODE && node === maskingDiv) {
              // Add a click event listener to the masking div
              node.addEventListener("click", handleMaskingDivClick);
            }
          });
        }
      });
    });
  
    // Start observing the masking div for changes
    observer.observe(maskingDiv, { childList: true, subtree: true });
  
    // Function to remove the observer when necessary (e.g., if the video is removed from the DOM)
    function stopObserving() {
      observer.disconnect();
    }
  
    // Optionally, you can stop observing after a certain period (e.g., 10 seconds)
    setTimeout(stopObserving, 10000); // Stop observing after 10 seconds
  });
  
  // Inside your background script or content script
  
  // Add an event listener for when the DOM content is fully loaded
  document.addEventListener("DOMContentLoaded", function() {
    // Find the script element to be removed
    var scriptToRemove = document.querySelector('script[src*="bidgear.com/ads.php"]');
  
    // Check if the script element exists
    if (scriptToRemove) {
      // Remove the script element from the DOM
      scriptToRemove.remove();
      console.log("Removed script from BidGear.");
    } else {
      console.log("Script from BidGear not found.");
    }
  });
  
  // Inside your background script or content script
  
  // Add an event listener for when the DOM content is fully loaded
  document.addEventListener("DOMContentLoaded", function() {
    // Find the script element to be removed
    var scriptToRemove = document.querySelector('script[src*="bidgear.com/ads.php"]');
  
    // Check if the script element exists
    if (scriptToRemove) {
      // Remove the script element from the DOM
      scriptToRemove.remove();
      console.log("Removed script from BidGear.");
    } else {
      console.log("Script from BidGear not found.");
    }
  
    // Find the Google Tag Manager script element to be removed
    var gtagScriptToRemove = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    
    // Check if the Google Tag Manager script element exists
    if (gtagScriptToRemove) {
      // Remove the Google Tag Manager script element from the DOM
      gtagScriptToRemove.remove();
      console.log("Removed Google Tag Manager script.");
    } else {
      console.log("Google Tag Manager script not found.");
    }
  });
  
  // Inside your background script or content script
  
  // Add an event listener for when the DOM content is fully loaded
  document.addEventListener("DOMContentLoaded", function() {
    // Find all script elements in the document
    var scriptElements = document.querySelectorAll('script');
  
    // Loop through each script element
    scriptElements.forEach(function(script) {
      // Check if the script contains a setTimeout function targeting a specific class
      if (script.textContent.includes("setTimeout") && script.textContent.includes("$('.alert-type').fadeOut()")) {
        // Remove the script element from the DOM
        script.remove();
        console.log("Removed script containing setTimeout targeting '.alert-type'.");
      }
    });
  });
  
  document.addEventListener("DOMContentLoaded", function() {
    var scripts = document.querySelectorAll('script[src="https://pladrac.net/js/common.min.js?v=11.0.1"]');
  scripts.forEach(function(script) {
    script.remove();
    console.log("Removed script from pladrac.net");
  });
  
  
  // Call the function when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', function removeElement() {
    var element = document.querySelector('h12[data-auction="atv8wmcuqw"]');
    if (element) {
      element.remove();
    }
  });
  
  
  // Call the function when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', function removeElement() {
    var element = document.querySelector('div[style*="position: absolute;"]'); // Select the div with the specified style
    if (element) {
      element.remove();
    }
  });
  
  document.addEventListener('DOMContentLoaded', function removeElement() {
    var element = document.querySelector('iframe[src^="https://gum.criteo.com/syncframe"]');
    if (element) {
      element.remove();
    }
  });
  
  // Call the function when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', function removeBeforeStyling() {
    var element = document.querySelector('.watch_video.watch-iframe');
    if (element) {
      // Remove the 'before' pseudo-element styling
      element.style.setProperty('before', 'none');
    }
  });

  // Function to block redirection to domains other than "asianc.to"
function blockRedirection() {
  // Find all hidden elements that could potentially redirect
  const hiddenElements = document.querySelectorAll('*[style*="display: none"]');

  // Check each hidden element
  hiddenElements.forEach(element => {
      // Check if the element has an onclick attribute
      const onclick = element.getAttribute('onclick');
      if (onclick && onclick.includes('window.location.href')) {
          // Extract the URL from the onclick attribute
          const url = onclick.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
          if (url && url.length > 1) {
              const redirectUrl = url[1];
              // Check if the redirect URL is not from "asianc.to"
              if (!redirectUrl.includes('asianc.to')) {
                  // Block the redirection by preventing the default action
                  element.addEventListener('click', function(event) {
                      event.preventDefault();
                      event.stopPropagation();
                      console.log('Blocked redirection to:', redirectUrl);
                  });
              }
          }
      }
  });
}

// Execute when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Listen for clicks on the video play button
  const playButton = document.querySelector('.videocontent');
  if (playButton) {
      playButton.addEventListener('click', function() {
          // Call the function to block redirection
          blockRedirection();
      });
  }
});
