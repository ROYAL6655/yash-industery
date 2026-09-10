/**
 * YASH INDUSTRIES - 3D PRECISION COMPONENT VIEWER
 * Interactive Three.js inspector for high-tolerance CNC machined socket bolt & coupling.
 */

(function () {
  'use strict';

  let scene, camera, renderer, componentGroup, boltMesh, wireframeMesh, socketMesh;
  let isWireframe = false;
  let isAutoRotating = true;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0.35, y: 0.8 };
  let currentRotation = { x: 0.35, y: 0.8 };

  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();

    // 2. Camera Setup
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Lighting - High-tech studio lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    // Platinum/Champagne key light
    const champagneLight = new THREE.DirectionalLight(0xfef3c7, 3.8);
    champagneLight.position.set(5, 6, 5);
    scene.add(champagneLight);

    // Cerulean fill light
    const blueLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    blueLight.position.set(-6, -3, 4);
    scene.add(blueLight);

    // Warm Gold rim light
    const goldLight = new THREE.PointLight(0xd4af37, 2.5, 20);
    goldLight.position.set(0, -6, -4);
    scene.add(goldLight);

    // White top specular light
    const topLight = new THREE.PointLight(0xffffff, 2.0, 15);
    topLight.position.set(0, 7, 3);
    scene.add(topLight);

    // 5. Build Procedural Precision Component
    buildComponent();

    // 6. Event Listeners
    setupInteractions();

    // 7. Animation Loop
    animate();
  }

  function buildComponent() {
    componentGroup = new THREE.Group();

    // Precision Machined Stainless Steel Material
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      metalness: 0.94,
      roughness: 0.20,
      envMapIntensity: 1.6,
    });

    const darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x263238,
      metalness: 0.95,
      roughness: 0.28,
    });

    const bronzeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.24,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });

    // --- Part A: Socket Head (Cylinder with knurls) ---
    const headGeom = new THREE.CylinderGeometry(1.4, 1.4, 1.2, 48);
    const headMesh = new THREE.Mesh(headGeom, metalMaterial);
    headMesh.position.y = 1.6;
    componentGroup.add(headMesh);

    // Chamfer ring on head top
    const chamferGeom = new THREE.CylinderGeometry(1.3, 1.4, 0.15, 48);
    const chamferMesh = new THREE.Mesh(chamferGeom, darkMetalMaterial);
    chamferMesh.position.y = 2.25;
    componentGroup.add(chamferMesh);

    // Hex Socket Cavity inside bolt head (Visualized via inverted Hex prism)
    const socketGeom = new THREE.CylinderGeometry(0.75, 0.75, 0.7, 6);
    const socketMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    socketMesh = new THREE.Mesh(socketGeom, socketMat);
    socketMesh.position.y = 1.95;
    componentGroup.add(socketMesh);

    // --- Part B: Precision Shank (Shoulder) ---
    const shankGeom = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 36);
    const shankMesh = new THREE.Mesh(shankGeom, metalMaterial);
    shankMesh.position.y = 0.4;
    componentGroup.add(shankMesh);

    // Precision Bronze Bushing / Distance Ring
    const ringGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.35, 36);
    const ringMesh = new THREE.Mesh(ringGeom, bronzeMaterial);
    ringMesh.position.y = 0.85;
    componentGroup.add(ringMesh);

    // --- Part C: Threaded Shaft (Simulated high-precision Metric threads) ---
    const threadShaftGeom = new THREE.CylinderGeometry(0.82, 0.82, 2.2, 36);
    const threadShaftMesh = new THREE.Mesh(threadShaftGeom, metalMaterial);
    threadShaftMesh.position.y = -1.25;
    componentGroup.add(threadShaftMesh);

    // Add individual thread rings along the shaft
    const numThreads = 14;
    for (let i = 0; i < numThreads; i++) {
      const threadRingGeom = new THREE.TorusGeometry(0.85, 0.045, 12, 36);
      const threadRing = new THREE.Mesh(threadRingGeom, darkMetalMaterial);
      threadRing.rotation.x = Math.PI / 2 + 0.05; // slight helix tilt
      threadRing.position.y = -0.35 - i * 0.14;
      componentGroup.add(threadRing);
    }

    // Chamfered Tip at bottom of bolt
    const tipGeom = new THREE.CylinderGeometry(0.82, 0.65, 0.25, 36);
    const tipMesh = new THREE.Mesh(tipGeom, metalMaterial);
    tipMesh.position.y = -2.42;
    componentGroup.add(tipMesh);

    // --- Part D: Wireframe Overlay (Toggleable) ---
    const wireframeGroup = new THREE.Group();
    componentGroup.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const wire = new THREE.Mesh(child.geometry, wireMat);
        wire.position.copy(child.position);
        wire.rotation.copy(child.rotation);
        wire.scale.copy(child.scale);
        wireframeGroup.add(wire);
      }
    });
    wireframeMesh = wireframeGroup;
    wireframeMesh.visible = false;
    scene.add(wireframeMesh);

    // Add main group to scene
    boltMesh = componentGroup;
    boltMesh.rotation.x = targetRotation.x;
    boltMesh.rotation.y = targetRotation.y;
    scene.add(boltMesh);
  }

  function setupInteractions() {
    // Mouse Drag Controls
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      isAutoRotating = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      updateAutoSpinButton();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.008;
      targetRotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Controls for Mobile
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        isAutoRotating = false;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        updateAutoSpinButton();
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.012;
      targetRotation.x += deltaY * 0.012;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    container.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Wireframe Toggle Button
    const wireframeBtn = document.getElementById('btn-toggle-wireframe');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        isWireframe = !isWireframe;
        boltMesh.visible = !isWireframe;
        wireframeMesh.visible = isWireframe;
        wireframeBtn.classList.toggle('active', isWireframe);
        wireframeBtn.setAttribute('aria-pressed', isWireframe);
      });
    }

    // Auto-Spin Toggle Button
    const autoSpinBtn = document.getElementById('btn-toggle-autospin');
    if (autoSpinBtn) {
      autoSpinBtn.addEventListener('click', () => {
        isAutoRotating = !isAutoRotating;
        updateAutoSpinButton();
      });
    }

    // Reset View Button
    const resetBtn = document.getElementById('btn-reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        targetRotation = { x: 0.35, y: 0.8 };
        isAutoRotating = true;
        updateAutoSpinButton();
      });
    }

    // Responsive Window Resize
    window.addEventListener('resize', onWindowResize);
  }

  function updateAutoSpinButton() {
    const autoSpinBtn = document.getElementById('btn-toggle-autospin');
    if (autoSpinBtn) {
      autoSpinBtn.classList.toggle('active', isAutoRotating);
    }
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (isAutoRotating) {
      targetRotation.y += 0.006;
    }

    // Smooth lerp rotation for high-end feel
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

    if (boltMesh) {
      boltMesh.rotation.x = currentRotation.x;
      boltMesh.rotation.y = currentRotation.y;
    }

    if (wireframeMesh) {
      wireframeMesh.rotation.x = currentRotation.x;
      wireframeMesh.rotation.y = currentRotation.y;
    }

    renderer.render(scene, camera);
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
