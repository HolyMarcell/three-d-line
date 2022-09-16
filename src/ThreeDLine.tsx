import * as t from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OrbitControls } from './vendor/OrbitControls';
import { Maybe } from './util/types';


interface Point3 {
  x: number;
  y: number;
  z: number;
  order: number;
}

type Color = string;

type BinId = number;
interface ColorGradient {
  from: Color;
  to: Color;
}

interface Bin {
  id: BinId;
  points: Point3[];
  color: Color;
  colorGradient: Maybe<ColorGradient>;
}

interface ThreeDLineProps {
  canvas?: {
    width?: number;
    height?: number;
  },
  points: Point3[];
}


interface BinStore {
  bins: Bin[];
  active: BinId;
}

interface CreateBinProps {
  color?: Color;
  colorGradient?: ColorGradient;
}

type CreateBinFn = (props: CreateBinProps) => void;

export const ThreeDLine: (props: ThreeDLineProps) => any = ({canvas, points}) => {
  const {width, height} = canvas || {width: 500, height: 500};

  const binStore: BinStore = {
    active: 0,
    bins: []
  }

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

  const doRender = () => {
    renderer.render(scene, camera);
  }



  const makePoints = () => {
    const material = new t.LineBasicMaterial({color: '#00ff00'});
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
    animate();
  }


  const newBinId = () => {
    return (1 + Math.max(0, ...binStore.bins.map(({id}) => id)));
  }

  const createBin: CreateBinFn = ({color = null, colorGradient = null} = {}) => {
    const newId = newBinId();
    const newBin = {
      id: newId,
      color: color,
      colorGradient: colorGradient,
      points: []
    };

    if(color === null) {
      if(colorGradient === null) {
        newBin.color = "#00ff00"; // Lovely default green
      } else {
        newBin.color = colorGradient.from;
      }
    }

    binStore.bins = [...binStore.bins, newBin ];
    binStore.active = newId;

  }

  const getBins = () => {
    return binStore;
  }

  return {
    canvas: renderer?.domElement,
    setup,
    startAnimation,
    createBin,
    getBins,
  }
}
