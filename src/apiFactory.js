const payloadParsers = {
  get: (data) => {
    if (!data) {
      return '';
    }

    if (typeof data === 'string') {
      return data;
    }

    return Object.entries(data)
      .map(([key, val]) => `${key}=${val}`)
      .join('&');
  },
  post: (data) => {
    if (data instanceof Array) {
      const payload = data.reduce((obj, [key, val]) => ({
        ...obj, [key]: val,
      }), {});
      return JSON.stringify(payload);
    }

    if (typeof data === 'object') {
      return JSON.stringify(data);
    }

    return data;
  },
};

const parsePayload = (data, method = 'get') => {
  const parse = payloadParsers[method];
  return parse ? parse(data) : data;
};

const apiFactorySend = async (path, data, { body, ...options }) => {
  try {
    const defaultPayload = parsePayload(body, options.method);
    const currentPayload = parsePayload(data, options.method);
    const payload = [defaultPayload, currentPayload].filter(e => e).join('&');
    const url = (
      options.method === 'post'
        ? path
        : `${path}?${payload}`
    );
    if (options.method === 'post') {
      options.body = payload;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw response;
    }
    return response.json();
  }
  catch (error) {
    console.trace(error);
    return error;
  }
};

const apiFactory = (path, config) => {
  const parent = config.url ? config : null;
  const url = parent ? `${parent.url}/${path}` : path;
  const defaults = parent ? parent.defaults : config;
  const ref = {
    url,
    parent,
    defaults,
    ref(path, defs) {
      return apiFactory(path, {
        ...this, defaults: { ...defaults, ...defs }
      });
    },
    send(data, options) {
      return apiFactorySend(url, data, {
        ...defaults, ...options,
      });
    },
  };

  if (parent) {
    parent.children = parent.children || new Set();
    parent.children.add(ref);
  }

  return ref;
}

export default apiFactory;