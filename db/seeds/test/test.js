
exports.seed = function(knex, Promise) {
  return knex('projects').del()
    .then(function () {
      return knex('projects').insert([
        {name: 'mountain'}
      ], 'id')
      .then(project => {
        return knex('palettes').insert([
          {
            name: 'warm',
            color1: 'red',
            color2: 'white',
            color3: 'blue',
            color4: 'green',
            color5: 'orange',
            project_id: project[0]
          },
          {
            name: 'ugly',
            color1: 'coral',
            color2: 'magenta',
            color3: 'chartreuse',
            color4: 'blanchedalmond',
            color5: 'aqua',
            project_id: project[0]
          }
        ])
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
};
