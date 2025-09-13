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
