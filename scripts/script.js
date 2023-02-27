let box = document.querySelector('.square');
let width1 = box.offsetWidth;
let height = box.clientHeight;
console.log({width1});
let r = document.querySelector(':root');
r.style.setProperty('--cell-width', width1 + "px");

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
let offset_x = 0;
let offset_y = 0;
let overCalendar = false;

function mouseOverCalendar() {
    last_cell_x = event.clientX;
    last_cell_y = event.clientY;
    el = document.elementFromPoint(last_cell_x, last_cell_y);
    // last_cell_y = el.offsetTop;
    // last_cell_x = el.offsetLeft;
    console.log(el.innerHTML);
    overCalendar = true;

}
function log_element_position(shape_name, el){
    let rect = el.getBoundingClientRect();
    console.log(shape_name, "N=",Math.floor(rect.top),"E=", Math.floor(rect.right),"S=", Math.floor(rect.bottom),"W=", Math.floor(rect.left));
    console.log(shape_name,"offset_left=", el.offsetLeft, "offset_top=",el.offsetTop);

}


dragElement(document.getElementById("u-shape-header"));
dragElement(document.getElementById("a-shape-header"));
dragElement(document.getElementById("l-shape-header"));
dragElement(document.getElementById("r-shape-header"));

// document.getElementById("a-shape").addEventListener("click",rotateShape);
let dragged = false;

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
        // if present, the header is where you move the DIV from:
        // alert(elmnt.id + "-header")
        console.log("adding event to header element");
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        let e2 = document.getElementById(elmnt.id.replace("-header", ""));
        e2.onmousedown = dragMouseDown;
        // elmnt.onmousedown = dragMouseDown;
    }

    function findClosestCalendarSquare(x, y) {
        let elements = document.elementsFromPoint(x, y);
        var output = "";
        let cell_x = 0, cell_y = 0;
        let cell_class = elmnt.id.substring(0,1) + "Cell"
        overCalendar = false;
        const closestCalendarSquare = {overCalendar: false, x_coord: 0, y_coord: 0};
        elements.forEach((elt, i) => {
            output += elt.localName + "(" + elt.className + ")<";
            if (elt.className.includes("calSquare") && elt.localName == "div") {
                console.log("calSquare=", elt.innerHTML, ", (", elt.offsetLeft, ",", elt.offsetTop, ")");
                overCalendar = true;
                closestCalendarSquare.x_coord = elt.offsetLeft;
                closestCalendarSquare.y_coord = elt.offsetTop;
                last_cell_x = elt.offsetLeft; //- Math.floor(width1/2);
                last_cell_y = elt.offsetTop;
                let rect = elt.getBoundingClientRect();
                log_element_position("CAl_SQUARE",elt);
                last_cell_x = Math.floor(rect.left);
                last_cell_y = Math.floor(rect.top);
                // last_cell_x = elt.getBoundingClientRect()['left']; //- Math.floor(width1/2);
                // last_cell_y = elt.getBoundingClientRect()['top'];
                // console.log("unadjusted x=" + last_cell_x + ", y=" + last_cell_y);
                // return true;
            }
            if (elt.className.includes(cell_class)) {
                console.log("cellOffsets=", elt.offsetLeft, ",", elt.offsetTop);
                get_offset_by_rotation(elt.offsetLeft, elt.offsetTop);
                // offset_x = elt.offsetLeft;
                // offset_y = elt.offsetTop;
                let rect = elt.getBoundingClientRect();
                cell_x = Math.floor(rect.left);
                cell_y = Math.floor(rect.top);

            }
        });

        // console.log(output);
        offset_x = cell_x - last_cell_x;
        offset_y = cell_y - last_cell_y;
        return overCalendar;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        if (document.elementFromPoint(pos3, pos4).className.includes("cell")) {
            // call a function whenever the cursor moves:
            // elmnt.parentElement.append(elmnt);
            document.onmousemove = elementDrag;

            document.onmouseup = snapOrRotate;

        }
        else {
            let elements = document.elementsFromPoint(pos3, pos4);
            elements.forEach((elt, i) => {
                console.log(elt.className);
                if (elt.className.includes("cell")){
                    elmnt = elements[i+2];
                    console.log("CLASS NAME",elmnt.className);
                }
            });
        }
        // let elements = document.elementsFromPoint(pos3, pos4);
        // var output= "";
        // elements.forEach((elt, i) => {
        //     output+= elt.localName + "(" + elt.className + ")<";
        // });
        // console.log(output);
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

    function snapOrRotate(e) {
        if (dragged)
            snapToGrid(e);
        else
            rotateShape(e);
        closeDragElement();
    }

    function snapToGrid(e) {
        console.log("mouse position=", pos3, ",", pos4);
        // console.log("shape pos=", elmnt.offsetLeft, ",", elmnt.offsetTop);
        log_element_position("SHAPE POS", elmnt);
        let rect = elmnt.getBoundingClientRect();
        // console.log("top=",rect.top,"right=", rect.right,"bot=", rect.bottom,"left=", rect.left);
        findClosestCalendarSquare(pos3, pos4, elmnt.id);

        console.log(overCalendar);
        if (overCalendar) {
            //   console.log("mouse position=",pos3,",",pos4);
            //   console.log("Offsets=",elmnt.offsetTop,",",elmnt.offsetLeft);
            // console.log(( last_cell_y) + "px");
            console.log("Unadjusted x, y = (", (last_cell_x) + "px,", (last_cell_y) + "px)");
            console.log("Adjusted x, y = (", (last_cell_x - offset_x) + "px,", (last_cell_y - offset_y) + "px)");
            // let adjust_x =
            // elmnt.style.top = (last_cell_y - offset_y) + "px";
            // elmnt.style.left = (last_cell_x - offset_x) + "px";
            elmnt.style.top = (elmnt.offsetTop - offset_y) + "px";
            elmnt.style.left = (elmnt.offsetLeft - offset_x) + "px";
        }
    }

    function get_offset_by_rotation(horizontal_offset, vertical_offset) {
        let rot = get_rotation(elmnt.id);
        const offsets = {offset_x: 0, offset_y: vertical_offset}
        console.log("initial offset = ", offsets);
        if (rot == 0) {
            offset_x = horizontal_offset;
            offset_y = vertical_offset;
            offsets.offset_x = horizontal_offset;
            offsets.offset_y = vertical_offset;

        } else if (rot == 90) {
            offset_x = vertical_offset;
            offset_y = horizontal_offset;
            offsets.offset_x = vertical_offset;
            offsets.offset_y = horizontal_offset;
        } else if (rot == 180) {
            offset_x = (-1) * horizontal_offset;
            offset_y = (-1) * vertical_offset;
        } else if (rot == 270) {
            offset_x = vertical_offset;
            offset_y = (-1) * horizontal_offset;
        } else {
            console.error("ROTATION OUT OF SCOPE:", rot);
        }
        console.log("adjusted offsets with rot = ", rot, offsets);

    }

    function get_rotation(element_id) {
        let elmnt2 = document.getElementById(elmnt.id.replace("-header", ""));
        let rot = elmnt2.style.getPropertyValue("--rotation");
        rot = parseInt(rot.replace("deg", ""));
        if (isNaN(rot)) {
            rot = 0;
        }
        return rot
    }

    function rotateShape(e) {
        // if (dragged){
        //   closeDragElement();
        //   return;
        // }
        e = e || window.event;
        // alert(elmnt.id.replace("-header",""));
        let elmnt2 = document.getElementById(elmnt.id.replace("-header", ""));
        let rot = get_rotation(elmnt.id)

        rot = (rot + 90) % 360;
        elmnt2.style.setProperty("--rotation", rot.toString() + "deg");

        // e.style.transform = "rotate(45deg)";
        // alert("YOU CLICKED IT "+ rot.toString());
        // closeDragElement()
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        dragged = false;
        overCalendar = false;
        console.log("DONE")
    }

}