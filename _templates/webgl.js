global.THREE = require("three");
const random = require("canvas-sketch-util/random");
const canvasSketch = require("canvas-sketch");
const palettes = require("nice-color-palettes");
const eases = require("eases");
const BezierEeasing = require("bezier-easing");
const glslify = require("glslify");

const settings = {
  dimensions: [512, 512],
  fps: 24,
  duration: 4,
  animate: true,
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

  const fragmentShader = glslify(`
    varying vec2 vUv;
    #pragma glslify: noise = require('glsl-noise/simplex/3d');
    uniform vec3 color;
    uniform float playhead;
    void main () {
      float offset = 0.2 * noise(vec3(vUv.xy * 5.0, playhead));
      gl_FragColor = vec4(vec3(color * vUv.x + offset), 1.0);
    }
  `);

  const vertexShader = glslify(`
    varying vec2 vUv;
    uniform float playhead;
    #pragma glslify: noise = require('glsl-noise/simplex/4d');
    void main () {
      vUv = uv;
      vec3 pos = position.xyz;
      pos += 0.05 * normal * noise(vec4(pos.xyz * 10.0, 0.0));
      pos += 0.25 * normal * noise(vec4(pos.xyz * 4.0, playhead));
      pos += 0.5 * normal * noise(vec4(pos.xyz * 1.0, 0.0));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `);

  const meshes = [];
  for (let i = 0; i < 1; i++) {
    const box = new THREE.SphereGeometry(1, 32, 32);
    const mesh = new THREE.Mesh(
      box,
      new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: {
          playhead: { value: 0 },
          color: { value: new THREE.Color(random.pick(palette)) },
        },
      })
    );
    // mesh.position.set(
    //   random.range(-1, 1),
    //   random.range(-1, 1),
    //   random.range(-1, 1)
    // );
    // mesh.scale.set(
    //   random.range(-1, 1),
    //   random.range(-1, 1),
    //   random.range(-1, 1)
    // );
    mesh.scale.multiplyScalar(0.6);
    scene.add(mesh);
    meshes.push(mesh);
  }

  scene.add(new THREE.AmbientLight("hsl(0, 0%, 10%"));

  const light = new THREE.DirectionalLight("white", 0.5);
  light.position.set(0, 0, 4);
  scene.add(light);

  const easeFn = BezierEeasing(0.67, 0.03, 0.29, 0.99);

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
    render({ playhead, time }) {
      const t = Math.sin(playhead * Math.PI * 2);
      scene.rotation.z = easeFn(t);

      meshes.forEach((mesh) => {
        mesh.material.uniforms.playhead.value = playhead;
      });
      renderer.render(scene, camera);
    },
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
