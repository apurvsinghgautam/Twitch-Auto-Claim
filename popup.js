document.addEventListener("DOMContentLoaded", function() {
  const historyDiv = document.getElementById("history");
  const historyKey = "twitchAutoClaimHistory";

  function loadHistory() {
    chrome.storage.local.get([historyKey], (result) => {
      let history = result[historyKey] || [];
      // Sort history with the newest events first
      history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      historyDiv.innerHTML = "";
      if (history.length === 0) {
        historyDiv.textContent = "No events recorded.";
        return;
      }
      history.forEach(event => {
        const entry = document.createElement("div");
        entry.classList.add("log-entry");
        entry.innerHTML = `
          <span class="type">${event.type.toUpperCase()}:</span>
          <span class="message">${event.message}</span>
          <div class="timestamp">${new Date(event.timestamp).toLocaleString()}</div>
        `;
        historyDiv.appendChild(entry);
      });
    });
  }

  loadHistory();

  document.getElementById("clearHistory").addEventListener("click", function() {
    chrome.storage.local.remove(historyKey, loadHistory);
  });
});
