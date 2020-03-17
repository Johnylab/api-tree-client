import apiFactory from "./apiFactory.js";

const api = apiFactory('https://pokeapi.co/api/v2/', {
  headers: {
    accept: 'application/json',
  },
});

const pokemon = api.ref('pokemon');

pokemon.ref('pikachu').send().then(console.log);

api.ref('pokemon').ref('10').send().then(console.log);
