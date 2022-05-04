const body = document.getElementById("root");
const addBall = document.createElement("button");
const removeBall = document.createElement("button");

var ballStack = [];

function generateRandomColor() {
  const res = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + res;
}

function generateRandomID() {
  const a = Math.floor(Math.random() * 16777215).toString(16);
  const b = Math.floor(Math.random() * 16777215).toString(16);
  return a + '-' + b;
}

function generateNewBall() {
  const ball = document.createElement("div");

  ball.style.backgroundColor = generateRandomColor();
  ball.style.height = "300px";
  ball.style.width = "300px";
  ball.style.borderRadius = "50%";
  ball.style.display = "flex";
  ball.style.float = "left";
  ball.style.borderStyle = "solid"
  ball.style.borderColor = "black";
  ball.style.borderWidth = "2px";
  ball.style.margin = "0.35em";

  ball.id = generateRandomID();

  ball.onclick = () => {
    document.getElementById(ball.id).style.display = "none";
    ballStack = ballStack.filter((item) => { return item.id != ball.id })
  }

  return ball;
}


function addBallToStack() {
  const curr = generateNewBall()
  ballStack = [...ballStack, curr];
  body.appendChild(curr);
}

function removeBallFromStack() {
  const ball = ballStack[ballStack.length - 1];
  ball.style.display = "none";
  ballStack = ballStack.filter((item) => { return item.id != ball.id })
}

function setup() {
  addBall.onclick = addBallToStack;
  addBall.appendChild(document.createTextNode("+"));
  body.appendChild(addBall);
  window.onkeydown = (evt) => {
    if (evt.key === "Enter") addBallToStack();
    else if (evt.key === "Backspace" && ballStack.length > 0) removeBallFromStack();
    else console.log(evt.key)
  }
}

setup();
