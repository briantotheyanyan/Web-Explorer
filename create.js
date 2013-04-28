// NSYZ
// CREATE BOUNDS AND READ HTML PAGES
// 
//

//Seems deprecated or something idk
//i'll just use <script src="pathname"> in the html
//var script = document.createElement('script');
//script.src = "http://jqueryjs.googlecode.com/files/jquery-1.2.6.min.js";
//script.type = "text/javascript";

//document.getElementsByTagName('head')[0].appendChild(script);

////////////////////////////
// CANVAS //////////////////
////////////////////////////

function create_canvas()
{
    //generate a canvas that has the dimensions of the window
    //this is what will overlay the image of the background
    
    var world = document.createElement('canvas');
    world.height = window.innerHeight;
    world.width = window.innerWidth;
    document.body.appendChild(world);
    
}

function set_canvas()
{
    //set for every on resize
    canvas = document.getElementById("world");
    if (canvas.width < window.innerWidth)
        canvas.width = window.innerWidth;
    if (canvas.height < window.innerHeight)
        canvas.height = window.innerHeight;
    console.log("set_canvas");
}

////////////////////////////
// READ HTML  /////////////
///////////////////////////

function getLoc(obj)
{
   // Need an algorithim to go through number of characters
   //(including br's) and account for un-fixed width for p's

    obj = "#" + obj;
    var loc = new Array();;
    loc[0] = $(obj).position().left,
    loc[1] = $(obj).position().top;
    loc[2] = $(obj).height();
    loc[3] = $(obj).width();
    return loc;
}

function getPWidth(obj)
{
    //GET WIDTH OF TEXT ELEMENT
    var b = document.getElementById(obj).innerHTML.trim();

}


function generate_bounds()
{

    var all = $("*",document.body);

    for (var i = 0; i< all.length;i++)
    {


	var offset = $(all[i]).offset();
	var x = offset.left;
	var y = offset.top;
	var height = $(all[i]).outerHeight();
	var width = $(all[i]).outerWidth();
  

   //SCALE IS ADJUSTABLE
   var scale = 1
	if ( all[i].id != "world" && $(all[i]).prop("tagName") != "SCRIPT")
	{

	    console.log(all[i]);

	    if($(all[i]).prop("tagName") == "P")
	    {
		//text elements have diferent width
		width = getPWidth(all[i].id);
	    }
	    var it = new bound(x/scale,y/scale,height/scale,width/scale,c,ctx);
	    if ( !(it.w == 0 || it.h == 0))// If no dimensions, don't add to bounds
		bounds.push(it);
	}
    
    }
}


/////////////////////////
// BOUNDS ///////////////
/////////////////////////

var bound = function(x,y,h,w,c,ctx)
{
    //bounds represent physical platform, for COLLISION                                          
    this.x=x;
    this.y=y;
    this.h=h;
    this.w=w;
    this.c=c;
    this.ctx=ctx;
}


bound.prototype.draw = function()
{
    // this is used for drawing blocks around the identified elements                            
    this.ctx.fillStyle = this.c;
    this.ctx.fillRect(this.x,this.y,this.w,this.h);
}

function draw_bounds(){
    //draw black squares over all elements
    //mainly for testing
    for (var i = 0; i < bounds.length; i++)
	bounds[i].draw();
}

function get_bounds(){
    // returns an array of bounds for collision
    return bounds;

}

/////////////////////////
// COLLISION ////////////
/////////////////////////

function Collide(a,b){ // a is the character, b is any DOM element on the screen
    return !(
        ((a.y + a.height) < (b.y)) ||
	    (a.y > (b.y + b.height)) ||
	    ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
    );
}

function collideUn(a,b){
 // a is the character, b is any DOM element on the screen
    if (((a.y + a.height - b.y <= 1) && (a.y + a.height - b.y >= -1)) && ((a.x > b.x)&&(a.x < b.x+b.width)))
{ 
return true;
}
return false;
}


create_canvas();
generate_bounds();
