const THEME_KEY = "preference-vault-theme";
const STORAGE_KEY = "preference-vault-storage";
const DEFAULT_THEME = "paper";
const DEFAULT_STORAGE = "local";

const form = document.querySelector("#preferences-form");
const resetButton = document.querySelector("#reset-button");
const feedback = document.querySelector("#feedback");
const storageReadout = document.querySelector("#storage-readout");
const previewTheme = document.querySelector("#preview-theme");
const previewHeading = document.querySelector("#preview-heading");
const previewDescription = document.querySelector("#preview-description");
const activityLog = document.querySelector("#activity-log");
const activityCount = document.querySelector("#activity-count");
const activityEvents = [];

const themeDetails = {
  paper: {
    label: "Paper mode",
    description: "Bright surfaces, crisp ink, and a little room to think.",
  },
  midnight: {
    label: "Midnight mode",
    description: "Deep surfaces, soft contrast, and a calmer late-night view.",
  },
};

function readStorage(storage, key) {
  try {
    return storage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(storage, key, value) {
  try {
    storage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function removeFromStorage(storage, key) {
  try {
    storage.removeItem(key);
  } catch (error) {
    // Storage can be unavailable in restricted browser contexts.
  }
}

function getSavedPreferences() {
  const savedStorage =
    readStorage(localStorage, STORAGE_KEY) ||
    readStorage(sessionStorage, STORAGE_KEY) ||
    DEFAULT_STORAGE;
  const storage = savedStorage === "session" ? sessionStorage : localStorage;
  const savedTheme = readStorage(storage, THEME_KEY) || DEFAULT_THEME;

  return {
    theme: themeDetails[savedTheme] ? savedTheme : DEFAULT_THEME,
    storage: savedStorage === "session" ? "session" : "local",
  };
}

function applyTheme(theme) {
  const details = themeDetails[theme] || themeDetails[DEFAULT_THEME];
  document.documentElement.dataset.theme = theme;
  previewTheme.textContent = theme;
  previewHeading.textContent = details.label;
  previewDescription.textContent = details.description;
}

function updateReadout(theme, storage) {
  const storageLabel =
    storage === "session" ? "sessionStorage" : "localStorage";
  storageReadout.textContent = `${themeDetails[theme].label} saved in ${storageLabel}`;
}

function setFormValues(preferences) {
  form.elements.theme.value = preferences.theme;
  form.elements.storage.value = preferences.storage;
}

function storageLabel(storage) {
  return storage === "session" ? "sessionStorage" : "localStorage";
}

function renderActivityLog() {
  activityCount.textContent = `${activityEvents.length} ${activityEvents.length === 1 ? "event" : "events"}`;
  activityLog.innerHTML = activityEvents
    .map(
      (event) => `
        <li class="activity-item">
          <span class="activity-message">${event.message}</span>
          <time class="activity-time">${event.time}</time>
        </li>`,
    )
    .join("");
}

function logActivity(message) {
  activityEvents.unshift({
    message,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  renderActivityLog();
}

function savePreferences(theme, storageChoice) {
  const targetStorage =
    storageChoice === "session" ? sessionStorage : localStorage;
  const otherStorage =
    storageChoice === "session" ? localStorage : sessionStorage;
  const targetHadPreference = readStorage(targetStorage, THEME_KEY);
  const previousStorage = readStorage(otherStorage, STORAGE_KEY);
  const themeSaved = writeStorage(targetStorage, THEME_KEY, theme);
  const locationSaved = writeStorage(targetStorage, STORAGE_KEY, storageChoice);

  removeFromStorage(otherStorage, THEME_KEY);
  removeFromStorage(otherStorage, STORAGE_KEY);

  if (!themeSaved || !locationSaved) {
    feedback.textContent = "Storage is unavailable in this browser context.";
    return;
  }

  applyTheme(theme);
  updateReadout(theme, storageChoice);
  feedback.textContent = `Saved to ${storageLabel(storageChoice)}.`;
  logActivity(
    previousStorage
      ? `Moved ${themeDetails[theme].label} from ${storageLabel(previousStorage)} to ${storageLabel(storageChoice)}`
      : targetHadPreference
        ? `Updated ${themeDetails[theme].label} in ${storageLabel(storageChoice)}`
        : `Added ${themeDetails[theme].label} to ${storageLabel(storageChoice)}`,
  );
}

const savedPreferences = getSavedPreferences();
setFormValues(savedPreferences);
applyTheme(savedPreferences.theme);
if (
  readStorage(
    savedPreferences.storage === "session" ? sessionStorage : localStorage,
    THEME_KEY,
  )
) {
  updateReadout(savedPreferences.theme, savedPreferences.storage);
  feedback.textContent = `Loaded from ${storageLabel(savedPreferences.storage)}.`;
  logActivity(`Opened session using ${storageLabel(savedPreferences.storage)}`);
} else {
  logActivity("Opened new session with no saved preference");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  savePreferences(form.elements.theme.value, form.elements.storage.value);
});

form.addEventListener("change", (event) => {
  if (event.target.name === "theme") {
    applyTheme(event.target.value);
  }
});

resetButton.addEventListener("click", () => {
  removeFromStorage(localStorage, THEME_KEY);
  removeFromStorage(localStorage, STORAGE_KEY);
  removeFromStorage(sessionStorage, THEME_KEY);
  removeFromStorage(sessionStorage, STORAGE_KEY);
  setFormValues({ theme: DEFAULT_THEME, storage: DEFAULT_STORAGE });
  applyTheme(DEFAULT_THEME);
  storageReadout.textContent = "No saved preference yet";
  feedback.textContent = "Saved data cleared.";
  logActivity("Cleared preferences from localStorage and sessionStorage");
});
