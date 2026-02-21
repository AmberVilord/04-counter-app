// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;

//Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); 

  // Get form valuse
  const name = nameInput.ariaValue;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions [0].text;

  console.log(name, team, teamName);

  //Increment count
  count++
  console.log("Total check-ins: ", count);

  //Update progress bar
  const percentage - Math.round((count / maxCount) * 100) + "%";
  console.log('Progress: ${percentage}');

  //Update team Counter
const teamCounter = document.getElementById(team + "Count");
teamCounter.textContent = parseInt(teamCounter.textCountent) + 1;

//Show welcome message
const message = `Welcome, ${name} from ${teamName}`;
console.log(message);

form.requestFullscreen();
});
