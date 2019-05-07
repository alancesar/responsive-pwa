const home = require('../routes/home');
const posts = require('../routes/post');

module.exports = (app) => {
  [home, posts].forEach(route => route(app));
};
