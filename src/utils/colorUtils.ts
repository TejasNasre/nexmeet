export function getRandomGradient() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 180) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 80%, 80%), hsl(${hue2}, 80%, 80%))`;
  }
  
  export function getContrastColor(gradient: string) {
    const rgb = gradient.match(/rgb$$(\d+),\s*(\d+),\s*(\d+)$$/);
    if (rgb) {
      const [r, g, b] = rgb.slice(1).map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? '#000' : '#fff';
    }
    return '#000';
  }
  