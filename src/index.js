class ApiTree {
  constructor(path, options = {}) {
    this.name = 'API_TREE_ROOT';
    this.path = path;
    this.options = options;
    this.children = {};
  }

  static root(path, options) {
    return new ApiTree(path, options);
  }

  branch(_path, _options = {}) {
    const pathParts = _path.split('/');
    let path = pathParts.shift();
    let child;

    if (pathParts.length) {
      child = this.children[path] || this.branch(path, this.options);
      return child.branch(pathParts.join('/'), _options);
    }

    const { name: _name, ...options } = _options;
    const name = _name || path;
    child = new ApiTree(`${this.path}/${path}`);
    child.options = { ...this.options, options };
    child.name = name;
    child.originalPath = _path;
    this.children[name] = child;
    return child;
  }

  async then(resolve, reject) {
    try {
      const response = await fetch(this.path, this.options);
      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  }

  get tree() {
    const map = {
      then: this.then.bind(this),
    };

    for (const child of this) {
      map[child.name || child.path] = child.tree;
    }

    return map;
  }

  *[Symbol.iterator]() {
    const queue = Object.values(this.children);
    for (const child of queue) {
      yield child;
    }
  }
}

const api = ApiTree.root('https://pokeapi.co/api/v2', {
  headers: {
    accept: 'application/json',
  },
});

const pikachu = api.branch('pokemon/pikachu');
const caterpie = api.branch('pokemon/10', { name: 'caterpie' });

console.log('caterpie', caterpie === api.tree.pokemon.caterpie);
console.log('map', api.tree);

api.tree.pokemon.then(console.log);
api.tree.pokemon.pikachu.then(console.log);
api.tree.pokemon.caterpie.then(console.log);
