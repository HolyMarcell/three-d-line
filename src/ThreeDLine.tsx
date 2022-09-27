import * as t from 'three';
import { OrbitControls } from './vendor/OrbitControls';
import { sortByOrder } from './util/fns';
import { addPointFactory, BinStore, createBinFactory } from './bins';
import { BufferAttribute, Color } from 'three';
import { RenderableVertex } from 'three/examples/jsm/renderers/Projector';
import { parse } from 'ts-jest';




interface ThreeDLineProps {
  canvas?: {
    width?: number;
    height?: number;
  }
}

export const ThreeDLine: (props: ThreeDLineProps) => any = ({canvas}) => {
  const {width, height} = canvas || {width: 500, height: 500};

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


  const setup = () => {
    renderer = new t.WebGLRenderer();
    renderer.setSize(width, height);

    camera = new t.PerspectiveCamera(45, width / height, 0.1, 20000);
    camera.position.set(0, 0, 400);
    camera.lookAt(0, 0, 0);


    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

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
        .map(({x, y, z}) => new t.Vector3(x, y, 10 * z));

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
  }
}
