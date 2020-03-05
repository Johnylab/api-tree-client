import apiFactory from "./apiFactory.js";

const api = apiFactory('http://api.vagalume.com.br', {
  headers: {
    accept: 'application/json',
  },
  body: {
    apikey: '660a4395f992ff67786584e238f501aa',
  },
});

const search = api.ref('search.art', {
  body: {
    apikey: '660a4395f992ff67786584e238f501aa',
  },
});

search.send('q=Skank&limit=5')
  .then(console.log);

api.ref('hotspots.php')
  .send()
  .then(console.log);