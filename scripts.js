// The sketch area has the event listener
const sketchArea = document.getElementById('sketchArea');
sketchArea.addEventListener('click', onClick);

// Initial grid
createSketchGrid(16);


function createSketchGrid(gridSize) {
  // First, we have to set the size of the pixels by
  // changing the CSS gridSize
  document.querySelector(":root").style.setProperty('--gridSize', gridSize);

  // The traditional method of creating a matrix is to
  // use a nested for loop.
  for (let i = 0; i < gridSize; i++) {
    row = document.createElement("DIV");
    sketchArea.appendChild(row);
    row.className = "row";

    for (let i = 0; i < gridSize; i++) {
      pixel = document.createElement("DIV");
      row.appendChild(pixel);
      pixel.className = "sketchPixel";
      // sketchArea.innerHTML += '<div class="sketchPixel"></div>'
    }
  }
}

function removePixels() {
  document.querySelectorAll('.sketchPixel').forEach(e => e.remove());
  document.querySelectorAll('.row').forEach(e => e.remove());
}

function resetPixels() {
  document.querySelectorAll('.sketchPixel').forEach(e => e.style.setProperty(
    'background-color', 'rgb(232, 232, 232)'
  ));
}

function onClick(e){
  console.log(e.target.className);
  if (e.target.className !== "sketchPixel") return;
  e.target.style.backgroundColor = "black";
}

function removeGridLines() {
  document.querySelectorAll(".sketchPixel").forEach(e => e.style.setProperty(
    'border-color', 'rgb(232, 232, 232)'
  ));
}

