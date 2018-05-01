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
        <h2 class="palette-card-color">${color}</h2>
        <button class="save-color ${saved ? 'saved' : ''}"></button>
      </div>`
    )
  }
  $('.palette').empty();
  paletteCards.forEach(color => $('.palette').append(color))
};

function toggleColor() {
  const index = $(this).parent('.main-palette-color').data('index');
  $(this).toggleClass('saved');
  palette.toggleColor(index);
};

function updatePalette(e) {
  e.preventDefault();
  animateUpdate(this);
  palette.updatePalette()
  appendPalette();
};

function animateUpdate(button) {
  $(button).animate({"color":"#3c444e"}, 1, function(){
        $(button).val('...Generating');
    });
    $(button).animate({"color":"#3c444e"}, 300, function(){
        $(button).val('New Palette');
    });
}

async function addProject(e) {
  e.preventDefault();
  if ($('#new-project').val().length > 0) {
    const project = $('#new-project').val();
    palette.projects[project] = {name: project, palettes: []};
    const { id } = await postProject(palette.projects[project]);
    palette.projects[project] = {name: project, palettes: [], id: id};
    appendProject(project);
    $('#new-project').val('');
  }
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

async function savePalette(e) {
  e.preventDefault();
  if ($('#palette-name').val().length > 0) {
    $(this).animate({"color":"#3c444e"}, 1, function(){
        $(this).val('...Saving');
    });
    $(this).animate({"color":"#3c444e"}, 500, function(){
        $(this).val('Save Palette');
    });
    const newPalette = {
      name: $('#palette-name').val(),
      colors: palette.colors.map(color => color.color)
    };
    const project = $('.project-dropdown').val();
    const paletteId = await postPalette(newPalette, project);

    palette.projects[project].palettes.push({...newPalette, id: paletteId});
    appendSavedPalette(newPalette, project);
    $('#palette-name').val('');
  }
};

function appendSavedPalette(palette, project) {
  $(`.${project}`).append(
    `<li class="saved-palette" data-id=${palette.id} data-project=${project}>
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
  const { id, project } = $(this).parent().data();
  const highlightedPalette = palette.projects[project].palettes.find(color => color.id === id);
  highlightedPalette.colors.forEach((color, i) => {
    palette.colors[i].color = color;
    appendPalette();
  });
};

function removePalette() {
  const { id, project } = $(this).parent().data();
  console.log(id);
  console.log($(this).parent().data())
  const project_id = palette.projects[project].id;
  const palettes = palette.projects[project].palettes.filter(color => color.id !== id);
  palette.projects[project].palettes = palettes;
  $(`.${project}`).empty();
  palettes.forEach(color => appendSavedPalette(color, project));
  deletePalette(id, project_id);
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
  projects.forEach(async project => {
    const palettes = await populatePalettes(project.id);
    palette.projects[project.name] = {name: project.name, palettes: palettes, id: project.id};
    appendProject(project.name);
    palettes.forEach(palette => {
      appendSavedPalette(palette, project.name)
    })
  });
};

async function populatePalettes(project_id) {
  const palettes = await getPalettes(project_id);
  const paletteObjs = palettes.map(palette => {
    return {
      name: palette.name,
      id: palette.id,
      colors: [
        palette.color1,
        palette.color2,
        palette.color3,
        palette.color4,
        palette.color5,
      ]
    }
  })
  return Promise.all(paletteObjs);
}

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
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

async function getPalettes(project_id) {
  const url = `/api/v1/projects/${project_id}/palettes`;

  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.log(error);
  };
}

async function postPalette(savedPalette, project) {
  const project_id = palette.projects[project].id;
  const paletteObj = {
    name: savedPalette.name,
    color1: savedPalette.colors[0],
    color2: savedPalette.colors[1],
    color3: savedPalette.colors[2],
    color4: savedPalette.colors[3],
    color5: savedPalette.colors[4]
  };

  const url = `/api/v1/projects/${project_id}/palette`;
  const options = {
    method: 'POST',
    body: JSON.stringify(paletteObj),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await fetch(url, options);
    return response.json();
  } catch (error) {
    console.log(error)
  }
};

function deletePalette(paletteId, project_id) {
  const url = `/api/v1/projects/${project_id}/palette/${paletteId}`;
  const options = {
    method: 'DELETE'
  }

  try {
    fetch(url, options);
  } catch (error) {
    console.log(error)
  }
}




