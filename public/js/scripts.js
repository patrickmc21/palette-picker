const palette = new Palette();
palette.generatePalette();

const appendPalette = () => {
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
}
appendPalette();

$('.palette').on('click', '.save-color', function() {
  const index = $(this).parent('.main-palette-color').data('index');
  palette.toggleColor(index);
});

$('#new-palette').on('click', (e) => {
  e.preventDefault();
  palette.updatePalette()
  appendPalette();
});

