module.exports = (app) => {
  app.get('/post/:title', (_, res) => {
    res.render('post');
  });
};
