
import {Canvas,useFrame,useLoader,Suspense} from '@react-three/fiber';
import {useState,useRef,UseFrame, useLayoutEffect} from 'react';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'expo-three';
import { useAnimatedSensor, SensorType } from 'react-native-reanimated';


function TorusKnot(props){

  const [active,setActive]=useState(false)

  const mesh = useRef();

  useFrame((state,delta)=>{

    if (active){
    mesh.current.rotation.y -= delta
    mesh.current.rotation.x += delta
}

  })

  return(
  
  <mesh 
    {...props}
    ref={mesh} 
    scale={active? 0.07:0.06}
    
    onClick={(event)=>setActive(!active)}
    >

        <torusKnotGeometry  args={[8.322,1.7226,234,11,2,5]}/>
        <meshStandardMaterial color={active? 'green':'orange'}/>
      </mesh>


);
}


function Shoe(props){

  const [base,normal,rough] = useLoader(TextureLoader, [
    require('./assets/Asset Bundle/Airmax/textures/BaseColor.jpg'),
    require('./assets/Asset Bundle/Airmax/textures/Normal.jpg'),
    require('./assets/Asset Bundle/Airmax/textures/Roughness.png'),


  ]);
  const material = useLoader(MTLLoader,require('./assets/Asset Bundle/Airmax/shoe.mtl'));

  const obj = useLoader(
    OBJLoader,
    require('./assets/Asset Bundle/Airmax/shoe.obj'),
    (loader)=>{
    material.preload();
    loader.setMaterials(material);
  }
  );

  useLayoutEffect(()=>{

    obj.traverse((child)=>{
      if (child instanceof THREE.Mesh){
        child.material.map=base;
        child.material.normalMap=normal;
        child.material.roughnessMap=rough;


      }
    })



  },[obj])


  const mesh = useRef();

  useFrame((state,delta)=>{

    
    mesh.current.rotation.y += delta*0.5

    let { x, y, z } = props.animatedSensor.sensor.value;
    x = ~~(x * 100) / 5000;
    y = ~~(y * 100) / 5000;
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
    
});






  return(<mesh ref={mesh} rotation={[0.7,0,0]}>

<primitive object={obj} scale={15}/>


  </mesh>);
}



export default function App() {

  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE,{
    interval:100,
  })

  

  return (
    <Canvas>

      <ambientLight/>
      <pointLight position={[10,10,10]}/>


      
      <Shoe  animatedSensor={animatedSensor}/>


     


      

    </Canvas>
  );
}
