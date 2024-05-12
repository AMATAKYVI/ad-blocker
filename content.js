(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Find all <a> tags with the class "poster" and "tooltipstered"
    var specificLinks = document.querySelectorAll('a.poster.tooltipstered');
    // Loop through each specific link and add a click event listener
    specificLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        console.log('Link click intercepted, redirect prevented.');
      });
    });

    // Find the video element
    var video = document.querySelector('video.jw-video');

    // Find the masking div
    var maskingDiv = document.getElementById('dontfoid');

    // Function to handle click events on the masking div
    function handleMaskingDivClick(event) {
      event.preventDefault(); // Prevent the default action of the click event
      console.log('Click intercepted on masking div, redirect prevented.');
      // Optionally, you can remove the masking div
      this.remove(); // Remove the masking div
    }

    // Mutation observer to continuously monitor changes in the DOM
    var observer = new MutationObserver(function (mutationsList, observer) {
      mutationsList.forEach(function (mutation) {
        // Check if nodes were added to the masking div
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Loop through added nodes
          mutation.addedNodes.forEach(function (node) {
            // Check if the added node is a hidden element or link
            if (node.nodeType === Node.ELEMENT_NODE && node === maskingDiv) {
              // Add a click event listener to the masking div
              node.addEventListener('click', handleMaskingDivClick);
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

    // Remove specific script from BidGear
    var scriptToRemove = document.querySelector(
      'script[src*="bidgear.com/ads.php"]'
    );
    if (scriptToRemove) {
      scriptToRemove.remove();
      console.log('Removed script from BidGear.');
    } else {
      console.log('Script from BidGear not found.');
    }

    // Remove Google Tag Manager script
    var gtagScriptToRemove = document.querySelector(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    if (gtagScriptToRemove) {
      gtagScriptToRemove.remove();
      console.log('Removed Google Tag Manager script.');
    } else {
      console.log('Google Tag Manager script not found.');
    }

    // Find all script elements in the document
    var scriptElements = document.querySelectorAll('script');
    // Loop through each script element
    scriptElements.forEach(function (script) {
      // Check if the script contains a setTimeout function targeting a specific class
      if (
        script.textContent.includes('setTimeout') &&
        script.textContent.includes("$('.alert-type').fadeOut()")
      ) {
        // Remove the script element from the DOM
        script.remove();
        console.log(
          "Removed script containing setTimeout targeting '.alert-type'."
        );
      }
    });

    // Remove script from pladrac.net
    var scripts = document.querySelectorAll(
      'script[src="https://pladrac.net/js/common.min.js?v=11.0.1"]'
    );
    scripts.forEach(function (script) {
      script.remove();
      console.log('Removed script from pladrac.net');
    });

    // Remove the specific h12 element
    var h12Element = document.querySelector('h12[data-auction="atv8wmcuqw"]');
    if (h12Element) {
      h12Element.remove();
    }

    // Remove the specific div element
    var divElement = document.querySelector(
      'div[style*="position: absolute;"]'
    );
    if (divElement) {
      divElement.remove();
    }

    // Remove specific iframe element
    var iframeElement = document.querySelector(
      'iframe[src^="https://gum.criteo.com/syncframe"]'
    );
    if (iframeElement) {
      iframeElement.remove();
    }

    // Remove before pseudo-element styling from the specific element
    var watchVideoElement = document.querySelector('.watch_video.watch-iframe');
    if (watchVideoElement) {
      // Remove the 'before' pseudo-element styling
      watchVideoElement.style.setProperty('before', 'none');
    }

    // Function to block redirection to domains other than "asianc.to"
    function blockRedirection() {
      // Find all hidden elements that could potentially redirect
      const hiddenElements = document.querySelectorAll(
        '*[style*="display: none"]'
      );

      // Check each hidden element
      hiddenElements.forEach((element) => {
        // Check if the element has an onclick attribute
        const onclick = element.getAttribute('onclick');
        if (onclick && onclick.includes('window.location.href')) {
          // Extract the URL from the onclick attribute
          const url = onclick.match(
            /window\.location\.href\s*=\s*["']([^"']+)["']/
          );
          if (url && url.length > 1) {
            const redirectUrl = url[1];
            // Check if the redirect URL is not from "asianc.to"
            if (!redirectUrl.includes('asianc.to')) {
              // Block the redirection by preventing the default action
              element.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                console.log('Blocked redirection to:', redirectUrl);
              });
            }
          }
        }
      });
    }

    // Listen for clicks on the video play button
    const playButton = document.querySelector('.videocontent');
    if (playButton) {
      playButton.addEventListener('click', function () {
        // Call the function to block redirection
        blockRedirection();
      });
    }

    // Remove target="_blank" from all <a> tags
    var selectATags = document.querySelectorAll('a[target="_blank"]');
    selectATags.forEach(function (link) {
      link.removeAttribute('target');
    });

    // Remove all elements with class "bg-dsp-text-center" if there are no such elements
    var bgDspTextCenterElements = document.querySelectorAll(
      '.bg-dsp-text-center'
    );
    if (bgDspTextCenterElements.length === 0) {
      bgDspTextCenterElements.forEach(function (element) {
        element.style.display = 'none';
      });
    }

    var fixedElements = document.querySelectorAll('[style*="position: fixed"]');
    fixedElements.forEach(function (element) {
      element.remove();
    });
  });

  document.addEventListener('click', function (event) {
    // Check if the clicked element is an <a> tag with target="_blank"
    if (
      event.target.tagName === 'A' &&
      event.target.getAttribute('target') === '_blank'
    ) {
      // Prevent the default behavior of opening the link in a new tab
      event.preventDefault();

      // Optionally, you can remove the target="_blank" attribute
      event.target.removeAttribute('target');

      // Alternatively, you can modify the target attribute to "_self" to open the link in the same tab
      // event.target.setAttribute('target', '_self');

      // Log a message or perform any other action as needed
      console.log('Link with target="_blank" disabled.');
    }
  });
})();
