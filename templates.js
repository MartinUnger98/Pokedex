function pokemonCardHTML(pokemonData, pokemonInfo, pokemonIndex) {
    return `
    <div class="pokemon-card ${pokemonData.types[0].type.name} text-center d-none" id="pokeID${pokemonIndex}" onclick="displayOverlay(${pokemonIndex})">
      <div class="d-flex justify-content-between">
        <h2>#${pokemonData.id}</h2>
        <h2>${pokemonData.name.toUpperCase()}</h2>
      </div>    
      <div class="d-flex justify-content-center align-items-center">
        <div class="m-3" >${pokemonInfo}</div>
        <img class="pokemonImg" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
      </div>
    </div>
  `;
  }

function overlayHTML(pokemonData, pokemonInfo, statsInfo, pokemonIndex, evolutionImg) {
    return `
    <div class="overlay-content ${pokemonData.types[0].type.name}" onclick="doNotCloseOverlay(event)">
      <div class="d-flex justify-content-between">
        <div class="m-3">${pokemonInfo}</div>
        <div>
          <img class="img30x30 scale" src="img/schliessen.png" onclick="closeOverlay()">
        </div>
      </div>
      <!-- Stats -->
      <div class="pokemonStats">${statsInfo}</div>
      <div class="d-flex justify-content-between align-items-center">
        <img class="img30x30 scale" src="img/linker-pfeil.png" onclick="previousPokemon(${pokemonIndex})"">
        <img class="pokemonImg noTransform" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
        <img class="img30x30 scale" src="img/rechter-pfeil.png" onclick="nextPokemon(${pokemonIndex})"">
      </div>
      <!-- Evolutions -->
      <div class="d-flex justify-content-center align-items-center flex-column gap-3">
        <h3>Evolutions</h3>
        <div d-flex justify-content-center align-items-center>${evolutionImg}</div>
      </div>
    </div>
    `;
  }
  
  function statHTML(stat, statValue) {
    return `
    <div class="d-flex align-items-center mb-1 gap-3">
      <div class="stat-name firstLetterUpper">${stat.stat.name}:</div>
      <div class="progress" role="progressbar" aria-label="Example with label">
        <div class="progress-bar" style="width: ${statValue}%">${statValue}</div>
      </div>
    </div>
  `;
  }