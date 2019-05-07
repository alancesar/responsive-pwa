/* eslint no-console: 0 */
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('assets'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.listen(port, () => console.log(`Server running in http://localhost:${port}`));

module.exports = app;
