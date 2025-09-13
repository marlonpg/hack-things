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
