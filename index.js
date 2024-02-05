var blobs = [];

function onStart(){

  let numberOfBlobs = 4;
  let blobsGroup = document.getElementById('blobs');

  const min_cx = 750
  const max_cx = 1250
  const min_cy = 300
  const max_cy = 500
  const min_r = 50
  const max_r = 100

  for(var i = 0; i < numberOfBlobs; i++){
    let cx = randomIntFromInterval(min_cx, max_cx);
    let cy = randomIntFromInterval(min_cy, max_cy);
    let r = randomIntFromInterval(min_r, max_r);
  
    var b = new Blob(cx, cy, r);
    blobs.push(b);
    blobsGroup.innerHTML += b.html;
  }
  
  setBlobAnimations();
}

function setBlobAnimations(){
  let blobObjects = document.querySelectorAll('.blob');
  let loop = 0;
  let radius = 10;
  let rotation = 3;
  
  var fps = 20;
  
  function step(timestamp){
      setTimeout(function(){ //throttle requestAnimationFrame to fps
        loop++;
    
        index = 0;
        blobObjects.forEach(blob => {
            blob.style.transform = "rotate("+ (rotation + index) * loop+"deg) translate("+ radius +"px, 0.1px) rotate("+(-(rotation + index) * loop)+"deg)";
            index++;
        });
  
        requestAnimationFrame(step)
      }, 1000/fps)
  }
   
  requestAnimationFrame(step)
}

function randomIntFromInterval(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}


//Drag the blobs around the screen, onload of svg add event listeners for mouse movements to svg
function dragBlobPieces(evt) {

  var svg = evt.target;
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mouseover', startPush);
  svg.addEventListener('mousemove', move);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endAll);


  //Pushing the blobs around
  var hoveredBlob = false;

  //Dragging the blobs around
  const max_piece_offset = 1.5;        //Max distance of the draggable blob from the start position it can travel (in original radius units)
  const max_original_offset = 0.1;   //Max distance of the original blob from the start position it can travel (in original radius units)
  const max_radius = 60;            //Min radius of dragable blob (% of original blob radius)
  const min_radius = 40;            //Max radius of dragable blob (% of original blob radius)
  const return_radius_transition = 0.75; //The end drag transition radius change according to the original circle
  const fps = 60;           //Fps of the return animation
  const returnTime = 0.35; //Seconds the return transition of the blobs lasts;
  const returnStartSpeed = 3; //The start speed of the return animation

  var transitioning = false;
  var dragElement = false;
  var origin_circle = {x: 0, y:0, r:0};
  var originalElement = false;
  var offset;

  function startDrag(evt) {

    //Whilst there is a transition ongoing skip this input
    if(transitioning)
      return;

    //When hovering over a blob and clicking
    if (evt.target.classList.contains('blob')) {

      //Get the hovered blob and create a new blob
      let blobsGroup = document.getElementById('blobs');
      const newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dragElement = newCircle;
      originalElement = evt.target;
      
      //Setting the original position of the circle to reset the position after the return animation
      origin_circle.x = originalElement.getAttributeNS(null, "cx");
      origin_circle.y = originalElement.getAttributeNS(null, "cy");
      origin_circle.r = originalElement.getAttributeNS(null, "r"); 
      
      //Calculate the offset between the origin of the circle and the mouse, the offset always is counted in when moving the blobs to prevent snapping
      offset = getMousePosition(evt);
      offset.x -= parseFloat(origin_circle.x);
      offset.y -= parseFloat(origin_circle.y);
      var coord = getMousePosition(evt)

      //Set the blob position using the start offset and set other properties
      dragElement.classList.add("blob");
      dragElement.setAttribute("cx",coord.x - offset.x);
      dragElement.setAttribute("cy",coord.y - offset.y);
      var random_radius = randomIntFromInterval(min_radius, max_radius)/100;
      dragElement.setAttribute("r", origin_circle.r * random_radius);

      blobsGroup.appendChild(dragElement);
    }
  }

  function startPush(evt){

    //Whilst there is a transition ongoing skip this input
    if(transitioning)
      return;
    
    if (evt.target.classList.contains('blob')) {
      hoveredBlob = evt.target;
    }
  }

  function move(evt){
    if(transitioning)
      return;

    if(dragElement){
      drag(evt);
    }
    else if(hoveredBlob){
      push(evt);
    }
  }

  function drag(evt) {    
    evt.preventDefault();
    var coord = getMousePosition(evt);
    
    //Calculate the position of the original and draggable blob
    new_piece_pos = clampOffset(coord, max_piece_offset);
    new_original_pos = clampOffset(coord, max_original_offset);
    
    //Set the new positions
    dragElement.setAttributeNS(null, "cx", new_piece_pos.x);
    dragElement.setAttributeNS(null, "cy", new_piece_pos.y);
    originalElement.setAttributeNS(null, "cx", new_original_pos.x);
    originalElement.setAttributeNS(null, "cy", new_original_pos.y);
    
  }

  function push(evt){
    var coord = getMousePosition(evt);

    origin_circle.x = hoveredBlob.getAttributeNS(null, "cx");
    origin_circle.y = hoveredBlob.getAttributeNS(null, "cy");
    origin_circle.r = hoveredBlob.getAttributeNS(null, "r"); 

    var distance = ((coord.x - origin_circle.x) ** 2 + (coord.y - origin_circle.y) ** 2)**0.5;
    if(distance > origin_circle.r){
      
    }

  }

  function endDrag() {

    //Whilst there is a transition ongoing skip this input
    if(transitioning)
      return;

    if(dragElement){
      transitioning = true;

      // //Let the originalblob and draggableblob transition to their original place
      // dragElement.style.transition = "all " +return_draggable_time+"s ease";
      // dragElement.setAttributeNS(null, "cx", origin_circle.x);
      // dragElement.setAttributeNS(null, "cy", origin_circle.y);
      // dragElement.setAttributeNS(null, "r", origin_circle.r / return_radius_transition);

      // originalElement.style.transition = "all " +return_original_time+"s ease";
      // originalElement.setAttributeNS(null, "cx", origin_circle.x);
      // originalElement.setAttributeNS(null, "cy", origin_circle.y);

      var passedTime = (1/fps) * returnStartSpeed;
      var startXDrag = parseFloat(dragElement.getAttributeNS(null,"cx"));
      var startYDrag = parseFloat(dragElement.getAttributeNS(null,"cy"));
      var startRadiusDrag = parseFloat(dragElement.getAttributeNS(null,"r"));
      var startXOrig= parseFloat(originalElement.getAttributeNS(null,"cx"));
      var startYOrig = parseFloat(originalElement.getAttributeNS(null,"cy"));

      function step(timestamp){
        setTimeout(function(){
            var time = passedTime/returnTime;
            
            if(time >= 1){
              dragElement.remove();
              dragElement = null;

              originalElement = null;

              transitioning = false;            
            }
            else{
              var newX = (startXDrag + (origin_circle.x - startXDrag) * time);
              var newY = (startYDrag + (origin_circle.y - startYDrag) * time);
              var newR = (startRadiusDrag + (origin_circle.r * return_radius_transition - startRadiusDrag) * time);
  
              dragElement.setAttributeNS(null, "cx", newX); 
              dragElement.setAttributeNS(null, "cy", newY);
              dragElement.setAttributeNS(null, "r", newR);

              newX = (startXOrig + (origin_circle.x - startXOrig) * time);
              newY = (startYOrig + (origin_circle.y - startYOrig) * time);
  
              originalElement.setAttributeNS(null, "cx", newX); 
              originalElement.setAttributeNS(null, "cy", newY);

              passedTime += 1/fps;
              requestAnimationFrame(step);
            }
          }, 1000/fps)
      }
      
      requestAnimationFrame(step)
          
  
      // //When all the blobs are back at their original place remove the draggable blob and reset all vars
      // setTimeout(function(){ 
      //   dragElement.remove();
      //   dragElement = null;
      //   originalElement = null;
        
      //   transitioning = false;
      // }, Math.max(return_draggable_time,return_original_time)*1000)
    }
  }

  function endAll(){
    endDrag();
    hoveredBlob = null;
  }
  
  function clampOffset(coord, max_offset){
    
    //Get the new position of the blob and the max distance the blob can travel
    var new_x = coord.x - offset.x;
    var new_y = coord.y - offset.y;
    var max_distance = origin_circle.r * max_offset;

    //Get the distance between the previous pos and the new position
    var distance = ((new_x - origin_circle.x) ** 2 + (new_y - origin_circle.y) ** 2)**0.5;

    //To give the effect that the further you pull the harder it gets we add the old max distance to a graph.
    //The greater the distance the more negative the exponent of e (max -1) and the more the curve flattens -> real_max becomes lower
    //Other graphs are also posible to get another effect
    var real_max_distance = (1 - Math.E ** (-distance/max_distance)) * max_distance; 
    
    //If the distance hasn't maxed out calculate the new position
    if(distance > real_max_distance){
      from_x = new_x - origin_circle.x; 
      from_x *= real_max_distance / distance; 
      new_x = parseFloat(origin_circle.x) + from_x; 
      
      from_y = new_y - origin_circle.y; 
      from_y *= real_max_distance / distance; 
      new_y = parseFloat(origin_circle.y) + from_y; 
    }

    return new_pos = {
      x: new_x,
      y: new_y
    };
  }

  
  function getMousePosition(evt) {
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }
}


function moveblobs(event) {
  let mouseX = event.clientX;
  let mouseY = event.clientY;

  let blobs = document.querySelectorAll('.blob');
  let group = document.getElementById('blobs');
  let mask = getOffset(group);

  index = 1;
  extraDelay = 0.2;

  blobs.forEach(blob => {
    let diff_cx = mouseX + blob.cx.animVal.value - mask.x;
    let diff_cy = mouseY + blob.cy.animVal.value - mask.y;

    blob.style.transition = `cx ${index}s, cy ${index}s`;
    blob.setAttributeNS(null, "cx", diff_cx);
    blob.setAttributeNS(null, "cy", diff_cy);

    index += Math.random() * extraDelay;
  });
}


function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX + rect.width / 2,
    y: rect.top + window.scrollY + rect.height / 2
  };
}


class Blob{
  #cx = 0;
  #cy = 0;
  #r = 0;
  #circle = null;
  #id = null;

  constructor(cx, cy, r){
    this.#cx = cx;
    this.#cy = cy;
    this.#r = r;
    this.#id = Math.random().toString(16).slice(2);

    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.classList.add("blob");
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute("id",this.#id);
    this.#circle = circle;
  }

  get html() {
    return this.#circle.outerHTML;
  }

}