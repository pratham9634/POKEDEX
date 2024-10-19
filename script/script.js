// Wrap the code inside a function to avoid polluting the global scope
function loadPokemon() {
    const mainContainer = document.querySelector('.pokemon-list');

    for (let id = 1; id <= 700; id++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${id}`
        let imageUrl = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${id.toString().padStart(3, '0')}.png`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const card = cardCreator(data, imageUrl);
                mainContainer.appendChild(card);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Move the function definitions outside the for loop
    function cardCreator(data, imageUrl) {
        const box = document.createElement('div');
        box.appendChild(imageBox(imageUrl));
        box.appendChild(numberBox(data));
        box.appendChild(nameBox(data));
        box.appendChild(typeBox(data));
        box.className = 'pokemon-card';
        return box;
    }

    function imageBox(imageUrl) {
        const imgBox = document.createElement('img');
        imgBox.className = 'image';
        imgBox.src = imageUrl;
        return imgBox;
    }

    function numberBox(data) {
        const numBox = document.createElement('div');
        numBox.className = 'number';
        numBox.textContent = `#${data.id}`;
        return numBox;
    }

    function nameBox(data) {
        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = data.name.toUpperCase();
        return name;
    }

    function typeBox(data) {
        const typeContainer = document.createElement('div');
        typeContainer.className = 'type-container';

        data.types.forEach((ele) => {
            const type = document.createElement('div');
            type.className = 'type';

            const typeName = ele.type.name;
            type.style.backgroundColor = setTypeBackgroundColor(typeName);

            type.textContent = typeName;

            typeContainer.appendChild(type);
        });

        return typeContainer;
    }

    function setTypeBackgroundColor(typeName) {
        const typeColor = typeColors[typeName.toLowerCase()];
        if (typeColor) {
            return `rgb(${typeColor[0]}, ${typeColor[1]}, ${typeColor[2]})`;
        } else {
            return ''; // or some default color
        }
    }

    const typeColors = {
        "rock": [182, 158, 49],
        "ghost": [112, 85, 155],
        "steel": [183, 185, 208],
        "water": [100, 147, 235],
        "grass": [116, 203, 72],
        "psychic": [251, 85, 132],
        "ice": [154, 214, 223],
        "dark": [117, 87, 76],
        "fairy": [230, 158, 172],
        "normal": [170, 166, 127],
        "fighting": [193, 34, 57],
        "flying": [168, 145, 236],
        "poison": [164, 62, 158],
        "ground": [222, 193, 107],
        "bug": [167, 183, 35],
        "fire": [245, 125, 49],
        "electric": [249, 207, 48],
        "dragon": [112, 55, 255]
    }



}

// Call the function to load the Pokémon
loadPokemon();

const search       = document.querySelector('#search');
const number       = document.querySelector('#number');
const pokemonImage = document.querySelector('#pokemon-image');
const types        = document.querySelector('#types');
const statNumber   = document.querySelectorAll('.stat-number');
const barInner     = document.querySelectorAll('.bar-inner');
const barOuter     = document.querySelectorAll('.bar-outer');
const statDesc     = document.querySelectorAll('.stat-desc');
const baseStats    = document.querySelector('#base-stats');
const pokedex      = document.querySelector('#pokedex');

const typeColors = {
    "rock":     [182, 158,  49],
    "ghost":    [112,  85, 155],
    "steel":    [183, 185, 208],
    "water":    [100, 147, 235],
    "grass":    [116, 203,  72],
    "psychic":  [251,  85, 132],
    "ice":      [154, 214, 223],
    "dark":     [117,  87,  76],
    "fairy":    [230, 158, 172],
    "normal":   [170, 166, 127],
    "fighting": [193,  34,  57],
    "flying":   [168, 145, 236],
    "poison":   [164,  62, 158],
    "ground":   [222, 193, 107],
    "bug":      [167, 183,  35],
    "fire":     [245, 125,  49],
    "electric": [249, 207,  48],
    "dragon":   [112,  55, 255]
}

const fetchApi = async (pkmnName) => {
    // Joining Pokémon names that has more than one word
    pkmnNameApi = pkmnName.split(' ').join('-');

    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pkmnNameApi);
    
    if (response.status === 200) {
        const pkmnData = await response.json();
        return pkmnData;
    } 

    return false;
}

search.addEventListener('change', async (event) => {
    const pkmnData  = await fetchApi(event.target.value);

    // Validation when Pokémon does not exist
    if (!pkmnData) {
        alert('Pokémon does not exist.');
        return;
    }

    // Main Pokémon color, in order to change UI theme
    const mainColor = typeColors[pkmnData.types[0].type.name];
    baseStats.style.color         = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    pokedex.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;

    // For debugging - Will be removed later on
    console.log(pkmnData);

    // Sets pokemon image
    pokemonImage.src = pkmnData.sprites.other.home.front_default;

    // Updates "Type" bubbles
    types.innerHTML = '';

    pkmnData.types.forEach((t) => {
        let newType = document.createElement('span');
        let color   = typeColors[t.type.name];

        newType.innerHTML = t.type.name;
        newType.classList.add('type');
        newType.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`; 

        types.appendChild(newType);
    });

    // Updates Stats and Stats bars
    pkmnData.stats.forEach((s, i) => {
        statNumber[i].innerHTML = s.base_stat.toString().padStart(3, '0');
        barInner[i].style.width = `${s.base_stat}%`;
        barInner[i].style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        barOuter[i].style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.3)`;
        statDesc[i].style.color           = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    });
});