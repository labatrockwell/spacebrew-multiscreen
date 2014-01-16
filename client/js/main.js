var sb = null;
var app = null;

// quick util
var getQuery = function(string, def){
	var val = window.getQueryString(string);
	if ( val == ""){
		return def;
	}
	return val;
}

$(document).ready( function(){
	// gqs is included with sb, phew!
	var x = getQuery("x",null);
	var y = getQuery("y",null);
	var width = getQuery("width",null);
	var height = getQuery("height",null);
	var rotation = getQuery("rotation",null);
	var worldWidth = getQuery("worldWidth",null);
	var worldHeight = getQuery("worldHeight",null);

	// setup app
	app = new ThreeSbViewport(x, y, width, height, rotation, worldWidth, worldHeight);
});

//2874 / 1437
//1192 / 596

/**
* @class ThreeSbViewport
* Assumes you've already included sbviewport.js
*/
var ThreeSbViewport = function( x, y, width, height, rotation, worldWidth, worldHeight ){
	// super()
	SpacebrewViewport.call(this, x,y,width,height,rotation,worldWidth,worldHeight);

	// 1 - setup webgl base elements
	this.container = document.getElementById("container");

	// 2 - setup THREE elements
	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.setClearColor( 0xffffff );
	this.container.appendChild( this.renderer.domElement );
	this.camera = new THREE.OrthographicCamera(window.innerWidth,0,window.innerHeight, 0, 1, 10000); //THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.z = 400;
	console.log( this.world );
	this.scene 	= new THREE.Scene();
	this.scene.add(this.camera);

	// test element
	this.light = new THREE.DirectionalLight( 0xffffff );
	this.light.position.set( 0, 0, 1 );
	this.scene.add( this.light );

	var geometry = new THREE.CubeGeometry( 50, 50, 50 );
	var material = new THREE.MeshNormalMaterial();

	this.testMesh = new THREE.Mesh( geometry, material );
	this.scene.add( this.testMesh );

	this.refreshViewport();

	// start render loop!
	this.animate();
};

// inherit SB viewport (object.create makes sure you only have 1x SB connection!)
ThreeSbViewport.prototype = Object.create( SpacebrewViewport.prototype );

/**
* @override
*/
ThreeSbViewport.prototype.setViewport = function(x,y,width,height,rotate) {
	if (!this.scene) return;

	console.log( x, y, width, height);

	// pretty much just need this for retina pros at the moment
	var mult = this.renderer.devicePixelRatio;
	console.log( mult)
	//this.renderer.setViewport( x * mult, y * mult, width * mult, height * mult );
	//this.renderer.setScissor( x * mult, y * mult, width * mult, height * mult );
	//this.renderer.enableScissorTest ( true );
	this.camera.position.x = -x * mult;
	this.camera.position.y = y * mult;
	//this.camera.position.x = x + width/2;
	//this.camera.position.y = y + height/2;
	this.setWorld( this.world.width, this.world.height );
}

/**
* @override
*/
ThreeSbViewport.prototype.setWorld = function( worldWidth, worldHeight ) {
	if (!this.scene) return;

	// this.camera.aspect = worldWidth / worldHeight;
	// this.camera.updateProjectionMatrix();
	// this.camera.position.set(worldWidth/2.0, worldHeight/2.0,400);
	//this.scene.position.set( worldWidth / 2.0, worldHeight/2.0,0);
}

ThreeSbViewport.prototype.animate = function() {
	this.render();
	requestAnimationFrame( this.animate.bind(this) );
};

ThreeSbViewport.prototype.render = function() {
	this.testMesh.rotation.x = Math.sin(Date.now() * .00001) * 180;
	this.testMesh.rotation.y = Math.sin(Date.now() * .00002) * 180;
	//this.camera.lookAt( this.scene.position );

	this.renderer.render( this.scene, this.camera );
};