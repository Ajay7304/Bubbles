var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var circleRadius = 30;
var lineLength = 200;
var lineHeight = 4;
var speed = 15;
var animate = false;
var clickedCircleIndexNo = -1; // Index of the circle that was clicked

function centerElements() {
  // Center the header
  var canvasHeaderName = document.getElementById("headerName");
  canvasHeaderName.style.textAlign = "center";
  canvasHeaderName.style.fontFamily = "Tektur";
  canvasHeaderName.style.color = "white";
  canvasHeaderName.style.fontSize = "40px";
  canvasHeaderName.style.fontWeight = "700";

  // Center the reset button
  var button = document.getElementById("button");
  button.style.position = "absolute";
  button.style.left = "46%";
  button.style.top = "86%";
  button.style.fontSize = "38px";
  button.style.fontFamily = "Tektur";
 
  // Center the canvas
  var canvas = document.getElementById("myCanvas");
  var canvasWidth = canvas.clientWidth;
  var canvasHeight = canvas.clientHeight;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var leftPos = (windowWidth - canvasWidth) / 2;
  var topPos = (windowHeight - canvasHeight) / 2;
  canvas.style.position = "absolute";
  canvas.style.left = leftPos + "px";
  canvas.style.top = topPos + "px";
  canvas.style.boxShadow = "5px 5px 10px rgba(77, 181, 255, 0.5)";
  canvas.style.backgroundColor = "lightgray";
}

var circles = [
  { x: 100, y: 70, color: "yellow" },
  { x: 100, y: 180, color: "blue" },
  { x: 100, y: 300, color: "red" },
  { x: 100, y: 420, color: "green" },
];

var lines = [
  { fromX: 1100, fromY: 70, toX: 1000, toY: 70 },
  { fromX: 1100, fromY: 180, toX: 1000, toY: 180 },
  { fromX: 1100, fromY: 300, toX: 1000, toY: 300 },
  { fromX: 1100, fromY: 420, toX: 1000, toY: 420 },
];

var colors = ["yellow", "blue", "red", "green"]; // Initial colors of the circles

function drawCircle(x, y, color) {
  var circleRadius = 40;
  context.beginPath();
  context.arc(x, y, circleRadius, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = color;
  context.fill();
  context.closePath();
}

function drawLine(fromX, fromY, toX, toY) {
  context.beginPath();
  var headlen = 10;
  var dx = toX - fromX;
  var dy = toY - fromY;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(toX, toY);
  context.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
  context.lineWidth = lineHeight;
  context.strokeStyle = "black";
  context.stroke();
}

function drawShapes() {
  for (var i = 0; i < circles.length; i++) {
    drawCircle(circles[i].x, circles[i].y, circles[i].color);
    drawLine(lines[i].fromX, lines[i].fromY, lines[i].toX, lines[i].toY);
  }
}

centerElements();
drawShapes();

function resetLines() {
  for (var i = 0; i < circles.length; i++) {
    lines[i].fromX = 1100;
    lines[i].toX = 1000;
    circles[i].color = colors[i];
  }
  animate = false;
  clickedCircleIndexNo = -1;
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawShapes();
}

canvas.addEventListener("click", function (event) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;

  for (var i = 0; i < circles.length; i++) {
    var distanceToCircle = Math.sqrt(
      Math.pow(mouseX - circles[i].x, 2) + Math.pow(mouseY - circles[i].y, 2)
    );
    if (distanceToCircle <= circleRadius) {
      if (!animate) {
        clickedCircleIndexNo = i;
        animate = true;
        animation();
      }
      break;
    }
  }
});

function animation() {
  if (animate && clickedCircleIndexNo !== -1) {
    var line = lines[clickedCircleIndexNo];
    var circle = circles[clickedCircleIndexNo];
    var distanceToCircle = Math.sqrt(
      Math.pow(line.fromX - circle.x, 2) + Math.pow(line.fromY - circle.y, 2)
    );

    if (distanceToCircle > circleRadius + 120) {
      var dx = circle.x - line.fromX;
      var dy = circle.y - line.fromY;
      var angle = Math.atan2(dy, dx);

      line.fromX += speed * Math.cos(angle);
      // line.fromY += speed * Math.sin(angle);

      line.toX += speed * Math.cos(angle);
      // line.toY += speed * Math.sin(angle);
    } else {
      circle.color = "gray";
      animate = false;
    }
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawShapes();

  if (animate) {
    requestAnimationFrame(animation);
  }
}
