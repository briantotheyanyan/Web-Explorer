var script = document.createElement('script');
script.src = '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
var all = $("*");
var canv = document.createElement('canvas');
for (var i=0; i<all.length; i++) {
    all[i].style.border = '1px solid red';    
}
