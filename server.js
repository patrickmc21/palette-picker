const express = require('express');
const app = express();
const bodyParser = 'body-parser';

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'));

app.get('/api/v1/projects', (req, res) => {
  //get all projects on page load
});

app.post('/api/v1/projects', (req, res) => {
  //add new project
  //no duplicate projects
});

app.post('/api/v1/projects/:project_id/palette', (req, res) => {
  //add new palette
});

app.delete('/api/v1/projects/:project_id/palette/:palette_id', (req, res) => {
  //delete palette
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});