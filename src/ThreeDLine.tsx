import * as t from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


interface Point3 {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface ThreeDLineProps {
  canvas: {
    width?: number;
    height?: number;
  },
  points: Point3[];
}

export const ThreeDLine: (props: ThreeDLineProps) => any = ({canvas, points}) => {
  const {width, height} = canvas || {width: 500, height: 500};

  const renderer = new t.WebGLRenderer();
  renderer.setSize( width, height );

  const camera = new t.PerspectiveCamera( 45, width / height, 0.1, 20000 );
  camera.position.set( 0, 0, 400 );
  camera.lookAt( 0, 0, 0 );


  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  const scene = new t.Scene();
  const material = new t.LineBasicMaterial( { color: "#00ff00" } );

  const parsedPoints = points.map(({x, y, z}) => new t.Vector3(x, y, 10*z));

  const geometry = new t.BufferGeometry().setFromPoints(parsedPoints);

  const line = new t.Line( geometry, material );

  scene.add(line);

  renderer.render(scene, camera);


  function animate() {
    requestAnimationFrame( animate );
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render( scene, camera );
  }
  animate();

  return renderer.domElement;

}
