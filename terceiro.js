const WIDTH = 80;
const SCALE = Math.PI / 2;

function setupFormLabels() {
  const angle = $("#angle").slider("option", "value");
  const squareCount = $("#squares").slider("option", "value");

  $(`#angleLabel`).text(`Ângulo: ${angle}`);
  $(`#squaresLabel`).text(`N: ${squareCount}`);
}

function generateRandomColor() {
  const source = '0123456789abcdef';
  var result = '#';

  for (let i = 0; i < 6; i++)
    result += source[Math.floor(Math.random() * 15)];
  return result;
}

function setupFormListeners() {
  $(`#squares`).change(updateScreen);
  $(`#angle`).change(updateScreen);
  $(`input[name='squarePoint']`).change(updateScreen);
}

function updateScreen() {
  setupFormLabels();
  generateSVG();
  saveToLocalStorage();
}

function generateSVG() {
  const root = document.getElementById('root');
  root.innerHTML = '';
  const svg = makeRootSVG();

  const startingRect = makeRect(0, 0, WIDTH);
  const startingG = makeTranslateGTransform(400, 300);
  const N = $(`#squares`).slider("option", "value");

  const rest = generateStructure(1, N);

  startingG.append(startingRect);
  startingG.append(rest);
  svg.append(startingG);
  root.append(svg);
}

function calculateScale(angle) {
  // Essa parte faz a escala fazer com que a largura do quadrado seja igual à hipotenusa do triângulo gerado pelo ângulo em questão, o efeito pode ser visto melhor usando o ponto 0 
  const radians = angle * Math.PI / 180;
  if (angle <= 45)
    return 1 / Math.cos(radians);
  else return 1 / Math.sin(radians);
  // Essa parte utiliza uma escala fixa, altere à gosto
  // return 1.2; 
}

function makeGodTransform(x, y, w, a) {
  const point = parseInt($(`input[name='squarePoint']:checked`).val());
  const scale = calculateScale(a);
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  switch (point) {
    case 0:
      g.setAttributeNS(null, 'transform', `translate(${x},${y}) scale(${scale}) rotate(${a})`);
      break;
    case 1:
      g.setAttributeNS(null, 'transform', `translate(${x + w},${y}) scale(${scale}) rotate(${a})`);
      break;
    case 2:
      g.setAttributeNS(null, 'transform', `translate(${x + w},${y + w}) scale(${scale}) rotate(${a})`);
      break;
    case 3:
      g.setAttributeNS(null, 'transform', `translate(${x},${y + w}) scale(${scale}) rotate(${a})`);
      break;
  }
  return g;
}

function generateStructure(index, max) {
  const angle = $(`#angle`).slider("option", "value");
  const g = makeGodTransform(0, 0, 80, angle);
  const rect = makeRect(0, 0, 80);

  g.append(rect);
  if (index < max) {
    const prox = generateStructure(index + 1, max);
    g.append(prox);
  }

  return g;
}

function makeTranslateGTransform(x, y) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttributeNS(null, 'transform', `translate(${x},${y})`);
  return g;
}

function makeRootSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // svg.setAttributeNS(null, 'viewBox', '0 0 800 600');
  svg.setAttributeNS(null, 'width', '800');
  svg.setAttributeNS(null, 'height', '600');
  svg.setAttributeNS(null, 'style', 'border:1px solid black');
  return svg;
}

function makeRect(x, y, w) {
  console.log(`[makeRect] called with ${x}, ${y}, ${w}`);
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttributeNS(null, 'width', w);
  rect.setAttributeNS(null, 'height', w);
  rect.setAttributeNS(null, 'x', x);
  rect.setAttributeNS(null, 'y', y);
  rect.setAttributeNS(null, 'fill', generateRandomColor());
  rect.setAttributeNS(null, 'opacity', '0.7');
  return rect;
}

function setupForm() {
  const angle = localStorage.getItem('angle');
  const squares = localStorage.getItem('squares');
  const point = localStorage.getItem('point');

  console.log(`[setupForm] ${angle}, ${squares} and ${point} loaded from localStorage`)

  $("#squares").slider({
    slide: updateScreen,
    change: updateScreen,
    max: 50,
    min: 0,
    value: squares === null ? 0 : squares,
  });

  $("#angle").slider({
    slide: updateScreen,
    change: updateScreen,
    max: 90,
    min: 0,
    value: angle === null ? 0 : angle,
  });

  $(`input[name="squarePoint"][value="${point === null ? 0 : point}"]`).prop("checked", true);
  $("input[name='squarePoint']").checkboxradio();

  $(`input[name='squarePoint']`).change(updateScreen);

}

function saveToLocalStorage() {
  const angle = $(`#angle`).slider("option", "value");
  const squares = $(`#squares`).slider("option", "value");
  const startingPoint = parseInt($(`input[name='squarePoint']:checked`).val());

  console.log(`[saveToLocalStorage] storing ${angle}, ${squares} and ${startingPoint}`)

  localStorage.setItem("angle", angle);
  localStorage.setItem("squares", squares);
  localStorage.setItem("point", startingPoint);
}

function setupDraggables() {
  $(`.draggable`).draggable();
}

setupForm();
setupDraggables();
setupFormLabels();
generateSVG();
