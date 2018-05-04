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

// set POST route for palettes
app.post('/api/v1/projects/:project_id/palette', (req, res) => {
  // destructure project id from params
  const { project_id } = req.params;
  // assign request body to variable palette
  const palette = req.body;
  // destructure palette
  const { name, color1, color2, color3, color4, color5 } = palette;
  // conditional for making sure body includes correct key/value pairs
  if (name && color1 && color2 && color3 && color4 && color5) {
    // insert palette with project id into palettes table, return palette id
    db('palettes').insert({...palette, project_id}, 'id')
    // use then() method to handle promise return from db
      .then(palette => {
        // send response with status 201 and send palette id
        res.status(201).json({id: palette[0] })
      })
      // set catch for error handling from db return
      .catch(error => {
        // send response with status 500 and message
        res.status(500).json({message: 'Error posting palette'});
      });
      // conditional if request body does not include correct key/value pairs
  } else {
    // send response with status 422 and error message
    res.status(422).send({error: 'Please include a valid palette'});
  }
});

// set DELETE route for projects
app.delete('/api/v1/projects/:id', (req, res) => {
  // destructure id dfrom params
  const { id } = req.params;
  // delete all from projects table where project id matches params id
  db('projects').where('id', id).del()
  // send response with status 204 on successful delete
    .then(id => res.sendStatus(204))
    // send response with status 404 if problem with delete
    .catch(error => res.status(404).send({message: 'project not found'}));
});

// set DELETE route for palettes
app.delete('/api/v1/palette/:id', (req, res) => {
  // destructure id from request params
  const { id } = req.params;
  // delete all from table palettes where palette id matches params id
  db('palettes').where({id: id}).del()
  // send response with status 204 on successful delete
    .then(palette => {
      res.sendStatus(204)
    })
    // send status 404 and message on unsuccessful delete
    .catch(error => {
      res.status(404).json({message:'invalid id'})
    });
});

// set port for server to listen on using environent variable PORT
app.listen(app.get('port'), () => {
  // log a message to the console telling what port the app is running on
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// export server and database so they can be tested
module.exports = { app, db };