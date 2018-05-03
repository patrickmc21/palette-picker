const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'));

app.get('/api/v1/projects', (req, res) => {
  db('projects').select()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving projects');
    });
});

app.get('/api/v1/projects/:id/palettes', (req, res) => {
  const { id } = req.params;
  db('palettes').select().where('project_id', id)
    .then((palettes) => {
      res.status(200).json(palettes);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving palettes');
    });
});

app.post('/api/v1/projects', (req, res) => {
  const project = req.body;
  if (project.name) {
    db('projects').insert(project, 'id')
      .then(project => {
        res.status(201).json({id: project[0] })
      })
      .catch(error => {
        res.status(500).send('Error posting project');
      });
  } else {
    res.status(422).send({error: 'Please include a project name'})
  }
});

app.post('/api/v1/projects/:project_id/palette', (req, res) => {
  const { project_id } = req.params;
  const palette = req.body;
  db('palettes').insert({...palette, project_id}, 'id')
    .then(palette => {
      res.status(201).json({id: palette[0] })
    })
    .catch(error => {
      res.status(500).send('Error posting palette');
    });
});

app.delete('/api/v1/projects/:id', (req, res) => {
  const { id } = req.params;

  db('projects').where('id', id).del()
    .then(id => res.sendStatus(204))
    .catch(error => res.status(404).send({message: 'project not found'}));
});

app.delete('/api/v1/palette/:id', (req, res) => {
  const { id } = req.params;
  db('palettes').where({id: id}).del()
    .then(palette => {
      res.sendStatus(204)
    })
    .catch(error => {
      res.status(404).send('palette not found')
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = { app, db };