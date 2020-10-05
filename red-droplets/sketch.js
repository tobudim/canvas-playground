const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push({
          position: [u, v],
          radius: Math.abs(random.gaussian() * 0.003),
        });
      }
    }
    return points;
  };

  random.setSeed(43636);

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 250;

  return ({ context, width, height }) => {
    context.fillStyle = "beige";
    context.fillRect(0, 0, width, height);

    points.forEach(({ radius, position }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = "red";
      context.lineWidth = 20;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
