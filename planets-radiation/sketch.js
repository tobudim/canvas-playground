const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 20;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v));
        points.push({
          color: random.pick(palette),
          position: [u, v],
          radius,
        });
      }
    }
    return points;
  };

  random.setSeed(23);

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 50;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach(({ radius, position, color }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.lineWidth = 20;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
