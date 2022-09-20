import * as t from 'three';
import { OrbitControls } from './vendor/OrbitControls';
import { sortByOrder } from './util/fns';
import { addPointFactory, BinStore, createBinFactory } from './bins';




interface ThreeDLineProps {
  canvas?: {
    width?: number;
    height?: number;
  }
}

export const ThreeDLine: (props: ThreeDLineProps) => any = ({canvas}) => {
  const {width, height} = canvas || {width: 500, height: 500};

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
    const material = new t.LineBasicMaterial({color: '#00ff00'});

    const points = [
      ...Object.keys(binStore.bins)
        .map((binId) => binStore.bins[binId].points)
    ]
      .flat()
      .sort(sortByOrder);


    const parsedPoints = points.map(({x, y, z}) => new t.Vector3(x, y, 10 * z));
    const geometry = new t.BufferGeometry().setFromPoints(parsedPoints);
    const line = new t.Line(geometry, material);


    scene.add(line);
    doRender();
  }



  function animate() {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

  }

  const startAnimation = () => {
    doRender();
    animate();
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
