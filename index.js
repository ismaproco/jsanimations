// init script
import './util/DecimalAdjustment';
import { EasingFunctions } from './util/EasingFunctions';
import './styles/style.less';

// get the canvas element using the DOM
var canvas;
var ctx;

function drawLine(ix, iy, fx, fy){
  // Make sure we don't execute when canvas isn't supported
  if (canvas.getContext){
   // Stroked triangle
   ctx.beginPath();
   ctx.moveTo(ix,iy);
   ctx.lineTo(fx,fy);
   ctx.closePath();
   ctx.stroke();
  }
}

function renderAp(x,y){
  // Make sure we don't execute when canvas isn't supported
  if (canvas.getContext){
   // Stroked triangle
   ctx.beginPath();
   ctx.moveTo(x,y);
   ctx.lineTo(x+1,y+1);
   ctx.closePath();
   ctx.stroke();
  }
}


//
var animateFlag = false;
var initTime = Date.now();  
var fs;
var initpos = {
  x:0,
  y:0
};

var cdx = { max: 100, min: 0};
var cdy = { max: 100, min: 0};

// game engine
var easex = 0, elapsedTime = 0;
var animationTime = 10000; // 10s
var distance = 500; // 400px

// figure properties
var figureElapsedTime = 0;
var figureAnimationTime = 1000;
var direction = true;

// basic animationPoint
var ap = {
  ix:400,
  iy:150,
  dx:-1,
  dy:-1,
  elapsedTime:0, 
  animationTime: 500,
  radius: 10
}


function render() {
  var ratio = ( Date.now() - initTime );
  var ix = Math.random() * (cdx.max - cdx.min) + cdx.min;
  var iy = Math.random() * (cdy.max - cdy.min) + cdy.min;
  
  var fx = Math.random() * (cdx.max - cdx.min) + cdx.min;
  var fy = Math.random() * (cdy.max - cdy.min) + cdy.min;
  
  elapsedTime = elapsedTime + ratio;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //drawShape(initpos.x || ix, initpos.y || iy , fx, fy);
  
  var linearx = distance * EasingFunctions.linear( elapsedTime / animationTime );
  var inquadx = distance * EasingFunctions.easeInQuad( elapsedTime / animationTime );
  var outquadx = distance * EasingFunctions.easeOutQuad( elapsedTime / animationTime );
  var inoutquadx = distance * EasingFunctions.easeInOutQuad( elapsedTime / animationTime );
  var cubicx = distance * EasingFunctions.easeInCubic( elapsedTime / animationTime );
  
  if(elapsedTime > animationTime) {
    //reset  animation  values
    linearx = inquadx = outquadx = inoutquadx = cubicx = 0;
    elapsedTime = 0;
  }
  
  drawLine(50, 100, linearx+50, 150);
  drawLine(150, 100, inquadx+150, 150);
  drawLine(250, 100, outquadx+250, 150);
  drawLine(350, 100, inoutquadx+350, 150);
  drawLine(450, 100, cubicx+450, 150);
  
  
  var baseD = 40;
  
  // calculate animation render figure
  if( figureElapsedTime > figureAnimationTime) {
    direction = false;
  } else if( figureElapsedTime < 0 ) {
    direction = true;
  }
  
  if( direction ) {
    figureElapsedTime += ratio;
  } else {
    figureElapsedTime -= ratio;    
  }
  
  var figureAnim = 20 * EasingFunctions.easeInQuad( figureElapsedTime / figureAnimationTime );
  renderFigure( canvas.width / 2 - baseD*2, canvas.height/2 - baseD*2, baseD);
  renderFigure( canvas.width / 2 - baseD*2 + figureAnim, canvas.height/2 - baseD*2, baseD);
  
  calculatePointAnimation(ap, ratio);
  renderAp(ap.x, ap.y);
  
  /// DON'T  touch after this line
  fs.innerText = Math.round10( 1000/ratio, -2 );
  
  if(animateFlag){
    window.requestAnimationFrame(render); 
  }
  initTime = Date.now();
}

function setMousePos(x, y){
  initpos.x = x;
  initpos.y = y;
}

function renderFigure( x, y, d) {
  ctx.save();
  ctx.translate( x, y);
  var baseDistance = d;
  
  var vs = [];
  vs[0] = { x:baseDistance, y:0 };
  vs[1] = { x: 0,  y:baseDistance * 4 };
  vs[2] = { x: baseDistance * 2, y: baseDistance * 2};
  vs[3] = { x: baseDistance * 4, y: baseDistance * 4};
  vs[4] = { x: baseDistance * 3, y: 0 };
  
  // draw a line
  drawLine(vs[0].x, vs[0].y, vs[1].x, vs[1].y );
  // draw b line
  drawLine(vs[1].x, vs[1].y, vs[2].x, vs[2].y );
  
  // draw c line
  drawLine(vs[2].x, vs[2].y, vs[3].x, vs[3].y );
  
  // draw d line
  drawLine(vs[3].x, vs[3].y, vs[4].x, vs[4].y );
  
  // draw e line
  drawLine(vs[4].x, vs[4].y, vs[2].x, vs[2].y );
  
  // draw f line
  drawLine(vs[2].x, vs[2].y, vs[0].x, vs[0].y );
  
  ctx.restore();
}

var jl = {
  animationInitialPoint:{ix:0,iy:0,dx:0,dy:0,elapsedTime:0, animationTime: 0},
  animationFinalPoint:{ix:0,iy:0,dx:0,dx:0,dy:0,elapsedTime:0, animationTime: 0},
  radiusDistance:0
};

// ix, iy = initial points
// fx, fy = final point
// rd = radius distance
// dt = delta time
function renderJoinedLine( ix, iy, fx, fy, rd, dt) {
  ctx.save();
  ctx.translate( ix, iy);
  
  var vsi = {x: ix, y: iy };
  var vsf = {x: fx, y: fy };
  
  // i should calculate the time for the animation
  // go from inital point to the destination random point
  // within the rd (radius distance)
  // if the animation is complete i should calculate the new point
  // during the animation no point should be calculated
  // each point has independent values
    
  // draw a line
  drawLine(vsi.x, vsi.y, vsf.x, vsf.y );
  
  ctx.restore();
}

// is not a pure function because i don't want to waste memory
// creating and returning a diferent object
function calculatePointAnimation( animationPoint, rt) {
  var dt = 0;
  if( animationPoint.elapsedTime >= animationPoint.animationTime ){
    animationPoint.elapsedTime = 0;
    animationPoint.dx = -1;
  } else if( animationPoint.dx === -1) {
    // create the destination point for the animation
    console.log('random 1', animationPoint);
    calculateRandomPointInRadious(animationPoint);
    animationPoint.x = animationPoint.ix;
    animationPoint.y = animationPoint.iy;
    animationPoint.elapsedTime += rt;
  } else {
    dt = EasingFunctions.easeInQuad( animationPoint.elapsedTime / animationPoint.animationTime );
    // then calculate the animation using the easing functions
    animationPoint.x = animationPoint.ix + (animationPoint.dx - animationPoint.ix) * dt;
    animationPoint.y = animationPoint.iy + (animationPoint.dy - animationPoint.iy) * dt; 
    animationPoint.elapsedTime += rt;
  }
}

function calculateRandomPointInRadious(animationPoint){
  animationPoint.dx = animationPoint.ix + getRandomIntInclusive(0, animationPoint.radius);
  animationPoint.dy = animationPoint.iy + getRandomIntInclusive(0, animationPoint.radius);
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



// execute after the application is loaded
window.onload = function(){
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  
  fs = document.querySelector('.fs');
  canvas = document.getElementById('mycanvas');
  // use getContext to use the canvas for drawing
  ctx = canvas.getContext('2d');
  
  cdx.max = canvas.width = window.innerWidth;
  cdy.max = canvas.height = window.innerHeight;
  
  render();  
  
  document.querySelector('.btnStart').addEventListener('click', function(){
    if( !animateFlag ) {
      animateFlag = true;
      initTime = Date.now();
      render();   
    }
  });
  
  document.querySelector('.btnStop').addEventListener('click', function(){
    console.log('stop');
    animateFlag = false;
  });
  
  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    setMousePos( mousePos.x, mousePos.y );
  }, false);
}