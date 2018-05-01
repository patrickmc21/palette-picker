const palette = new PalettePicker();

window.onload = populateProjects();
$('.palette').on('click', '.save-color', toggleColor);
$('#new-palette').on('click', updatePalette);
$('#save-project').on('click', addProject);
$('#save-palette').on('click', savePalette);
$('.projects-container').on('click', '.palette-name, .small-palette', highlightPalette);
$('.projects-container').on('click', '.remove-palette', removePalette);


palette.generatePalette();
appendPalette();

function appendPalette() {
  const paletteCards = [];
  for (let i = 0; i < 5; i++) {
    const { color, saved } = palette.colors[i];
    paletteCards.push(
      `<div class="main-palette-color" style="background-color: ${color}" data-saved=${saved} data-color=${color} data-index=${i}>
        <button class="save-color">Save</button>
        <h2 class="palette-card-color">${color}</h2>
      </div>`
    )
  }
  $('.palette').empty();
  paletteCards.forEach(color => $('.palette').append(color))
};

function toggleColor() {
  const index = $(this).parent('.main-palette-color').data('index');
  palette.toggleColor(index);
};

function updatePalette(e) {
  e.preventDefault();
  palette.updatePalette()
  appendPalette();
};

async function addProject(e) {
  e.preventDefault();
  const project = $('#new-project').val();
  palette.projects[project] = {name: project, palettes: []};
  const id = await postProject(palette.projects[project]);
  palette.projects[project] = {name: project, palettes: [], id: id};
  appendProject(project);
  $('#new-project').val('');
};

function appendProject(project) {
  $('.project-dropdown').append(`<option value="${project}">${project}</option>`);
  $('.projects-container').append(
    `<article>
      <h3>${project}</h3>
      <ul class="${project}"></ul>
    </article>`
  );
};

function savePalette(e) {
  e.preventDefault();
  const newPalette = {
    name: $('#palette-name').val(),
    colors: palette.colors.map(color => color.color)
  };
  const project = $('.project-dropdown').val();
  palette.projects[project].palettes.push(newPalette);
  appendSavedPalette(newPalette, project);
  $('#palette-name').val('');
};

function appendSavedPalette(palette, project) {
  $(`.${project}`).append(
    `<li class="saved-palette" data-name=${palette.name} data-project=${project}>
      <h4 class="palette-name">${palette.name}</h4>
      <div class="small-palette">
        <div class="small-palette-color" style="background-color: ${palette.colors[0]}"></div>
        <div class="small-palette-color" style="background-color: ${palette.colors[1]}"></div>
        <div class="small-palette-color" style="background-color: ${palette.colors[2]}"></div>
        <div class="small-palette-color" style="background-color: ${palette.colors[3]}"></div>
        <div class="small-palette-color" style="background-color: ${palette.colors[4]}"></div>
      </div>
      <button class="remove-palette">X</button>
    </li>
    `
  );
}

function highlightPalette() {
  const { name, project } = $(this).parent().data();
  const highlightedPalette = palette.projects[project].palettes.find(color => color.name === name);
  highlightedPalette.colors.forEach((color, i) => {
    palette.colors[i].color = color;
    appendPalette();
  });
};

function removePalette() {
  const { name, project } = $(this).parent().data();
  const palettes = palette.projects[project].palettes.filter(color => color.name !== name);
  palette.projects[project].palettes = palettes;
  $(`.${project}`).empty();
  palettes.forEach(color => appendSavedPalette(color, project));
};

async function getProjects() {
  const url = '/api/v1/projects';
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

async function populateProjects() {
  const projects = await getProjects();
  console.log(projects)
  projects.forEach(project => {
    palette.projects[project] = {name: project.name, palettes: [], id: project.id};
    appendProject(project.name);
  });
};

async function postProject(project) {
  const url = '/api/v1/projects';
  const options = {
    method: 'POST',
    body: JSON.stringify({
      name: project.name
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const response = await fetch(url, options);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}




