const dataBody = document.getElementById("dataBody");
const statusMessage = document.getElementById("status");
const buttons = document.querySelectorAll("button");

function renderTable(records) {
  dataBody.innerHTML = records.map((record) => `
    <tr>
      <td>${record.id}</td>
      <td>${record.name}</td>
      <td>${record.course}</td>
      <td>${record.score}</td>
      <td>${record.grade}</td>
    </tr>
  `).join("");
}

function setLoading(isLoading) {
  buttons.forEach((button) => {
    button.disabled = isLoading;
  });
}

function showError(error) {
  dataBody.innerHTML = `
    <tr>
      <td colspan="5" class="empty">Unable to load records.</td>
    </tr>
  `;
  statusMessage.textContent = `Error: ${error.message}`;
  statusMessage.className = "status error";
}

function showSuccess(records, method) {
  renderTable(records);
  statusMessage.textContent = `${records.length} records loaded using ${method}.`;
  statusMessage.className = "status";
}

async function loadWithFetch() {
  setLoading(true);
  statusMessage.textContent = "Loading records with fetch()...";
  statusMessage.className = "status";

  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const records = await response.json();
    showSuccess(records, "fetch() ");
  } catch (error) {
    showError(error);
  } finally {
    setLoading(false);
  }
}

function loadWithJQuery() {
  setLoading(true);
  statusMessage.textContent = "Loading records with $.getJSON()...";
  statusMessage.className = "status";

  $.getJSON("data.json")
    .done((records) => showSuccess(records, "$.getJSON()"))
    .fail((_request, _textStatus, error) => showError(new Error(error || "Request failed")))
    .always(() => setLoading(false));
}

document.getElementById("fetchButton").addEventListener("click", loadWithFetch);
document.getElementById("jqueryButton").addEventListener("click", loadWithJQuery);
