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

// We use const because this goal value should stay fixed.
const ATTENDANCE_GOAL = 50;
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
  attendees: []
};

function loadState() {
  let saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    let parsed = JSON.parse(saved);

    if (parsed && parsed.teams && parsed.attendees) {
      appState = parsed;
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
    let winners = getWinningTeams();

    if (winners.length === 1) {
      celebrationMessage.textContent = "Goal reached! " + TEAM_LABELS[winners[0]] + " is leading the summit!";
    } else if (winners.length > 1) {
      celebrationMessage.textContent = "Goal reached! It's a tie between " + winners.map(function (teamKey) {
        return TEAM_LABELS[teamKey];
      }).join(" and ") + ".";
    } else {
      celebrationMessage.textContent = "Goal reached! Great job, teams!";
    }

    updateWinningTeamHighlight();
  } else {
    celebrationMessage.textContent = "";
    waterCard.classList.remove("winner");
    zeroCard.classList.remove("winner");
    powerCard.classList.remove("winner");
  }
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

loadState();
renderAll();
