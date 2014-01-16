/**
* @class SpacebrewViewport
*/
var SpacebrewViewport = function( x, y, width, height, rotation, worldWidth, worldHeight){
	this.x 			= x == null ? 0 : x;
	this.y 			= y == null ? 0 : y;
	this.width 		= width == null ? window.innerWidth : width;
	this.height 	= height == null ? window.innerHeight : height;
	this.rotation 	= rotation == null ? 0 : rotation;

	this.setViewport(x,y,width,height);

	this.world = {
		width: worldWidth == null ? window.innerWidth : worldWidth,
		height: worldHeight == null ? window.innerHeight : worldHeight
	};

	this.setWorld( this.world.width, this.world.height );

	this.setup();
};

SpacebrewViewport.prototype.setup = function() {
	// to-do: this should be some sort of lookup once we want to save settings, yes?
	this.name = this.name != null ? this.name : "Screen Client "+String(Math.round( Math.random() * 100 ));

	// setup spacebrew
	sb = new Spacebrew.Client(null, this.name);

	// sb: data about app
	sb.addPublish( "screenResX", "range", 0 );
	sb.addPublish( "screenResY", "range", 0 );
	sb.addPublish( "x", "range", this.x );
	sb.addPublish( "y", "range", this.y );
	sb.addPublish( "width", "range", this.width );
	sb.addPublish( "height", "range", this.height );
	sb.addPublish( "rotation", "range", this.rotation );
	sb.addPublish( "worldWidth", "range", this.world.width );
	sb.addPublish( "worldHeight", "range", this.world.height );

	// sb: listeners
	sb.addSubscribe( "x", "range" );
	sb.addSubscribe( "y", "range" );
	sb.addSubscribe( "width", "range" );
	sb.addSubscribe( "height", "range" );
	sb.addSubscribe( "rotation", "range" );
	sb.addSubscribe( "worldWidth", "range" );
	sb.addSubscribe( "worldHeight", "range" );

	sb.onCustomMessage = this.onCustomMessage.bind(this);
	sb.onRangeMessage = this.onCustomMessage.bind(this);

	// connect to Spacebrew
	sb.connect();
};

SpacebrewViewport.prototype.refreshViewport = function() {
	this.setViewport( this.x, this.y, this.width, this.height, this.rotate );
};

SpacebrewViewport.prototype.setViewport = function(x,y,width,height,rotate) {}

SpacebrewViewport.prototype.setWorld = function( worldWidth, worldHeight ) {}

SpacebrewViewport.prototype.onCustomMessage = function( name, value ) {
	console.log( name );
	if ( name.indexOf("world") >= 0 ){
		if ( name == "worldWidth" ){
			this.world.width = Number(value);
			this.setWorld( this.world.width, this.world.height );
		} else if ( name == "worldHeight" ){
			this.world.height = Number(value);
			this.setWorld( this.world.width, this.world.height );
		}
	} else {
		this[name] = Number(value);
		this.refreshViewport();
	}
};