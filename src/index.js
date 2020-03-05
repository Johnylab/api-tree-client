import apiFactory from "./apiFactory.js";

const api = apiFactory('http://api.vagalume.com.br', {
  headers: {
    accept: 'application/json',
  },
});

const search = api.ref('search.art');

search.send('apikey=660a4395f992ff67786584e238f501aa&q=Skank&limit=5')
  .then(console.log);

api.ref('hotspots.php', { body: { apikey: '660a4395f992ff67786584e238f501aa' } })
  .send()
  .then(console.log);