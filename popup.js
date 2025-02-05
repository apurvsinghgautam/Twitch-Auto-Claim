document.addEventListener("DOMContentLoaded", function() {
  const historyDiv = document.getElementById("history");
  const historyKey = "twitchAutoClaimHistory";

  function loadHistory() {
    // Use chrome.storage.local.get since this is running in your extension popup
    chrome.storage.local.get([historyKey], function(result) {
      let history = result[historyKey] || [];
      // Sort history with newest events first
      history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      historyDiv.innerHTML = "";
      if (history.length === 0) {
        historyDiv.innerHTML = '<p class="no-history">No events recorded.</p>';
        return;
      }
      history.forEach(event => {
        const entry = document.createElement("div");
        entry.className = "log-entry";

        const details = document.createElement("div");
        details.className = "log-details";
        const typeEl = document.createElement("div");
        typeEl.className = "log-type";
        typeEl.textContent = event.type.toUpperCase();
        const messageEl = document.createElement("div");
        messageEl.textContent = event.message;
        details.appendChild(typeEl);
        details.appendChild(messageEl);

        const timestampEl = document.createElement("div");
        timestampEl.className = "log-timestamp";
        timestampEl.textContent = new Date(event.timestamp).toLocaleString();

        entry.appendChild(details);
        entry.appendChild(timestampEl);
        historyDiv.appendChild(entry);
      });
    });
  }

  loadHistory();

  document.getElementById("clearHistory").addEventListener("click", function() {
    chrome.storage.local.remove([historyKey], function() {
      loadHistory();
    });
  });
});
