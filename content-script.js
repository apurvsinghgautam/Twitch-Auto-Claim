// content-script.js

// Set a flag to control auto-claim behavior (default is enabled)
window.autoClaimEnabled = true;

// Log an event using chrome.storage so it can be accessed from the extension popup
function logEvent(type, message) {
  const historyKey = "twitchAutoClaimHistory";
  const event = {
    type, // e.g., "drop" or "points"
    message,
    timestamp: new Date().toISOString()
  };

  chrome.storage.local.get([historyKey], (result) => {
    const history = result[historyKey] || [];
    history.push(event);
    chrome.storage.local.set({ [historyKey]: history });
  });
}

function autoClaim() {
  if (!window.autoClaimEnabled) return;
  
  // This selector looks inside the channel points summary container
  const pointsButton = document.querySelector(
    'div.community-points-summary button[aria-label="Claim Bonus"]'
  );
  if (pointsButton) {
    pointsButton.click();
    logEvent("points", "Channel points claimed");
    console.log("Channel points claimed!");
  }
  
  // Selector for the drops claim button
  const allDivs = document.querySelectorAll("div");
  const claimDivs = Array.from(allDivs).filter(div => div.textContent.trim() === "Claim Now");

  if (claimDivs.length) {
    claimDivs.forEach(div => {
      div.click();
      logEvent("drop", "Drop claimed");
      console.log("Drop claimed!");
    });
  }
}

// Use MutationObserver to detect added nodes that might contain the claim buttons
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.addedNodes.length) {
      autoClaim();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Run autoClaim once on page load in case the elements are already present
window.addEventListener("load", autoClaim);

// Additionally, run autoClaim every 30 seconds
setInterval(autoClaim, 30000);
