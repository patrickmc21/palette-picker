

const generatePalette = () => {
  const palette = [];
  for (let i = 0; i < 5; i++) {
    console.log($('.palette').children()[i].data('saved'))
    if ($('.palette').children().length > 0 && $('.palette').children()[i].data('saved')) {
      console.log($('.palette').children()[i].data('saved'))
      const color = $('.palette').children()[i].data('color');
      palette.push(`<div class="main-palette-color" style="background-color: ${color}" data-saved=${true} data-color=${color}>
          <button class="save-color">Save</button>
        </div>`)
    } else {
      const color = hexGenerator();
      palette.push(
        `<div class="main-palette-color" style="background-color: ${color}" data-saved=${false} data-color=${color}>
          <button class="save-color">Save</button>
        </div>`
      )
    }
  }
  palette.forEach(color => $('.palette').append(color))
}
generatePalette();

$('.palette').on('click', '.save-color', function() {
  $(this).parent().data('saved', !$(this).parent().data('saved'))
});

$('#new-palette').on('click', (e) => {
  e.preventDefault();
  generatePalette();
});

