import { ApiTree } from './ApiTree';

const api = ApiTree.root('https://pokeapi.co/api/v2', {
  headers: {
    accept: 'application/json',
  },
});

api.branch('pokemon/pikachu');

const caterpie = api.branch('pokemon/10', { name: 'caterpie' });

api.tree.pokemon.then(console.log);
api.tree.pokemon.pikachu.then(console.log);

caterpie.then(console.log);
