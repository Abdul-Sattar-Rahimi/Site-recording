// ===== 3D Hero Background — Three.js =====
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Particles
  const COUNT = 1800;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  const palette = [
    new THREE.Color('#6C63FF'),
    new THREE.Color('#FF6B6B'),
    new THREE.Color('#00D9A3'),
    new THREE.Color('#3A3F6E'),
  ];

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Floating torus rings
  const rings = [];
  const ringData = [
    { r: 1.2, t: 0.04, color: '#6C63FF', x: 2, y: 0.5 },
    { r: 0.8, t: 0.03, color: '#00D9A3', x: -2.5, y: -0.8 },
    { r: 0.5, t: 0.025, color: '#FF6B6B', x: 3, y: -1.5 },
  ];

  ringData.forEach(d => {
    const g = new THREE.TorusGeometry(d.r, d.t, 16, 80);
    const m = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.3, wireframe: false });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(d.x, d.y, 0);
    mesh.rotation.x = Math.PI / 4;
    scene.add(mesh);
    rings.push(mesh);
  });

  // Grid plane
  const gridHelper = new THREE.GridHelper(30, 30, 0x6C63FF, 0x1A2035);
  gridHelper.position.y = -3;
  gridHelper.material.opacity = 0.15;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize
  window.addEventListener('resize', () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    particles.rotation.y = t * 0.04 + mouseX * 0.1;
    particles.rotation.x = mouseY * 0.05;

    rings.forEach((ring, i) => {
      ring.rotation.z = t * (0.3 + i * 0.1);
      ring.rotation.x = Math.PI / 4 + Math.sin(t + i) * 0.2;
      ring.position.y = ringData[i].y + Math.sin(t + i * 1.5) * 0.3;
    });

    gridHelper.position.x = mouseX * 0.5;

    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();
