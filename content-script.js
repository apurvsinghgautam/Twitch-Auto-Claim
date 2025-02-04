// content-script.js

// Set a flag to control auto-claim behavior (default is enabled)
window.autoClaimEnabled = true;

// Log an event to localStorage
function logEvent(type, message) {
  const historyKey = "twitchAutoClaimHistory";
  const event = {
    type, // e.g., "drop" or "points"
    message,
    timestamp: new Date().toISOString()
  };
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(historyKey)) || [];
  } catch (e) {
    history = [];
  }
  history.push(event);
  localStorage.setItem(historyKey, JSON.stringify(history));
}

function autoClaim() {
  if (!window.autoClaimEnabled) return;
  
  // This selector looks inside the channel points summary container
  const pointsButton = document.querySelector(
    'div.community-points-summary button[aria-label="Claim Bonus"]'
  );
  if (pointsButton) {
    pointsButton.click();
    console.log("Channel points claimed!");
  }
  
  // Selector for the drops claim button
  const allDivs = document.querySelectorAll("div");
  const claimDivs = Array.from(allDivs).filter(div => div.textContent.trim() === "Claim Now");

  if (claimDivs.length) {
    claimDivs.forEach(div => {
      div.click();
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
