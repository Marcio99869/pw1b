const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
 
const buttonMoves = document.querySelector('.btn-moves');
const movesTable = document.querySelector('.moves-table');
const movesTableBody = document.querySelector('.moves-table-body');






let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';
  pokemonImage.style.display = 'none'; // Esconde a imagem inicialmente

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = `#${data.id}`;
    
    // Verifica se a imagem existe antes de definir a src
    const sprite = data.sprites.versions['generation-v']['black-white']['animated']['front_default'] || 
                   data.sprites.front_default;

    if (sprite) {
      pokemonImage.src = sprite;
      pokemonImage.style.display = 'block'; // Mostra a imagem se existir
    } else {
      pokemonImage.style.display = 'none'; // Esconde a imagem se não existir
    }

    input.value = '';
    searchPokemon = data.id;
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
  }
}

buttonMoves.addEventListener('click', async () => {
  const data = await fetchPokemon(searchPokemon);

  if (data) {
    movesTableBody.innerHTML = ''; // limpa antes
    const firstTenMoves = data.moves.slice(0, 10); // limitar para evitar exagero

    firstTenMoves.forEach((moveEntry) => {
      const moveName = moveEntry.move.name;
      const levelLearned = moveEntry.version_group_details.find(
        detail => detail.move_learn_method.name === 'level-up'
      )?.level_learned_at || '—';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${moveName}</td>
        <td>${levelLearned}</td>
      `;
      movesTableBody.appendChild(row);
    });

    movesTable.classList.toggle('hidden'); // mostra/esconde
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

// Renderiza o Pokémon inicial
renderPokemon(searchPokemon);
