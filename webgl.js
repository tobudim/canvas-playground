global.THREE = require("three");
const random = require("canvas-sketch-util/random");
const canvasSketch = require("canvas-sketch");
const palettes = require("nice-color-palettes");

const settings = {
  animate: true,
  dimensions: [1024, 1280],
  context: "webgl",
  attributes: { antialias: true },
};

const sketch = ({ context, width, height }) => {
  const renderer = new THREE.WebGLRenderer({
    context,
  });

  renderer.setClearColor("hsl(0, 0%, 95%)", 1);

  const camera = new THREE.OrthographicCamera();

  const scene = new THREE.Scene();
  const palette = random.pick(palettes);

  for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: random.pick(palette) })
    );
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.6);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight("hsl(0, 0%, 10%"));

  const light = new THREE.DirectionalLight("white", 0.5);
  light.position.set(0, 0, 4);
  scene.add(light);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      camera.aspect = viewportWidth / viewportHeight;

      const aspect = viewportWidth / viewportHeight;

      const zoom = 2;

      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      camera.near = -100;
      camera.far = 100;

      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      camera.updateProjectionMatrix();
    },
    render({ time }) {
      renderer.render(scene, camera);
    },
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
