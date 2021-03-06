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

	this.isOrtho = false;
	if ( this.isOrtho ){
		this.camera = new THREE.OrthographicCamera(window.innerWidth,0,window.innerHeight, 0, 1, 10000);
	} else {
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
		this.camera.position.z = 400;
	}

	this.scene 	= new THREE.Scene();
	this.scene.add(this.camera);

	// test element
	this.light = new THREE.DirectionalLight( 0xffffff );
	this.light.position.set( 0, 0, 1 );
	this.scene.add( this.light );

	var geometry = new THREE.CubeGeometry( 50, 50, 50 );
	var material = new THREE.MeshNormalMaterial();

	this.meshes = [];

	var numMeshes = 20;
	var div = 360 / numMeshes;
	var index = 0;
	var rad = 200;

	for ( var i =0; i < 360; i += div ){
		this.meshes[index] = new THREE.Mesh( geometry, material );
		this.scene.add( this.meshes[index] );
		this.meshes[index].position.set( Math.sin( div * i ) * rad, Math.cos( div * i ) * rad, 0);
		console.log( this.meshes[index].position.x, this.meshes[index].position.y );
		index++;
		rad *= .95;
	}
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

	// pretty much just need this for retina pros at the moment
	var mult = this.renderer.devicePixelRatio;

	if ( this.isOrtho ){
		this.camera.position.x = -x * this.world.width * mult;
		this.camera.position.y = -y * this.world.width *mult;
	} else {
		this.camera.setViewOffset( this.world.width, this.world.height, x * this.world.width, y * this.world.height, width, height);
	}
	this.renderer.setSize( width, height );
}

/**
* @override
*/
ThreeSbViewport.prototype.setWorld = function( worldWidth, worldHeight ) {
	if (!this.scene) return;

	if ( !this.isOrtho ){
		this.camera.setViewOffset( this.world.width, this.world.height, this.x * this.world.width, this.y * this.world.height, this.width, this.height);
	}
}

ThreeSbViewport.prototype.animate = function() {
	this.render();
	requestAnimationFrame( this.animate.bind(this) );
};

ThreeSbViewport.prototype.render = function() {
	for ( var i=0; i<this.meshes.length; i++){
		this.meshes[i].rotation.x = Math.sin(Date.now() * .00001 + i) * 180;
		this.meshes[i].rotation.y = Math.sin(Date.now() * .00002 + i) * 180;
	}
	//this.camera.lookAt( this.scene.position );

	this.renderer.render( this.scene, this.camera );
};