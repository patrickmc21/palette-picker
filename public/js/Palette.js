class PalettePicker {
  constructor() {
    this.colors = [];
    this.projects = {};
  }

  generatePalette() {
    for (let i = 0; i < 5; i++) {
      let color = hexGenerator();
      while (this.colors.find(hue => hue.color === color)) {
        color = hexGenerator();
      };

      const colorObject = {
        color: color,
        saved: false
      }
      this.colors.push(colorObject);
    }
  }

  updatePalette() {
    const newColors = this.colors.map(color => {
      if (color.saved) {
        return color;
      } else {
        return {
          color: hexGenerator(),
          saved: false
        }
      }
    })
    this.colors = newColors;
  }

  toggleColor(index) {
    this.colors[index].saved = !this.colors[index].saved;
  }
}