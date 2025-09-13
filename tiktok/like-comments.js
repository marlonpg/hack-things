function autoScrollComments() {
  const commentsPanel = document.querySelector('[data-e2e="comments-list"]') 
                      || document.querySelector('[class*="DivCommentListContainer"]');
  
  if (!commentsPanel) {
    console.log("❌ Comments panel not found.");
    return;
  }

  let lastScrollTop = -1;

  const interval = setInterval(() => {
    commentsPanel.scrollTop = commentsPanel.scrollHeight;
    console.log("📜 Scrolling...");

    // Stop when no more scrolling happens
    if (commentsPanel.scrollTop === lastScrollTop) {
      clearInterval(interval);
      console.log("✅ All comments loaded!");
    } else {
      lastScrollTop = commentsPanel.scrollTop;
    }
  }, 1500); // adjust delay if TikTok is slow
}

autoScrollComments();



// Select all "Like video" buttons on the page that match the given attributes
const likeButtons = document.querySelectorAll('div[aria-label^="Like video"][role="button"]');

// Recursive helper function to click each button with a random delay
function clickWithDelay(buttons, index = 0) {
    // Stop recursion if we’ve reached the end of the button list
    if (index >= buttons.length) return;

    // Get the current button and its aria-label value
    const button = buttons[index];
    const ariaLabel = button.getAttribute('aria-label');

    // If the button has an aria-label, simulate a click on it
    if (ariaLabel) {
        button.click();
    }

    // Generate a random delay between 500ms and 1000ms
    const randomDelay = Math.random() * 500 + 500;

    // After the delay, move on to the next button
    setTimeout(() => {
        clickWithDelay(buttons, index + 1); // Recursive call for the next button
    }, randomDelay);
}

// Start the clicking process for all like buttons
clickWithDelay(likeButtons);
