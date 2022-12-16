import * as t from 'three';
import { Color } from 'three';
import { OrbitControls } from './vendor/OrbitControls';
import { sortByOrder } from './util/fns';
import { addPointFactory, BinStore, createBinFactory } from './bins';
import Stats from './vendor/GpuStats';



interface ThreeDLineProps {
  canvas?: {
    width?: number;
    height?: number;
  },
  camera?: {

    // This moves the camera to a point in 3d-space.
    // From this point on we look at 0,0,0
    // Larger numbers are farther away from 0
    position?: {
      x: number;
      y: number;
      z: number;
    }
  }
}

export const ThreeDLine: (props: ThreeDLineProps) => any = ({canvas, ...rest}) => {
  const {width, height} = canvas || {width: 500, height: 500};
  const {position: cameraPosition} = rest?.camera || {x: 0, y: -400, z: 400};

  let isAnimating = false; // This tracks if the orbital control animation fn has been started

  const binStore: BinStore = {
    active: null,
    bins: {}
  }

  const createBin = createBinFactory(binStore);
  const addPoints = addPointFactory(binStore);


  let renderer;
  let camera;
  let controls;
  let scene;
  let stats;


  const setup = () => {
    renderer = new t.WebGLRenderer({alpha: true});
    renderer.setSize(width, height);

    camera = new t.PerspectiveCamera(45, width / height, 0.1, 20000);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(0, 0, 0);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    stats = new Stats();
    scene = new t.Scene();
  }
  setup();

  const doRender = () => {
    renderer.render(scene, camera);
  }

  const renderLine = () => {
    const binIds = Object.keys(binStore.bins);

    for(let binId of binIds) {
      const {colorGradient, color, points} = binStore.bins[binId];


      const parsedPoints = points
        .sort(sortByOrder)
        .map(({x, y, z}) => new t.Vector3(x, y, z));

      const cstart = new Color(colorGradient?.from || color);
      const cend = new Color(colorGradient?.to || color);
      const segLen = parsedPoints.length;

      const diff = [
        (cend.r - cstart.r) / segLen,
        (cend.g - cstart.g) / segLen,
        (cend.b - cstart.b) / segLen,
      ]

      const c = parsedPoints.map((_, i) => {
        return [
          cstart.r + (i * diff[0]),
          cstart.g + (i * diff[1]),
          cstart.b + (i * diff[2]),
        ]
      });

      const colors = new Float32Array(c.flat());

      const geometry = new t.BufferGeometry().setFromPoints(parsedPoints);
      geometry.setAttribute('color', new t.BufferAttribute(colors, 3));
      const material = new t.LineBasicMaterial({vertexColors: true, linewidth: 50});
      const line = new t.Line(geometry, material);
      scene.add(line);
    }


    doRender();
  }



  const animate = () => {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    stats.update();
    doRender();
  }

  const startAnimation = () => {
    if(!isAnimating) {
      animate();
      isAnimating = true;
    }
  }


  const getBins = () => {
    return binStore;
  }



  return {
    canvas: renderer?.domElement,
    startAnimation,
    createBin,
    renderLine,
    addPoints,
    getBins,
    stats,
  }
}
