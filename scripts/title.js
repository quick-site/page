$(document).ready(function () {
  const rotationSpeedValue = 0.005;
  const morphSpeedValue = 75;
  const processingValue = 0.8;
  const spikesValue = 0.8;
  let sphereRadiusValue = $("#text-behind").width() * 0.0007;

  let $canvas = $("#blob canvas"),
    canvas = $canvas[0],
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      context: canvas.getContext("webgl2"),
      antialias: true,
      alpha: true,
    }),
    simplex = new SimplexNoise();

  renderer.setSize($canvas.width(), $canvas.height());
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(
    45,
    $canvas.width() / $canvas.height(),
    0.1,
    1000
  );

  camera.position.z = 4;

  let geometry = new THREE.SphereGeometry(1, 128, 128);

  let material = new THREE.MeshPhongMaterial({
    color: 0xe4ecfa,
    shininess: 50,
  });

  let lightTop = new THREE.DirectionalLight(0xffffff, 0.7);
  lightTop.position.set(0, 500, 200);
  lightTop.castShadow = true;
  scene.add(lightTop);

  let lightBottom = new THREE.DirectionalLight(0xffffff, 0.25);
  lightBottom.position.set(0, -500, 400);
  lightBottom.castShadow = true;
  scene.add(lightBottom);

  let ambientLight = new THREE.AmbientLight(0x798296);
  scene.add(ambientLight);

  let sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);

  let update = () => {
    sphereRadiusValue = $("#text-behind").width() * 0.0007;
    sphere.rotation.y += rotationSpeedValue;
    let time =
        performance.now() *
        0.00001 *
        morphSpeedValue *
        Math.pow(processingValue, 3),
      spikes = spikesValue * processingValue;

    for (let i = 0; i < sphere.geometry.vertices.length; i++) {
      let p = sphere.geometry.vertices[i];
      p.normalize().multiplyScalar(
        (1 +
          0.3 *
            simplex.noise3D(p.x * spikes, p.y * spikes, p.z * spikes + time)) *
          sphereRadiusValue
      );
    }

    sphere.geometry.computeVertexNormals();
    sphere.geometry.normalsNeedUpdate = true;
    sphere.geometry.verticesNeedUpdate = true;
  };

  function animate() {
    update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
