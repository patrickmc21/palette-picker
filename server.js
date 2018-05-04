// import express from node module
const express = require('express');
// create new instance of express
const app = express();
// set environment
const environment = process.env.NODE_ENV || 'development';
// set configuration of knex using environment
const configuration = require('./knexfile')[environment];
// import knex database setup from knex and the above 
const db = require('knex')(configuration);
// import bodyParser to allow use of request body
const bodyParser = require('body-parser');
// apply bodyParser middleware to server
app.use(bodyParser.json());
// set port to environment Port of port 3000
app.set('port', process.env.PORT || 3000);
// set local variable title to app name
app.locals.title = 'Palette Picker';
// set static asset directory to public
app.use(express.static('public'));
// set GET route for all projects
app.get('/api/v1/projects', (req, res) => {
  //select all from projects table
  db('projects').select()
    // use then() method to handle promise returned from db
    .then((projects) => {
      // send response with status 200 and json the projects
      res.status(200).json(projects);
    })
    // set catch for error handling from db return
    .catch((error) => {
      // send response with status 500 and message
      res.status(500).send({message: 'Error retrieving projects'});
    });
});

// set GET route for all projects with matching project id
app.get('/api/v1/projects/:id/palettes', (req, res) => {
  // deconstruct id from request params
  const { id } = req.params;
  // select all from palettes table where the project id matches the params id
  db('palettes').select().where('project_id', id)
  // use then() method to handle promise return from db
    .then((palettes) => {
      // send response with status 200 and json palettes
      res.status(200).json(palettes);
    })
    // set catch for error handling from db return
    .catch((error) => {
      // send resonse with status 500 and error message
      res.status(500).json({error: 'Error retrieving palettes'});
    });
});

// set POST route for projects
app.post('/api/v1/projects', (req, res) => {
  // reassign request body to variable project
  const project = req.body;
  // conditional for making sure body includes correct key/value pairs
  if (project.name) {
    // insert project into projects table, have db return project id
    db('projects').insert(project, 'id')
    // use then() method to handle promise return from db
      .then(project => {
        // send response with status 201 and json the project id
        res.status(201).json({id: project[0] })
      })
      // set catch for error handling from db return
      .catch(error => {
        // send response with status 500 and error message
        res.status(500).send({ message: 'Error posting project'});
      });
    // conditional if request body does not include correct key/value pairs
  } else {
    // send response with status 422 and message 
    res.status(422).send({error: 'Please include a project name'})
  }
});

app.post('/api/v1/projects/:project_id/palette', (req, res) => {
  const { project_id } = req.params;
  const palette = req.body;
  const { name, color1, color2, color3, color4, color5 } = palette;
  if (name && color1 && color2 && color3 && color4 && color5) {
    db('palettes').insert({...palette, project_id}, 'id')
      .then(palette => {
        res.status(201).json({id: palette[0] })
      })
      .catch(error => {
        res.status(500).send('Error posting palette');
      });
  } else {
    res.status(422).send({error: 'Please include a valid palette'});
  }
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
      res.status(404).json({message:'invalid id'})
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = { app, db };