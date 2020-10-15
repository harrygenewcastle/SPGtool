// Code from https://www.beyondjava.net/blog/how-to-connec]t-html-elements-with-an-arrow-using-svg/

function clearAnnotations() {
    var canvas = Array.from(document.getElementsByClassName('annotation'));
    canvas.forEach(function (x) { document.body.removeChild(x); });

    // console.log(canvas,canvas.length);
    // for(var i = 0; i < canvas.length; i++) {
    // 	console.log("Removing: " + canvas[i])
	
    // }
}

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

function createCentredSVG(x, y, radius) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 
                                       "svg");
    svg.setAttribute('id', 'svg-canvas');
    svg.setAttribute('style', 'position:absolute;top:'+ (y - radius) + 'px;left:'+ (x - radius) + 'px');
    svg.setAttribute('width', radius*2);
    svg.setAttribute('height', radius*2);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", 
		       "xmlns:xlink", 
		       "http://www.w3.org/1999/xlink");
    document.body.appendChild(svg);
    return svg;
}

function createBoxSVG(x, y, width, height, step, frame) {
    // var svg = document.getElementById("svg-canvas");
    // if (null == svg) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 
                                       "svg");
    svg.setAttribute('class', 'annotation');
    svg.setAttribute('style', 'position:absolute;top:'+ y + 'px;left:'+ x + 'px');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", 
		       "xmlns:xlink", 
		       "http://www.w3.org/1999/xlink");
    svg.setAttribute('data-step', step);
    svg.setAttribute('data-frame', frame);
    document.body.appendChild(svg);
    return svg;
}


// function drawCircle(x, y, radius, color) {
//     var svg = createCentredSVG(x, y, radius);
//     var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//     shape.setAttributeNS(null, "cx", radius);
//     shape.setAttributeNS(null, "cy", radius);
//     shape.setAttributeNS(null, "r",  radius);
//     shape.setAttributeNS(null, "fill", color);
//     svg.appendChild(shape);
// }

function findAbsolutePosition(htmlElement) {
    var x = htmlElement.offsetLeft;
    var y = htmlElement.offsetTop;
    for (var x=0, y=0, el=htmlElement; 
	 el != null; 
	 el = el.offsetParent) {
        x += el.offsetLeft;
        y += el.offsetTop;
    }
    return {
	"x": x,
	"y": y
    };
}





// Connect agent to  with an arrow Left to Right and a message on the bottom at a given step
function connectDivsTo(agent, network, color,  id, msg, step, frame) {
    var agent = document.getElementById(agent);
    var network = document.getElementById(network);

    var agentPos = findAbsolutePosition(agent);
    var x1 = agentPos.x;
    var y1 = agentPos.y;

    // We do not care of the y of the network, the arrow is always straight. 
    var networkPos = findAbsolutePosition(network);
    var x2 = networkPos.x;
    
    // We create a div for the message, the positioning will depend on the
    // positioning of the agent and network
    var box = document.createElement('div');
    // var text = document.createTextNode(msg);
    // FIXME: msg does not work in Docsy, due to div being stripped out
    box.innerHTML = '[' + id + ']';
    // box.style.position = 'absolute';
    // box.style.paddingLeft = '10px';
    // box.style.paddingRight = '10px';
    // box.style.backgroundColor = 'white'; 
    // box.style.fontSize = '14px';

    if (x1 < x2) // agent is on the left of the network 
    {
	x1 += agent.offsetWidth;
	y1 += (agent.offsetHeight / 2) + 20;
	box.setAttribute('style', 'position:absolute;padding-left:10px;padding-right:10px;font-color:red;background-color:white;font-size:14px;top:'+ (y1-10) + 'px;left:'+ (x1 + 20) + 'px');

	// box.style.left = x1 + 20;
	// box.style.top = y1 - 10;	
	var svg = createBoxSVG(x1, (y1 - 20), (x2 - x1), 40, step, frame);
	drawRightArrow(svg, color);
	
    } else {
	x2 += network.offsetWidth;
	y1 += (agent.offsetHeight / 2) + 20;
	var svg = createBoxSVG(x2, (y1 - 20), (x1 - x2), 40, step, frame);
	drawLeftArrow(svg, color);
	box.setAttribute('style', 'position:absolute;padding-left:10px;padding-right:10px;font-color:red;background-color:white;font-size:14px;top:'+ (y1-10) + 'px;left:'+ (x2 + 40) + 'px');

	// box.style.left = x2 + 40;
	// box.style.top = y1 - 10;	

    }
    
    box.setAttribute('class', 'annotation');
    box.setAttribute('data-step', step);
    box.setAttribute('data-frame', frame);
    document.body.appendChild(box); 

}


// Connect agent to  with an arrow Left to Right and a message on the bottom
function connectDivsBack(agent, network, color,  id, msg, step, frame) {
    var agent = document.getElementById(agent);
    var network = document.getElementById(network);

    var agentPos = findAbsolutePosition(agent);
    var x1 = agentPos.x;
    var y1 = agentPos.y;

    // We do not care of the y of the network, the arrow is always straight. 
    var networkPos = findAbsolutePosition(network);
    var x2 = networkPos.x;

        // We create a div for the message, the positioning will depend on the
    // positioning of the agent and network
    var box = document.createElement('div');
    // FIXME: msg does not work in Docsy, due to div being stripped out
    // var text = document.createTextNode(msg);    
    box.innerHTML = '[' + id + ']';
    // box.style.position = 'absolute';
    // box.style.paddingLeft = '10px';
    // box.style.paddingRight = '10px';
    // box.style.backgroundColor = 'white';
    // box.style.fontSize = '14px';

    
    if (x1 < x2) // agent is on the left of the network 
    {
	x1 += agent.offsetWidth;
	y1 += (agent.offsetHeight / 2) - 20;
	
	var svg = createBoxSVG(x1, (y1 - 20), (x2 - x1), 40, step, frame);
	drawLeftArrow(svg, color);
	box.setAttribute('style', 'position:absolute;padding-left:10px;padding-right:10px;font-color:red;background-color:white;font-size:14px;top:'+ (y1-10) + 'px;left:'+ (x1 + 40) + 'px');

	// box.style.left = x1 + 40;
	// box.style.top = y1 - 10;	
	
    } else {
	x2 += network.offsetWidth;
	y1 += (agent.offsetHeight / 2) - 20;
	var svg = createBoxSVG(x2, (y1 - 20), (x1 - x2), 40, step, frame);
	drawRightArrow(svg, color);
	box.setAttribute('style', 'position:absolute;padding-left:10px;padding-right:10px;font-color:red;background-color:white;font-size:14px;top:'+ (y1-10) + 'px;left:'+ (x2 + 30) + 'px');

	// box.style.left = x2 + 30;
	// box.style.top = y1 - 10;	

    }
    
    box.setAttribute('class', 'annotation');
    box.setAttribute('data-step', step);
    box.setAttribute('data-frame', frame);

    document.body.appendChild(box); 
    
}


// // Connect leftId to rightId with an arrow Left to Right and a message on the bottom
// function connectDivsRLT(leftId, rightId, color, msg) {
//     var left = document.getElementById(leftId);
//     var right = document.getElementById(rightId);
    
//     var leftPos = findAbsolutePosition(left);
//     var x1 = leftPos.x;
//     var y1 = leftPos.y;

//     x1 += left.offsetWidth;
//     y1 += (left.offsetHeight / 2) - 20;

    
//     var rightPos = findAbsolutePosition(right);
//     var x2 = rightPos.x;

     
//     var svg = createBoxSVG(x1, (y1 - 20), (x2 - x1), 40);
    
//     //drawCircle(x1, y1, 3, color);
//     //drawCircle(x2, y2, 3, color);
//     drawLeftArrow(svg, color);

//     var box = document.createElement('div');
//     var text = document.createTextNode(msg);     // Create a text node
//     box.appendChild(text);
    
//     box.style.position = 'absolute';  // position it
//     box.style.left = x1 + 40;
//     box.style.top = y1 - 25;  
//     box.setAttribute('class', 'annotation');
//     document.body.appendChild(box); // add it as last child of body elemnt
// }

// Draw an arrow with a 
function drawLeftArrow(svg, color) {
    var shape = document.createElementNS("http://www.w3.org/2000/svg", 
                                         "path");
    var width = svg.getAttribute('width');
    var height = svg.getAttribute('height');


    var path = "M 5 " + (height / 2) + " h " + (width-5);
    shape.setAttributeNS(null, "d", path);
    shape.setAttributeNS(null, "fill", "none");
    shape.setAttributeNS(null, "stroke", color);
    shape.setAttributeNS(null, "stroke-width", 3);
    // shape.setAttributeNS(null, "marker-end", "url(#markerCircle)");
    shape.setAttributeNS(null, "marker-start", "url(#markerBackArrow)");
    svg.appendChild(shape);    

}

// Draw an arrow with a 
function drawRightArrow(svg, color) {
    var shape = document.createElementNS("http://www.w3.org/2000/svg", 
                                         "path");
    var width = svg.getAttribute('width');
    var height = svg.getAttribute('height');


    var path = "M 0 " + (height / 2) + " h " + (width-25);
    shape.setAttributeNS(null, "d", path);
    shape.setAttributeNS(null, "fill", "none");
    shape.setAttributeNS(null, "stroke", color);
    shape.setAttributeNS(null, "stroke-width", 3);
    // shape.setAttributeNS(null, "marker-start", "url(#markerCircle)");
    shape.setAttributeNS(null, "marker-end", "url(#markerArrow)");
    svg.appendChild(shape);    

}

// function drawCurvedLine(svg, x1, y1, x2, y2, color, tension) {
//     var shape = document.createElementNS("http://www.w3.org/2000/svg", 
//                                          "path");
//     var delta = (x2-x1)*tension;
//     var hx1=x1+delta;
//     var hy1=y1;
//     var hx2=x2-delta;
//     var hy2=y2;
//     var path = "M "  + x1 + " " + y1 + 
// 	" C " + hx1 + " " + hy1 
// 	+ " "  + hx2 + " " + hy2 
//         + " " + x2 + " " + y2;
//     shape.setAttributeNS(null, "d", path);
//     shape.setAttributeNS(null, "fill", "none");
//     shape.setAttributeNS(null, "stroke", color);
//     shape.setAttributeNS(null, "marker-end", "url(#triangle)");
//     svg.appendChild(shape);
// }
    


// function connectDivs(leftId, rightId, color, tension) {
//     var left = document.getElementById(leftId);
//     var right = document.getElementById(rightId);
    
//     var leftPos = findAbsolutePosition(left);
//     console.log(leftPos, left.offsetWidth)
//     var x1 = leftPos.x;
//     var y1 = leftPos.y;
//     x1 += left.offsetWidth;
//     y1 += (left.offsetHeight / 2);
    
//     var rightPos = findAbsolutePosition(right);
//     console.log(rightPos);
//     var x2 = rightPos.x;
//     var y2 = rightPos.y;
//     y2 += (right.offsetHeight / 2);
    
//     var width=x2-x1;
//     var height = y2-y1;
    
//     drawCircle(x1, y1, 3, color);
//     //drawCircle(x2, y2, 3, color);
//     drawCurvedLine(x1, y1, x2, y2, color, tension);
// }

// markerInitialized = false;
 
// function createTriangleMarker() {
//   if (markerInitialized)
//     return;
//   markerInitialized = true;
//   var svg = createSVG();
//   var defs = document.createElementNS('http://www.w3.org/2000/svg',
//     'defs');
//   svg.appendChild(defs);
 
//   var marker = document.createElementNS('http://www.w3.org/2000/svg',
//     'marker');
//   marker.setAttribute('id', 'triangle');
//   marker.setAttribute('viewBox', '0 0 10 10');
//   marker.setAttribute('refX', '0');
//   marker.setAttribute('refY', '5');
//   marker.setAttribute('markerUnits', 'strokeWidth');
//   marker.setAttribute('markerWidth', '10');
//   marker.setAttribute('markerHeight', '8');
//   marker.setAttribute('orient', 'auto');
//   var path = document.createElementNS('http://www.w3.org/2000/svg',
//     'path');
//   marker.appendChild(path);
//   path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
//   defs.appendChild(marker);
// }

