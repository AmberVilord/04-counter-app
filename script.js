// We use const for DOM elements because these references never change.
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendanceCount = document.getElementById("attendanceCount");
const progressBar = document.getElementById("progressBar");
const celebrationMessage = document.getElementById("celebrationMessage");
const attendeeList = document.getElementById("attendeeList");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const waterCard = document.getElementById("waterCard");
const zeroCard = document.getElementById("zeroCard");
const powerCard = document.getElementById("powerCard");
const confettiLayer = document.getElementById("confettiLayer");
const celebrationModal = document.getElementById("celebrationModal");
const celebrationPopupText = document.getElementById("celebrationPopupText");
const closeCelebrationModalButton = document.getElementById("closeCelebrationModal");
const replayCelebrationButton = document.getElementById("replayCelebrationButton");

// We use const because this goal value should stay fixed.
const ATTENDANCE_GOAL = 60;
// We use const because this key name should stay the same in localStorage.
const STORAGE_KEY = "summitCheckInData";
// We use const because these team labels are fixed choices.
const TEAM_LABELS = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables"
};

let appState = {
  total: 0,
  teams: {
    water: 0,
    zero: 0,
    power: 0
  },
  attendees: [],
  celebrationShown: false
};

function loadState() {
  let saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    let parsed = JSON.parse(saved);

    if (parsed && parsed.teams && parsed.attendees) {
      appState.total = parsed.total || 0;
      appState.teams.water = parsed.teams.water || 0;
      appState.teams.zero = parsed.teams.zero || 0;
      appState.teams.power = parsed.teams.power || 0;
      appState.attendees = parsed.attendees;
      appState.celebrationShown = Boolean(parsed.celebrationShown);
    }
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function renderCounts() {
  attendanceCount.textContent = String(appState.total);
  waterCount.textContent = String(appState.teams.water);
  zeroCount.textContent = String(appState.teams.zero);
  powerCount.textContent = String(appState.teams.power);
}

function renderProgress() {
  let percent = Math.round((appState.total / ATTENDANCE_GOAL) * 100);

  if (percent > 100) {
    percent = 100;
  }

  progressBar.style.width = String(percent) + "%";
}

function getWinningTeams() {
  let highest = Math.max(appState.teams.water, appState.teams.zero, appState.teams.power);
  let winners = [];

  if (highest === 0) {
    return winners;
  }

  if (appState.teams.water === highest) {
    winners.push("water");
  }

  if (appState.teams.zero === highest) {
    winners.push("zero");
  }

  if (appState.teams.power === highest) {
    winners.push("power");
  }

  return winners;
}

function updateWinningTeamHighlight() {
  waterCard.classList.remove("winner");
  zeroCard.classList.remove("winner");
  powerCard.classList.remove("winner");

  let winners = getWinningTeams();

  for (let i = 0; i < winners.length; i = i + 1) {
    let teamKey = winners[i];

    if (teamKey === "water") {
      waterCard.classList.add("winner");
    }

    if (teamKey === "zero") {
      zeroCard.classList.add("winner");
    }

    if (teamKey === "power") {
      powerCard.classList.add("winner");
    }
  }
}

function renderCelebration() {
  if (appState.total >= ATTENDANCE_GOAL) {
    let popupText = getCelebrationPopupText();

    replayCelebrationButton.hidden = false;

    if (!appState.celebrationShown) {
      showCelebrationPopup(popupText);
      appState.celebrationShown = true;
      saveState();
    }

    updateWinningTeamHighlight();
  } else {
    celebrationMessage.textContent = "";
    replayCelebrationButton.hidden = true;
    waterCard.classList.remove("winner");
    zeroCard.classList.remove("winner");
    powerCard.classList.remove("winner");
  }
}

function getCelebrationPopupText() {
  let winners = getWinningTeams();

  if (winners.length === 1) {
    celebrationMessage.textContent = "Goal reached! " + TEAM_LABELS[winners[0]] + " is leading the summit!";
    return "Congratulations to " + TEAM_LABELS[winners[0]] + " for leading the summit in attendance!";
  }

  if (winners.length > 1) {
    let teamNames = winners.map(function (teamKey) {
      return TEAM_LABELS[teamKey];
    }).join(" and ");

    celebrationMessage.textContent = "Goal reached! It's a tie between " + teamNames + ".";
    return "congradulations to " + teamNames + " for leading the summit in attendance!";
  }

  celebrationMessage.textContent = "Goal reached! Great job, teams!";
  return "congradulations to Team Intel for leading the summit in attendance!";
}

function showCelebrationPopup(messageText) {
  celebrationPopupText.textContent = messageText;
  celebrationModal.classList.add("active");
  celebrationModal.setAttribute("aria-hidden", "false");
  launchConfetti();
}

function closeCelebrationPopup() {
  celebrationModal.classList.remove("active");
  celebrationModal.setAttribute("aria-hidden", "true");
}

function launchConfetti() {
  // We use const because this palette should not change while generating pieces.
  const confettiColors = ["#0071c5", "#6db5ff", "#d8ebff", "#1e3a5f", "#ffffff"];

  confettiLayer.innerHTML = "";

  for (let i = 0; i < 180; i = i + 1) {
    let piece = document.createElement("div");
    let left = Math.random() * 100;
    let delay = Math.random() * 0.8;
    let duration = 2.4 + Math.random() * 2;
    let size = 6 + Math.random() * 8;
    let colorIndex = Math.floor(Math.random() * confettiColors.length);

    piece.className = "confetti-piece";
    piece.style.left = String(left) + "vw";
    piece.style.backgroundColor = confettiColors[colorIndex];
    piece.style.width = String(size) + "px";
    piece.style.height = String(size * 1.5) + "px";
    piece.style.animationDelay = String(delay) + "s";
    piece.style.animationDuration = String(duration) + "s";

    confettiLayer.appendChild(piece);
  }

  setTimeout(function () {
    confettiLayer.innerHTML = "";
  }, 5200);
}

function renderAttendees() {
  attendeeList.innerHTML = "";

  for (let i = 0; i < appState.attendees.length; i = i + 1) {
    let attendee = appState.attendees[i];
    let listItem = document.createElement("li");
    listItem.textContent = attendee.name + " - " + TEAM_LABELS[attendee.team];
    attendeeList.appendChild(listItem);
  }

  if (appState.attendees.length === 0) {
    let emptyItem = document.createElement("li");
    emptyItem.textContent = "No one checked in yet.";
    attendeeList.appendChild(emptyItem);
  }
}

function renderAll() {
  renderCounts();
  renderProgress();
  renderCelebration();
  renderAttendees();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let name = nameInput.value.trim();
  let team = teamSelect.value;

  if (name === "" || !TEAM_LABELS[team]) {
    return;
  }

  appState.total = appState.total + 1;
  appState.teams[team] = appState.teams[team] + 1;
  appState.attendees.push({
    name: name,
    team: team
  });

  greeting.textContent = "Welcome, " + name + "! You checked in with " + TEAM_LABELS[team] + ".";

  saveState();
  renderAll();

  form.reset();
  nameInput.focus();
});

closeCelebrationModalButton.addEventListener("click", closeCelebrationPopup);

celebrationModal.addEventListener("click", function (event) {
  if (event.target === celebrationModal) {
    closeCelebrationPopup();
  }
});

replayCelebrationButton.addEventListener("click", function () {
  if (appState.total >= ATTENDANCE_GOAL) {
    showCelebrationPopup(getCelebrationPopupText());
  }
});

loadState();
renderAll();
