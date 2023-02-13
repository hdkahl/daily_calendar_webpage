let box = document.querySelector('.square');
let width1 = box.offsetWidth;
let height = box.clientHeight;
console.log({width1});
let r = document.querySelector(':root');
r.style.setProperty('--cell-width',width1+"px");

function myFunction_get() {
    // Get the styles (properties and values) for the root
    let rs = getComputedStyle(r);
    // Alert the value of the --blue variable
    alert("The value of --cell-width is: " + rs.getPropertyValue('--cell-width'));
}
// let cells = document.getElementsByClassName('.cell');
// for (let i = 0; i< cells.length; i++){
//
//     cells.item(i).style.setProperty('--cel-width',width);
// }

let last_cell_x = 0;
let last_cell_y = 0;
let overCalendar = false;
function mouseOverCalendar(){
    last_cell_x = event.clientX;
    last_cell_y = event.clientY;
    el = document.elementFromPoint(last_cell_x, last_cell_y);
    // last_cell_y = el.offsetTop;
    // last_cell_x = el.offsetLeft;
    console.log(el.innerHTML);
    overCalendar = true;

}








dragElement(document.getElementById("u-shape-header"));
dragElement(document.getElementById("a-shape-header"));
dragElement(document.getElementById("l-shape-header"));

// document.getElementById("a-shape").addEventListener("click",rotateShape);
let dragged = false;
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "-header")) {
    // if present, the header is where you move the DIV from:
    // alert(elmnt.id + "-header")
    document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    if(document.elementFromPoint(pos3,pos4).className.includes("cell")){
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

    document.onmouseup = snapOrRotate;
    }
    let elements = document.elementsFromPoint(pos3, pos4);
    var output= "";
    elements.forEach((elt, i) => {
        output+= elt.localName + "(" + elt.className + ")<";
    });
    console.log(output);
  }

  function elementDrag(e) {
    dragged = true;
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function snapOrRotate(e){
    if (dragged)
        snapToGrid(e);
    else
        rotateShape(e);
    closeDragElement();
  }

  function snapToGrid(e){
      if (overCalendar){
        elmnt.style.top = (elmnt.offsetTop - last_cell_y) + "px";
        elmnt.style.left = (elmnt.offsetLeft - last_cell_x) + "px";
      }
  }

  function rotateShape(e){
    // if (dragged){
    //   closeDragElement();
    //   return;
    // }
    e = e || window.event;
    // alert(elmnt.id.replace("-header",""));
    let elmnt2 = document.getElementById(elmnt.id.replace("-header",""));
    let rot = elmnt2.style.getPropertyValue("--rotation");
    // alert("YOU CLICKED IT rot=<"+ rot + ">");
    rot = parseInt(rot.replace("deg",""));
    // alert("YOU CLICKED IT rot=<"+ rot + ">");
    if (isNaN(rot)) {
        // alert("NONE");
        rot = 0;
    }
    rot = rot + 90;
    elmnt2.style.setProperty("--rotation",rot.toString()+"deg");

    // e.style.transform = "rotate(45deg)";
    // alert("YOU CLICKED IT "+ rot.toString());
    // closeDragElement()
}
  
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    dragged=false;
    overCalendar = false;
  }

}
