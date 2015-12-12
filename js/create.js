
// NSYZ
// CREATE BOUNDS AND READ HTML PAGES

//Don't be intimidated, this is just JQuery

////////////////////////////
// CANVAS //////////////////
////////////////////////////



var chromeurl = $("#Chrome-Extension-URL").attr('content');

var charac = new Image();
var rcharac = new Image();
//console.log($('#Chrome-Extension-URL').attr('content'));
charac.src = chromeurl+'css/img/spritesheet.png';
rcharac.src = chromeurl+'css/img/spritesheetr.png';


//creates a canvas to overlap the webpage where the graphics gameplay will be displayed
//sets up image source for our hero

function create_canvas(){    
    var world = document.createElement('canvas');
    world.id = 'c';
    world.height = $(document).height();
    world.width = $(document).width();
    world.style.cssText = "margin:0px;position:absolute;top:0;left:0;z-index:1;";
    document.body.appendChild(world);
    this.ctx = world.getContext("2d");
    this.bounds = new Array();
    return ctx;
}

function create_back_canvas(){
	var world2 = document.createElement('canvas');
    world2.id = 'b';
    world2.height = $(document).height();
    world2.width = $(document).width();
    world2.style.cssText = "margin:0px;position:absolute;top:0;left:0;z-index:0;";
    document.body.appendChild(world2);
	this.bctx = world2.getContext("2d");
	return bctx;
}

function themeing(){
	$('body').css('background-color','#5c94fc');
	try{
		$("body").children().removeAttr('background-color')
		.css('background-color','#5c94fc')
		.css('color','#000000');
	}catch(err){
		//console.log(err.message);
	}
	try{
		$("body").children().children().removeAttr('background-color')
		.css('background-color','#80D010')
		.css('color','#FFFFFF')
		.css('outline', '4px solid black');
	}catch(err){
		//console.log(err.message);
	}
	try{
		$("body").children().children().children().removeAttr('background-color')
		.css('background-color','#80D010')
		.css('color','#FFFFFF');
	}catch(err){
		//console.log(err.message);
	}
	//$('*').css('color', '#ffffff');
	$("head").prepend("<style type=\"text/css\">" + 
					  "@font-face {\n" +
					  "\tfont-family: \"myFont\";\n" + 
					  "\tsrc: local('?'), url('" + chromeurl+"css/fonts/minecraftia.otf" + "?raw=true') format('opentype');\n" + 
					  "}\n" + 
					  "\t*{\n" + 
					  "\tfont-family: myFont !important;\n" + 
					  "}\n" + 
					  "</style>");
	
};

//CONSTANTS
const SPEEDLIMIT = 10; //max horizontal speed
const WALKACCEL = .7; //left and right accel
const FALLINGACCEL = .35; //left and right accel while falling
const JUMPLIMIT = 10; //number of loops of jump
const WALKCYCLE = 40; //how many images are in the walk cycle

//VARIABLES
var ctx, bctx,canvas;

//used in detecting movement and frame in animation cycles
var wasDownW = false;
var wasDownA = false;
var wasDownD = false;
var wasDownSh = false;
var togg = false;

//this variable is what is used to transfer to another webpage
// updates upon contact with different links
var current_link = "";


//set image of the tile to be displayed where bounds are
var tile_img;
tile_img = new Image();
tile_img.src = chromeurl+"css/img/brick10.jpg";

var tile_img2;
tile_img2 = new Image();
tile_img2.src = chromeurl+"css/img/brickblue.jpg";

//sets canvas to match window sizes
function set_canvas(x)
{
    canvas = document.getElementById(x);
    if (canvas.width < $(document).width())
        canvas.width = $(document).width();
    if (canvas.height < $(document).height())
        canvas.height = $(document).height();
}


////////////////////////////
// READ HTML //////////////
///////////////////////////

//this is a tool to measure pixel length of strings
//NOTE: if font/size isn't consistent adjust
function create_ruler(){
    var ruler = document.createElement('span');
    ruler.id = "ruler";
    ruler.style.cssText = "visibility:hidden;white-space:nowrap;";
    document.body.appendChild(ruler);

}

create_ruler();

//returns the pixel length of a HTML elements string
function get_text_width(obj){
	
    var text = $(obj)[0].innerHTML;
    var ruler = $("#ruler")[0];
    ruler.innerHTML = text;
    return ruler.offsetWidth;
    
}

//overrides default margin values that are used if none are manually added
function do_padding(){
    var margin = $(document)[0].body.style.margin;
    if(margin == "")
		$(document)[0].body.style.margin = "0px";
    
}

do_padding();

//returns an array containing coordinates and dimensions of an object
//NOTE: height isn't nessecary using current platform style but could have other uses
function getLoc(obj){
    
    obj = "#" + obj;
    var dims = new Array();
    
    dims[0] = $(obj).position().left,
    dims[1] = $(obj).position().top;
    dims[2] = $(obj).height();
    dims[3] = $(obj).width();
    return dims;
}

//elements of these tag types will be ignored
var ignored_tags = ["SCRIPT",
					"DOCTYPE!",
					"IMG",
					"DIV"//need to check visibility
					];

//elements with these id's will be ignored			
var ignored_ids = [ "c",
					"b",
					"ruler"
					];

//generate collision data for bounds based on coordinates and dimensions of HTML elements
//NOTE: needs more CSS reading
function generate_bounds(){
	//all html elements
    var all = $("*",document.body);
		
	//center of web page used for zoom adjustments/margin issues
	var midY = $(document).height()/2;
	var midX = $(document).width()/2;
    
    for (var i = 0; i< all.length;i++){	
		// get offset of object for coordinates and dimensions
		var offset = $(all[i]).offset();

		var margin = $(document)[0].body.style.margin;

		//get margin as int value
        if(margin != "0px")
        {	
			var int_margin = parseInt(margin.substring(0,margin.length-2));
	    
	    //adjust for a bounds coordinates if margin effects it visibally 
			if(offset.left < midX)
				var x = offset.left - int_margin;
			else
				var x = offset.left + int_margin;
	   
			if(offset.top < midY)
				var y = offset.top - int_margin;
			else
				var y = offset.top + int_margin;
		}
		//this needs fixing?
		else
		{
			var x = offset.left;
			var y = offset.top;
		}


		//collision data for platforms now represents lines rather than  so height = 1
		var height = 1;
		var width = $(all[i]).outerWidth();

		//two bounds are created from an element based on it's top and bottom horizontal lines
		var lower_y = y + $(all[i]).outerHeight();
		var scale = 1;
		
		//get the elements id if there is one, this could be useful if have CSS data
		try{
			var elementID = all[i].id;
		}
		
		catch(err){
			var elementID = null;
		}

		//check if id or tag is in the ignored list
		var valid_id = ($.inArray(elementID,ignored_ids));
		
		var tag = $(all[i]).prop("tagName");
		var valid_tag = ($.inArray(tag,ignored_tags));
		
		// if element id or tag is valid continue
		if ( valid_id == -1 && valid_tag == -1){
			

			//get true string width
			if(tag == "P")
				width = get_text_width(all[i]); 	    
			
			
			//set link val as null incase not a link
			var link = null;
			if(tag == "A")			
				link = all[i].href;

			if ( width != 0){
				//instantiate both bounds
				var it = new bound(x/scale,y/scale,height/scale,width/scale,link,c,bctx);
				var ix = new bound(x/scale,lower_y/scale,height/scale,width/scale,link,c,bctx);
				bounds.push(ix);
				bounds.push(it);

			}
		}
	}
	var bottom = new bound(0,$(document).height(),1,$(document).width(),null,c,bctx);
	bounds.push(bottom);
	if ( document.URL == "ml7.stuycs.org:1999" || document.URL == "file:///home/eli/CODE/Soft-Dev/NSYZ/Examples/Homepage.html" || document.url == "www.brianyan.com/Web-Explorer"){
		var nsyz  = new bound(0,height-47,1,width,null,c,bctx);
		//console.log("NSYZ DETECTED");
	
		bounds.push(nsyz);
	}
}


/////////////////////////
// BOUNDS ///////////////
/////////////////////////
var bound = function(x,y,h,w,link,c,_ctx)
{
	
	//check length of last tile
	if (w % 4 != 0) var end_tile_length = w%4;
	else var end_tile_length = 0;
	
	//num_tiles includes the extra tile
	var num_tiles = (w - end_tile_length)/4;
	
	this.num_tiles = num_tiles;
	this.end_tile_length = end_tile_length;

    this.link = link;
    this.x=x;
    this.y=y;
    this.h=h;
    this.w=w;
    this.c = c;
    if (this.link == null)
    {
	this.c  = "#000000";
    }

    this.ctx = _ctx;

}



	
function draw_tile(x,y,img)
{
	this.bctx.drawImage(img,x,y);



}

function draw_bounds(){
		for (var i = 0; i < bounds.length; i++){
			var b = bounds[i];
			for (var j = 0; j <  b.num_tiles; j++){
				if (b.link != null)
					draw_tile(b.x+(j*4),b.y,tile_img2);
				else
					draw_tile(b.x+(j*4),b.y,tile_img);
			}
		}
}
			






bound.prototype.draw = function()
{
    this.ctx.strokeStyle = "#000000";
    // this is used for drawing blocks around the identified elements
    if(this.link != null)
	this.ctx.strokeStyle = "#FF0000";
    this.ctx.strokeRect(this.x,this.y,this.w,this.h);
}




function get_bounds(){
    // returns an array of bounds for collision
    return bounds;
    
}

function go_link()
{

    window.location.href = current_link;
}

//////////////////////////
// DISC CHARACTER //////
/////////////////////////

var disc = function(x,y,h,w,dx,dy,ax,ay,falling,slowing,c1,ctx,jumpCount,canJump,walkCounter,facing){
    this.x=x;
    this.y=y;
    this.h=h;
    this.w=w;
    this.dx=dx;
    this.dy=dy;
    this.ax=ax
    this.ay=ay;
    this.falling=falling;
    this.slowing=slowing;
    this.c1=c1;
    this.ctx=ctx;
    this.jumpCount = jumpCount;
    this.canJump = canJump;
    this.walkCounter = walkCounter;
    this.facing=facing;
}

///////////////////////
// INSTANTIATE DISC HERE
///////////////////////


disc.prototype.draw = function() {
   // console.log(d1.dy);
    this.ctx.fillStyle=this.c1;
    if(wasDownW || d1.falling){
	if(d1.dy<-14){
	    if(d1.facing==true){
		this.ctx.drawImage(charac,2*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }else{
		this.ctx.drawImage(rcharac,2*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }
	}else if(d1.dy<12){
	    if(d1.facing==true){
		this.ctx.drawImage(charac,3*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }else{
		this.ctx.drawImage(rcharac,3*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }
	}else if(d1.dy<-10){
	    if(d1.facing==true){
		this.ctx.drawImage(charac,4*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }else{
		this.ctx.drawImage(rcharac,4*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }
	}else if(d1.dy<0){
	    if(d1.facing==true){
		this.ctx.drawImage(charac,5*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }else{
		this.ctx.drawImage(rcharac,5*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }
	}else if(d1.dy>5){
	    if(d1.facing==true){
		this.ctx.drawImage(charac,6*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }else{
		this.ctx.drawImage(rcharac,6*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }
	}else if(d1.dy>10){
	    if(d1.facing==true){
		this.ctx.drawImage(charac,7*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }else{
		this.ctx.drawImage(rcharac,7*64,5*64,64,64,this.x-32,this.y-64,64,64);
	    }
	}
    }else{
	if(d1.walkCounter == 0){
	    if(d1.facing==true){
		this.ctx.drawImage(charac,0,8*64,64,64,this.x-32,this.y-64,64,64);
	    }else{
		this.ctx.drawImage(rcharac,0,8*64,64,64,this.x-32,this.y-64,64,64);
	    }
	}else if(wasDownD){
	    d1.erase();
	    switch(d1.walkCounter){
	    case 1: case 2: case 3: case 4: case 5:
		this.ctx.drawImage(charac,4*64,0,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 6: case 7: case 8: case 9:case 10:
		this.ctx.drawImage(charac,5*64,0,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 11: case 12: case 13: case 14: case 15:
		this.ctx.drawImage(charac,6*64,0,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 16: case 17: case 18: case 19: case 20:
		this.ctx.drawImage(charac,7*64,0,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 21: case 22: case 23: case 24: case 25:
		this.ctx.drawImage(charac,0*64,64,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 26: case 27: case 28: case 29: case 30:
		this.ctx.drawImage(charac,1*64,64,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 31: case 32: case 33: case 34: case 35:
		this.ctx.drawImage(charac,2*64,64,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 36: case 37: case 38: case 39:case 40:
		this.ctx.drawImage(charac,3*64,64,64,64,this.x-32,this.y-64,64,64);
		break;
	    }

	}else if(wasDownA){
	    d1.erase();
	    switch(d1.walkCounter){
	    case 1: case 2: case 3: case 4: case 5:
		this.ctx.drawImage(rcharac,4*64,0,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 6: case 7: case 8: case 9:case 10:
		this.ctx.drawImage(rcharac,5*64,0,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 11: case 12: case 13: case 14: case 15:
		this.ctx.drawImage(rcharac,6*64,0,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 16: case 17: case 18: case 19: case 20:
		this.ctx.drawImage(rcharac,7*64,0,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 21: case 22: case 23: case 24: case 25:
		this.ctx.drawImage(rcharac,0*64,64,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 26: case 27: case 28: case 29: case 30:
		this.ctx.drawImage(rcharac,1*64,64,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 31: case 32: case 33: case 34: case 35:
		this.ctx.drawImage(rcharac,2*64,64,64,64,this.x-32,this.y-64,64,64);
		break;
	    case 36: case 37: case 38: case 39:case 40:
		this.ctx.drawImage(rcharac,3*64,64,64,64,this.x-32,this.y-64,64,64);
		break;
	    }

	}
    }
    //this.ctx.fillRect(this.x-5,this.y-19,this.w+9,this.h+19);
    //this.ctx.drawImage(charac, this.x-16, this.y-32, 32, 32);
}


 /////////////
//DISC COLLISION
////////////////

disc.prototype.erase = function() {
    //this.ctx.clearRect(this.x-5,this.y-19,this.w+9,this.h+19);
    this.ctx.clearRect(0, 0, 9999, 9999);
}

disc.prototype.collideUn = function(){
    
    var listofBounds = get_bounds();
    
    for(var i = 0; i < listofBounds.length; i++){
	if((this.y + this.h + this.dy >= listofBounds[i].y) && this.y < listofBounds[i].y){
	    if ((this.x >= listofBounds[i].x) && (this.x <= listofBounds[i].x + listofBounds[i].w)){
		current_link = listofBounds[i].link;
		return listofBounds[i].y;
	    }
	    if ((this.x + this.w >= listofBounds[i].x) && (this.x + this.w <= listofBounds[i].x + listofBounds[i].w)){
		current_link = listofBounds[i].link;
		return listofBounds[i].y;
	    }
	}
	if((this.y + this.h + this.dy >= listofBounds[i].y + listofBounds[i].h) && (this.y < listofBounds[i].y + listofBounds[i].h)){
	    if ((this.x >= listofBounds[i].x) && (this.x <= listofBounds[i].x + listofBounds[i].w)){
		
		current_link = listofBounds[i].link;
		return listofBounds[i].y+listofBounds[i].h;
		
			
	    }
	    if ((this.x + this.w >= listofBounds[i].x) && (this.x + this.w <= listofBounds[i].x + listofBounds[i].w)){
		
		current_link = listofBounds[i].link;
		return listofBounds[i].y+listofBounds[i].h;
	    
	    }
	    
	}
    }
    return false;
}



disc.prototype.collideR = function(){
    var listofBounds = get_bounds();


    for(var i = 0;i<listofBounds.length;i++){
	if ((this.y >= listofBounds[i].y) &&
	    (this.y + this.h <= listofBounds[i].y + listofBounds[i].h)){
	    if((this.x + this.w + this.dx >= listofBounds[i].x) &&
	       (this.x + this.w <= listofBounds[i].x)){
		return listofBounds[i].x;
	    }else if(((this.x + this.w + this.dx) >= (listofBounds[i].x + listofBounds[i].w)) && 
		     ((this.x + this.w) <= (listofBounds[i].x + listofBounds[i].w))){
		return listofBounds[i].x + listofBounds[i].w;
	    }}}

    return false;
}

disc.prototype.collideL = function(){
    var listofBounds = get_bounds();

    for(var i = 0; i<listofBounds.length;i++){
	if ((this.y >= listofBounds[i].y) && 
	    (this.y + this.h-19 <= listofBounds[i].y + listofBounds[i].h)){
	    if((this.x + this.dx <= listofBounds[i].x + listofBounds[i].w) && 
	       (this.x >= listofBounds[i].x + listofBounds[i].w)){
		return listofBounds[i].x + listofBounds[i].w;
	    }else if((this.x + this.dx <= listofBounds[i].x) &&
		     (this.x >= listofBounds[i].x)){
		return listofBounds[i].x;
	    }}}
    return false;
}


///////////////////////
///MOVEMENT ///////////
///////////////////////


$(document).keydown(
    function(e) {
	//console.log(e.keyCode);
	if (e.keyCode == 16){
	    wasDownSh=true;
	}
	

	if (e.keyCode == 68 
	    && d1.x != canvas.width-d1.w 
	    && !d1.collideR()){
	    if(!wasDownD){
		if(d1.dx<0){
		    d1.dx = 0;
		}
		wasDownD=true;
		d1.facing=true;
	    }
	}
	
	if (e.keyCode == 65 
	    && d1.x !=0 
	    && !d1.collideL()){
	    if(!wasDownA){
		if(d1.dx>0){
		    d1.dx = 0;
		    
		}
	    }
	    wasDownA=true;
	    d1.facing=false;
	}
	
	if (e.keyCode == 87){
	    if(!wasDownW){
		if(d1.canJump){
		    d1.dy=-1;
		    wasDownW=true;
		}
	    }
	}
	
	if (e.keyCode == 81){
	    if(togg){
			togg=false;
			bctx.clearRect(0,0,bctx.canvas.width,bctx.canvas.height)
	    }else{
			draw_bounds();
			togg=true
		}
	}
	if(e.keyCode == 90)
	{
		//console.log("ZUOOO");
		if (current_link != null)
			{
				go_link();
			}
	}

	if (e.keyCode == 83){
	    if (d1.dy == 0 && d1.collideUn()){		    
		d1.dy = d1.h + 2;
		d1.falling = true;
	    }
	}
    }
);

$(document).keyup(
    function(e) {
	if(e.keyCode == 16){
	    wasDownSh=false;
	    d1.canJump = false;
	}
	if(e.keyCode == 68){
	    wasDownD=false;
	    d1.slowing=true;
	    d1.walkCounter = 0;
	}
	if(e.keyCode == 65){
	    wasDownA=false;
	    d1.slowing=true;
	    d1.walkCounter = 0;
	}
	if(e.keyCode == 87){
	    wasDownW=false;
	    d1.canJump = false;
	}});

////////////////
// ANIMATE ////
///////////////
function animate() {
    d1.erase();
	if(togg){
		//console.log("test");
	}
    //ground friction
    if(d1.slowing){
	d1.ax=-.5*(d1.dx / Math.abs(d1.dx));
	if(Math.abs(d1.dx) < 1){
	    d1.slowing = false;
	    d1.dx = 0;
	    d1.ax = 0;
	}
    }
    if (wasDownSh){
	if (d1.collideL()){
	    d1.x = d1.collideL();
	    d1.dx = 0;
	    d1.dy = 5;
	    d1.ay = 0
	 //   console.log(d1.collideL());
	}
	if (d1.collideR()){
	    d1.x = d1.collideR();
	    d1.dx = 0;
	    d1.dy = 5
	    d1.ay = 0
	    //console.log(d1.collideR());
	}
    }

    //newtonian physics
    d1.dx = d1.dx + d1.ax;
    d1.x = d1.x + d1.dx;
    d1.dy = d1.dy + d1.ay;
    d1.y = d1.y + d1.dy;
    
    //window edge detection
    if (d1.x + d1.dx >= canvas.width && d1.dx > 0){
	d1.dx = 0;
	d1.ax = 0;
	d1.x = canvas.width-d1.w;
    }
    if (d1.x + d1.dx <= 0 && d1.dx < 0){
	d1.dx = 0;
	d1.ax = 0;
	d1.x = 0;
    }
    if (d1.y >= canvas.height-d1.h && d1.dy > 0){
	d1.dy = 0;
	d1.y = canvas.height-d1.h;
	d1.falling=false;
	d1.jump=0;
	d1.canJump=true;
    }
    if ((d1.x <= 0) || d1.x >= canvas.width) {
	d1.dx = 0 - d1.dx;
    }
    if (d1.y >= canvas.height) {
	d1.dy = 0;
	d1.jump=0;
	d1.canJump=true;
    }
    
    //button states
    if(wasDownW){
	if(d1.jump<JUMPLIMIT){	
	    d1.dy=-15;
	    d1.jump = d1.jump + 1;
	}else{
	    d1.canJump = false;
	}
    }
    
    
    if(wasDownD){
	if(d1.walkCounter < WALKCYCLE){
	    d1.walkCounter = d1.walkCounter + 1;
	}else{
	    d1.walkCounter = 1;
	}
	if(d1.dx<SPEEDLIMIT && !d1.sliding){
	    if(!d1.falling){
		d1.ax=WALKACCEL;
	    }else{
		d1.ax=FALLINGACCEL;
	    }
	}else{
	    d1.ax=0;
	}
    }
    
    if(wasDownA){
	if(d1.walkCounter < WALKCYCLE){
	    d1.walkCounter = d1.walkCounter + 1;
	}else{
	    d1.walkCounter = 1;
	}
	if(d1.dx>-1*SPEEDLIMIT && !d1.sliding){
	    if(!d1.falling){
		d1.ax=-1*WALKACCEL;
	    }else{
		d1.ax=-1*FALLINGACCEL;
	    }
	}else{
	    d1.ax = 0;
	}
    }
    /*if(wasDownSh){
      if(d1.collideL()){
      if(d1.dy<=0){
      d1.dy = -.1;
      }
      d1.dx=0;
      d1.sliding=true;
      }
      if(d1.collideR()){
      if(d1.dy<=0){
      d1.dy = -.1;
      }
      d1.dx=0;
      d1.sliding=true;
      }
      }
    */
    // the next 3 if statements deal with collision to objects on screen, still flawed
    if (d1.falling && d1.dy >= 0){
	if(d1.collideUn()){
	    d1.falling = false;
	    d1.jump=0;
	    d1.canJump=true;
	    d1.sliding=false;
	    d1.dy = 0;
	    d1.ay = 0;
	}
    }
    /*if (d1.dx < 0){
      if (d1.collideL()){
      d1.slowing = false;
      d1.dx = 0;
      d1.ax = 0;
      }
      }
      if (d1.dx > 0){
      if (d1.collideR()){
      d1.slowing = false;
      d1.dx = 0;
      d1.ax = 0;
      }
      }
    */
    
    if (!d1.collideUn()){
	d1.falling = true;
	if(d1.y<canvas.height-d1.h){
	    d1.canJump=false;
	}
	d1.ay = 1;
    }else{
	if (d1.dy <= 0){
	    d1.dy = d1.collideUn() + d1.h;
	    d1.ay = 0;
	    d1.dy = 0;
	    d1.falling = false;
	    d1.jump=0;
	    d1.canJump=true;
	    d1.sliding=false;
	}
    }
    
    d1.draw();
    //$(window).scrollTop(d1.y);
    //$(window).scrollLeft(d1.x);
}

var lim;

$(document).ready(function(){
	themeing();
		setTimeout(function(){
			ctx = create_canvas();
			bctx = create_back_canvas();
			canvas = document.getElementById("c");
			set_canvas("b");
			set_canvas("c");
			generate_bounds();
			d1 = new disc(0,0,1,1,0,0,0,5,true,false,"#000000", ctx,0,true,0,true);
			//zoom.to({x:0, y:0, height:$(window).height() / 2, width:$(window).width() /2})
			d1.draw();
			setInterval(animate,20);
		},5000);
});
