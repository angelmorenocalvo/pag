var scene, renderer, cameras, camera, helper;
var rightLeg, leftLeg, headBlock;
var paso = false;
init();

function init(){
  scene = new THREE.Scene();
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width/height;
  cameras = [];
  
  for(let x=0; x<2; x++){
    const camera = new THREE.PerspectiveCamera( 60, aspect, 0.1, 150 );
    if (x==0){
      camera.position.set(0, 3, 15);
      helper = new THREE.CameraHelper(camera);
      scene.add(helper);
      helper.visible = false;
    }else{
      camera.position.set(-48, 0, 8);
      camera.lookAt(-25,0,-25);
    }
    
    cameras.push(camera);
  }
  
  camera = cameras[0];
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 1, 10, 6);
  scene.add(light);

  const light2 = new THREE.DirectionalLight(0xFFFFFF, 1);
  light2.position.set( 90, 10, 0);
  scene.add(light2);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls0 = new THREE.OrbitControls( cameras[0], renderer.domElement );
  
  const controls1 = new THREE.OrbitControls( cameras[1], renderer.domElement );
  controls1.target.set(0,0,5);
  controls1.update();
  controls1.enabled = false;

  var options = {
    step: function() {
      console.log("anda");
      
        //leftLeg.rotateX(-Math.PI/10);
        if(paso){
          
          paso = false;
          leftLeg.rotateX( Math.PI/12);
          leftLeg.position.set(0,0,0);

          rightLeg.rotateX( -Math.PI/8);
          rightLeg.position.set(0,0.1,0.6);
          

        }
        else{
          rightLeg.rotateX( Math.PI/12);
          rightLeg.position.set(0,0,0);

          leftLeg.rotateX( -Math.PI/12);
          leftLeg.position.set(0,0.1,0.6);
          paso = true;

          
        }
    },
      rotar_izquierda: function(){
        headBlock.rotateY(Math.PI/6);
      },
      rotar_derecha: function(){
        headBlock.rotateY(-Math.PI/6);
      }
        
    
  };
  
  const gui = new dat.GUI();
  const params = {
    camera: 'main camera',
    fov: 75,
    near: 0.1,
    far: 100
  }
  gui.add(params, 'camera', ['main camera', 'helper view'])
  .onChange( value => {
    if (value==='main camera'){
      camera = cameras[0];
      controls0.enabled = true;
      controls1.enabled = false;
      helper.visible = false;
      controls0.update();
    }else{
      camera = cameras[1];
      controls0.enabled = false;
      controls1.enabled = true;
      helper.visible = true;
      controls1.update();
    }
  });
  gui.add(params, 'fov')
    .min(20)
    .max(80)
    .step(1)
    .onChange( value => { 
    cameras[0].fov = value;
    cameras[0].updateProjectionMatrix();
    helper.update();
  });
  gui.add(params, 'near')
    .min(0.1)
    .max(20)
    .step(0.1)
    .onChange( value => { 
    cameras[0].near = value;
    cameras[0].updateProjectionMatrix();
    helper.update();
  });
  gui.add(params, 'far')
    .min(5)
    .max(100)
    .step(1)
    .onChange( value => { 
    cameras[0].far = value;
    cameras[0].updateProjectionMatrix();
    helper.update();
  });

  // Cada vez que se pulsa un boton se da un paso 
  gui.add(options, 'step');
  gui.add(options, 'rotar_izquierda');
  gui.add(options, 'rotar_derecha');


  //Add meshes here
  addBody();
  addArms();
  addLegs();
  addHead();
  addGround();


  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function addBody(){
  const geom = new THREE.CylinderGeometry( 1,1, 2);
  const mat = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  mat.map    = THREE.ImageUtils.loadTexture('texturas/bricks_texture_1010277.JPG');
  //const mat = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  box = new THREE.Mesh(geom, mat);
  box.position.set(0,2,0);
  scene.add(box);

  const assGeometry = new THREE.SphereGeometry(1, 8, 6, 0, 2*Math.PI, Math.PI/2, 0.5 * Math.PI);
  //const assMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  ass = new THREE.Mesh(assGeometry, mat);
  ass.position.set(0,1.5,0);

  scene.add(ass);



}

function addArms(){
    // Brazo derecho
  const armGeometry = new THREE.CylinderGeometry( 0.12,0.12, 1);
  const material = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  material.map    = THREE.ImageUtils.loadTexture('texturas/bricks_texture_1010277.JPG');
  arm = new THREE.Mesh(armGeometry, material);
  arm.position.set(-1.3,2.3,0);


  const elbowGeometry = new THREE.SphereGeometry(0.12, 8, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);
  //const elbowMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  elbow = new THREE.Mesh(elbowGeometry, material);
  elbow.position.set(-1.3,2.8,0);


  const handGeometry = new THREE.SphereGeometry(0.12, 8, 6, 0, 2*Math.PI, Math.PI/2, 0.5 * Math.PI);
  //const handMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  hand = new THREE.Mesh(handGeometry, material);
  hand.position.set(-1.3,1.8,0);

  const unionGeometry = new THREE.CylinderGeometry( 0.12,0.12, 0.4);
  //const unionMaterialR = new THREE.MeshStandardMaterial({color: new THREE.Color('white')});
  union = new THREE.Mesh(unionGeometry, material);
  union.rotateZ(Math.PI/2);
  union.position.set(-1,2.6,0);


  const rightArm = new THREE.Group();
  rightArm.add( arm );
  rightArm.add( hand );
  rightArm.add(elbow);
  rightArm.add(union);

  //group.rotateZ(0.2*Math.PI);
  //group.position.set(5,1.1,0);
  scene.add(rightArm);


    // Brazo Izquierdo
    armI = new THREE.Mesh(armGeometry, material);
    armI.position.set(1.3,2.3,0);
  
    elbowI = new THREE.Mesh(elbowGeometry, material);
    elbowI.position.set(1.3,2.8,0);
  
    handI = new THREE.Mesh(handGeometry, material);
    handI.position.set(1.3,1.8,0);
  
    unionI = new THREE.Mesh(unionGeometry, material);
    unionI.rotateZ(Math.PI/2);
    unionI.position.set(1,2.6,0);
  
  
    const leftArm = new THREE.Group();
    leftArm.add( armI );
    leftArm.add( handI );
    leftArm.add(elbowI);
    leftArm.add(unionI);
  
    //group.rotateZ(0.2*Math.PI);
    //group.position.set(5,1.1,0);
    scene.add(leftArm);
}

function addLegs(){
  const legGeometry = new THREE.CylinderGeometry( 0.25,0.25, 0.6);
  //const legMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('white')});
  const material = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  material.map    = THREE.ImageUtils.loadTexture('texturas/bricks_texture_1010277.JPG');
  leg = new THREE.Mesh(legGeometry, material);
  leg.position.set(-0.5,0.6,0);


  const footGeometry = new THREE.SphereGeometry(0.25, 8, 6, 0, 2*Math.PI, Math.PI/2, 0.5 * Math.PI);
  foot = new THREE.Mesh(footGeometry, material);
  foot.position.set(-0.5,0.3,0);

  rightLeg = new THREE.Group();
  rightLeg.add( leg );
  rightLeg.add( foot );

  scene.add(rightLeg);

  legL = new THREE.Mesh(legGeometry, material);
  legL.position.set(0.5,0.6,0);

  footL = new THREE.Mesh(footGeometry, material);
  footL.position.set(0.5,0.3,0);

  leftLeg = new THREE.Group();
  leftLeg.add( legL );
  leftLeg.add( footL );

  scene.add(leftLeg);



}

function addHead(){
  // Cabeza
  const headGeometry = new THREE.SphereGeometry(1, 8, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);
  const headMaterial = new  THREE.MeshPhongMaterial();
  headMaterial.map    = THREE.ImageUtils.loadTexture('texturas/verdemetal.jpg');
  //const headMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0,3.2,0);

  // boca
  const mouthGeometry = new THREE.CylinderGeometry( 0.85,0.85, 0.5);
  const mouthMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('white')});
  mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
  mouth.position.set(0,3,0);

  // Antena derecha
  const antennaGeometryR = new THREE.CylinderGeometry( 0.08,0.08, 0.6);
  //const antennaMaterialR = new THREE.MeshStandardMaterial({color: new THREE.Color('white')});
  antennaR = new THREE.Mesh(antennaGeometryR, headMaterial);
  antennaR.position.set(-0.6,4.3,0);


  const cAntennaGeometryR = new THREE.SphereGeometry(0.08, 8, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);
  //const cAntennaMaterialR = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  cAntennaR = new THREE.Mesh(cAntennaGeometryR, headMaterial);
  cAntennaR.position.set(-0.6,4.6,0);

  const group = new THREE.Group();
  group.add( antennaR );
  group.add( cAntennaR );
  //group.rotation.z = 0.3*Math.PI;
  //group.lookAt(0.7,0.7,0);
  group.rotateZ(0.2*Math.PI);
  group.position.set(2.3,1.1,0);

  // Antena derecha
  const antennaGeometryL = new THREE.CylinderGeometry( 0.08,0.08, 0.6);
  //const antennaMaterialL = new THREE.MeshStandardMaterial({color: new THREE.Color('white')});
  antennaL = new THREE.Mesh(antennaGeometryL, headMaterial);
  antennaL.position.set(0.6,4.3,0);


  const cAntennaGeometryL = new THREE.SphereGeometry(0.08, 8, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);
  //const cAntennaMaterialL = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
  cAntennaL = new THREE.Mesh(cAntennaGeometryL, headMaterial);
  cAntennaL.position.set(0.6,4.6,0);

  const group2 = new THREE.Group();
  group2.add( antennaL);
  group2.add( cAntennaL );
  //group.rotation.z = 0.3*Math.PI;
  //group.lookAt(0.7,0.7,0);
  group2.rotateZ(-0.2*Math.PI);
  group2.position.set(-2.3,1.1,0);


  const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);
  const eyeMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('white')});
  eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eye.position.set(-0.6,3.8,0.4);
  eye.lookAt(-Math.PI/2,0,Math.PI);

  eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eye2.position.set(0.6,3.8,0.4);
  eye2.lookAt(-Math.PI/2,0,Math.PI);


  headBlock = new THREE.Group();
  headBlock.add( head );
  headBlock.add( mouth );
  headBlock.add( group );
  headBlock.add( group2 );
  headBlock.add( eye );
  headBlock.add( eye2 );

  scene.add(headBlock);
}


function addGround(){
  // ground
  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('texturas/stone_9290068.JPG'), depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  cameras.forEach( subcamera => subcamera.rotation.copy(camera.rotation));
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}