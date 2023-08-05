let currentPokemonId = 1;
let pokemonListDiv = document.getElementById('pokemonList');


function loadNextPokemon() {
  if (currentPokemonId <= 151) { // Assuming only gen1
    fetchPokemonData(currentPokemonId);
    currentPokemonId++;
  }
}

/* function loadPreviousPokemon() {
  if (currentPokemonId > 1) {
    currentPokemonId--;
    fetchPokemonData(currentPokemonId);
  }
} */

async function fetchPokemonData(pokemonId) {
  let responsAsJSON = await getResponseAsJSON(pokemonId);
  displayPokemonCard(responsAsJSON);
}

async function getResponseAsJSON(pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  let response = await fetch(url);
  let responsAsJSON = await response.json();
  return responsAsJSON;
}

function displayPokemonCard(pokemonData) {
  let pokemonCard = document.getElementById("pokemonList");
  let typesImages = pokemonData.types.map(type => `<img class="typeImg" src="img/${type.type.name}.svg">`).join('');
  let pokemonInfo = `<h2>${pokemonData.name.toUpperCase()}</h2>${typesImages}`;
  let pokemonIndex = pokemonData.id 
  pokemonCard.innerHTML += `
    <div class="pokemon-card ${pokemonData.types[0].type.name}" /* onclick="displayOverlay(${pokemonIndex})" */>
      <div class="pokemonInfo" >${pokemonInfo}</div>
      <img class="pokemonImg" src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
    </div>
  `;

}

function displayErrorMessage() {
  let errorCard = document.createElement('div');
  errorCard.classList.add('error-card');
  errorCard.textContent = 'Pokemon not found.';
  pokemonListDiv.appendChild(errorCard);
}

// Load the first Pokemon card and automatically load the rest
loadNextPokemon();

// Automatically load the next Pokemon every 2 seconds (adjust the interval as needed)
setInterval(loadNextPokemon, 0.00000005);

// Function to display the overlay with more information about the selected pokemon
async function displayOverlay(pokemonIndex) {
  let pokemonData = await getResponseAsJSON(pokemonIndex);
  let overlay = document.getElementById("overlay");
  overlay.classList.remove('d-none');
  overlay.classList.add('overlay');
  let typesImages = pokemonData.types.map(type => `<img class="typeImg" src="img/${type.type.name}.svg">`).join('');
  let pokemonInfo = `<h2>${pokemonData.name.toUpperCase()}</h2>${typesImages}`;


  let statsInfo = `<h3>Stats:</h3>`;
  for (let stat of pokemonData.stats) {
    let statValue = stat.base_stat
    statsInfo += statHTML(stat, statValue);
  }
  overlay.innerHTML = overlayHTML(pokemonData, pokemonInfo, statsInfo);
}

function overlayHTML(pokemonData, pokemonInfo, statsInfo, event) {
  return `
  <div class="overlay-content ${pokemonData.types[0].type.name}" onclick="doNotCloseOverlay(event)">
    <div class="pokemonInfo">${pokemonInfo}</div>
    <div class="pokemonStats">${statsInfo}</div>
    <img class="pokemonImg" src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
    
    <button onclick="closeOverlay()">Previous</button>
    <button onclick="next">Next</button>
  </div>
  `;
}

function statHTML(stat, statValue) {
  return `
  <div class="stat-container">
    <div class="stat-name">${stat.stat.name}</div>
    <div class="progress" role="progressbar" aria-label="Example with label">
      <div class="progress-bar" style="width: ${statValue}%">${statValue}</div>
    </div>
  </div>
`;
}

function closeOverlay() {
  let overlay = document.getElementById("overlay")
  overlay.classList.add("d-none");
}

function doNotCloseOverlay(event) {
  event.stopPropagation();
}

