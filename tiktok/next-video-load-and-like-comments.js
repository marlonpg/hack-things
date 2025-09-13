(async function autoLikeCommentsAndNext({
  maxVideos = 10,          // change to how many videos you want to process (use Infinity to keep going)
  scrollPause = 700,       // ms between scroll attempts
  stableRounds = 3,        // number of consecutive "no-scroll-change" rounds to consider "done"
  likeDelayMin = 500,      // ms
  likeDelayMax = 1000      // ms
} = {}) {
  const wait = ms => new Promise(res => setTimeout(res, ms));

  // Allow stopping from console
  window.__autoProcessStop = false;
  window.stopAutoProcess = () => { window.__autoProcessStop = true; console.log('🛑 Stop requested'); };

  const getCommentsPanel = () =>
    document.querySelector('[data-e2e="comments-list"]')
    || document.querySelector('[class*="DivCommentListContainer"]')
    || document.querySelector('.css-t5o9ph-5e6d46e3--DivCommentListContainer');

  async function loadAllComments() {
    const panel = getCommentsPanel();
    if (!panel) {
      console.warn('Comments panel not found.');
      return;
    }
    let last = -1, same = 0, attempts = 0, maxAttempts = 60;
    while (same < stableRounds && attempts < maxAttempts && !window.__autoProcessStop) {
      panel.scrollTop = panel.scrollHeight;
      await wait(scrollPause);
      if (panel.scrollTop === last) same++; else { last = panel.scrollTop; same = 0; }
      attempts++;
    }
    // small wait to let the last comments render
    await wait(400);
    console.log('✅ Comments loading finished (or timed out).');
  }

  async function likeAllComments() {
    const panel = getCommentsPanel();
    if (!panel) {
      console.warn('Cannot find comments panel to like comments inside.');
      return;
    }

    // Primary selector: look for role=button with aria-label that mentions "like" and "comment"
    const pickButtons = () => {
      return Array.from(panel.querySelectorAll('[role="button"]')).filter(b => {
        const a = (b.getAttribute('aria-label') || '').toLowerCase();
        // includes "like" and "comment", and not already liked/unlike text
        return a.includes('like') && (a.includes('comment') || a.includes('coment')) && !/unlike|liked/.test(a);
      });
    };

    let buttons = pickButtons();

    // Fallback: any "like" inside the comments panel (if specific "comment" wording isn't present)
    if (buttons.length === 0) {
      buttons = Array.from(panel.querySelectorAll('[role="button"]')).filter(b => {
        const a = (b.getAttribute('aria-label') || '').toLowerCase();
        return a.includes('like') && !/unlike|liked/.test(a);
      });
    }

    console.log(`💡 Found ${buttons.length} like buttons in comments (first pass).`);
    for (let i = 0; i < buttons.length && !window.__autoProcessStop; i++) {
      try { buttons[i].click(); }
      catch (err) { console.warn('click failed for button index', i, err); }
      const delay = Math.floor(Math.random() * (likeDelayMax - likeDelayMin)) + likeDelayMin;
      await wait(delay);
    }

    // Optional: short wait and one more quick scan for any remaining unclicked like buttons
    await wait(500);
    const remain = pickButtons().length;
    if (remain > 0) {
      console.log(`🔁 ${remain} remaining like buttons found after first pass — doing a second quick pass.`);
      const more = pickButtons();
      for (let i = 0; i < more.length && !window.__autoProcessStop; i++) {
        try { more[i].click(); } catch(_) {}
        await wait(300);
      }
    }

    console.log('✅ Liking pass finished.');
  }

  function clickNext() {
    const nextBtn = document.querySelector('button[data-e2e="arrow-right"], button[aria-label="Go to next video"]');
    if (nextBtn) {
      nextBtn.click();
      return true;
    }
    console.warn('Next video button not found.');
    return false;
  }

  // main loop
  for (let videoIdx = 0; videoIdx < maxVideos && !window.__autoProcessStop; videoIdx++) {
    console.log(`\n▶️ Processing video ${videoIdx + 1} / ${maxVideos}`);
    try {
      await loadAllComments();
      if (window.__autoProcessStop) break;
      await likeAllComments();
      if (window.__autoProcessStop) break;
      const moved = clickNext();
      if (!moved) break;
      // wait for the new video's UI to settle
      await wait(2000);
    } catch (err) {
      console.error('Error during processing:', err);
      break;
    }
  }

  console.log('🏁 Process finished (done or stopped).');
})();
