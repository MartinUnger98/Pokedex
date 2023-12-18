function pokemonCardHTML(pokemonData, pokemonInfo, pokemonIndex) {
  return `
  <div class="pokemon-card ${pokemonData.types[0].type.name} text-center d-none" id="pokeID${pokemonIndex}" onclick="displayOverlay(${pokemonIndex})">
    <div class="d-flex justify-content-between">
      <h2>#${pokemonData.id}</h2>
      <h2>${pokemonData.name.toUpperCase()}</h2>
    </div>    
    <div class="d-flex justify-content-between align-items-center">
      <div>${pokemonInfo}</div>
      <img class="pokemonImg" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
    </div>
  </div>
`;
}

function overlayHTML(pokemonData, pokemonInfo, statsInfo, pokemonIndex, evolutionImg, abilities) {
  return `
  <div class="overlay-content ${pokemonData.types[0].type.name}" onclick="doNotCloseOverlay(event)">
    <div class="d-flex justify-content-between padding20">
      <div>${pokemonInfo}</div>
      <div>
        <img class="img30x30 scale" src="img/schliessen.png" onclick="closeOverlay()">
      </div>
    </div>  
    
    <div class="d-flex justify-content-between align-items-center paddingLR">
      <img class="img30x30 scale" src="img/linker-pfeil.png" onclick="previousPokemon(${pokemonIndex})"">
      <img class="pokemonImgOverlay" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
      <img class="img30x30 scale" src="img/rechter-pfeil.png" onclick="nextPokemon(${pokemonIndex})"">
    </div>

    <div class="d-flex justify-content-around selectableRow">
      <p id="statsBtn" onclick="selectRow('stats', '${pokemonData.types[0].type.name}')" class="${pokemonData.types[0].type.name} colorWhite">Stats</p>
      <p id="abilitiesBtn" onclick="selectRow('abilities', '${pokemonData.types[0].type.name}')" >Abilities</p>
      <p id="evolutionsBtn" onclick="selectRow('evolutions', '${pokemonData.types[0].type.name}')">Evolutions</p>
    </div>

    <div id="stats" class="paddingLR pokemonStats">${statsInfo}</div>

    <div id="abilities" class="d-none d-flex flex-column justify-content-center">
      <div>${abilities}</div>
    </div>

    <div id="evolutions" class="d-none d-flex justify-content-center align-items-center flex-column">
      <div d-flex justify-content-center align-items-center>${evolutionImg}</div>
    </div>
    
        
  </div>
  `;
}

function statHTML(stat, statValue) {
  return `
  <div class="d-flex align-items-center justify-content-between mb-1 gap-3 font12">
    <div class="stat-name firstLetterUpper">${stat.stat.name}:</div>
    <div class="progress" role="progressbar" aria-label="Example with label">
      <div class="progress-bar" style="width: ${statValue}%">${statValue}</div>
    </div>
  </div>
`;
}