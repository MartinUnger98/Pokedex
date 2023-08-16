function showLoadedPokemon(end, start) {
  for (let i = start; i <= end; i++) {
    document.getElementById("pokeID" + i).classList.remove('d-none');    
  }
}
  
function updateLoadingBar(start, end) {
  let loadingBar = document.getElementById('loadingBar');  
  let progress = (start / (end + 1)) * 100; // Berechne Fortschritt in Prozent
  loadingBar.style.width = `${progress}%`;
}

function disableGens(boolean) {
  let length = document.getElementById("genContainer").childElementCount;
  for (let i = 1; i <= length; i++) {
    document.getElementById("gen" + i).disabled = boolean;    
  }
}
  
function setSelectedGenBackground(newgen) {
  let length = document.getElementById("genContainer").childElementCount;
  for (let i = 1; i <= length; i++) {
    document.getElementById("gen" + i).classList.remove("selected");
    document.getElementById("gen" + i).classList.add("gens");
  }
  document.getElementById(newgen).classList.add("selected");
  document.getElementById(newgen).classList.remove("gens");
}

function fadeInsFadeOutsSelectGen() {
  document.getElementById('loadingBarContainer').classList.remove('d-none');
  document.getElementById('loadmore').classList.add('d-none');
  document.getElementById('loadingtxt').classList.remove('d-none');
  document.getElementById('loadingtxt').innerHTML = "Loading " + currentGen.toUpperCase();
}

function fadeInsFadeOutsLoadPokemon(start, amountMore) {
  showLoadedPokemon((start + amountMore), start);
  document.getElementById('loadingBarContainer').classList.add('d-none');
  document.getElementById('loadAni').classList.add('d-none');
  document.getElementById("loadmore").classList.remove('d-none');
  document.getElementById('loadingbackground').classList.add('h-0');
  document.getElementById('loadingtxt').classList.add('d-none');
  disableGens(false);
  searchKeydown = true;
}

function fadeInsFadeOutsDisplayOverlay(overlay) {
  overlayKeydown = true;
  overlay.classList.remove('d-none');
  overlay.classList.add('overlay');
}

function fadeInsFadeOutscreateSearchPokemon() {
  document.getElementById("searchInput").value = "";
  document.getElementById("loadmore").classList.add("d-none");
  document.getElementById("noResultsFound").classList.add('d-none');
  document.getElementById("update").classList.remove("d-none");
  searchKeydown = true;
}

function fadeInsFadeOutsReset() {
  document.getElementById('loadingBar').style.width = "0%";
  document.getElementById('loadingBarContainer').classList.remove('d-none');
  document.getElementById('loadingbackground').classList.remove('h-0');
  document.getElementById("noResultsFound").classList.add('d-none');
  document.getElementById("update").classList.add("d-none");
}