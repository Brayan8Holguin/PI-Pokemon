const { Pokemon } = require('../db');

const createPokemon = async (pokemon) => {
    const newPokemon = await Pokemon.create(pokemon);
    return newPokemon;
}

module.exports = {
    createPokemon
};