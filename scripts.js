// Global variables
let currentGridSize = 16;
let mouseDown = false;
let eraserState = false;
let redValue = 0;
let greenValue = 0;
let blueValue = 0;

// Adds a global event listener that tracks whether the left
// mouse button is being held down
listenForMouseState();

// Initialize the onHover and onClick events in the sketch area
const sketchArea = document.getElementById('sketchArea');
sketchArea.addEventListener('mouseover', onHover);
sketchArea.addEventListener('mousedown', onClick);

// Assign functions to buttons
document.getElementById("newButton").onclick = newSketchArea;
document.getElementById("eraserButton").onclick = toggleEraser;
document.getElementById("clearButton").onclick = resetPixels;
document.getElementById("saveButton").onclick = exportImage;

// Grabs the sliders and updates an output with their values
initializeSliders();

// Initialize a default grid
createSketchGrid(16);


function initializeSliders() {
  let redSlider = document.getElementById("red");
  let greenSlider = document.getElementById("green");
  let blueSlider = document.getElementById("blue");
  redSlider.oninput = function () {
    document.getElementById("redValue").innerText = `R: ${this.value}`;
    redValue = this.value;
    sketchArea.style.setProperty("box-shadow", `0px 0px 7px 7px rgb(${redValue}, ${greenValue}, ${blueValue})`)
  };
  greenSlider.oninput = function () {
    document.getElementById("greenValue").innerText = `G: ${this.value}`;
    greenValue = this.value;
    sketchArea.style.setProperty("box-shadow", `0px 0px 7px 7px rgb(${redValue}, ${greenValue}, ${blueValue})`)
  };
  blueSlider.oninput = function () {
    document.getElementById("blueValue").innerText = `B: ${this.value}`;
    blueValue = this.value;
    sketchArea.style.setProperty("box-shadow", `0px 0px 7px 7px rgb(${redValue}, ${greenValue}, ${blueValue})`)
  };
}

function listenForMouseState() {
  document.addEventListener('mousedown', (e) => {
    mouseDown = true;
  });

  document.addEventListener('mouseup', (e) => {
    mouseDown = false;
  });
}

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
    }
  }
  document.querySelectorAll('.sketchPixel').forEach(e => e.style.setProperty(
    'background-color', 'rgb(232, 232, 232)'
  ));
}

function removeSketchGrid() {
  document.querySelectorAll('.sketchPixel').forEach(e => e.remove());
  document.querySelectorAll('.row').forEach(e => e.remove());
}

function newSketchArea() {
  let gridSize = prompt("Enter resolution (1-128): ",`${currentGridSize}`);

  // Do nothing if the input is invalid
  if (gridSize === null) return;
  gridSize = parseInt(gridSize);
  if (typeof(gridSize) !== "number") return;

  // Generate a new grid
  clampInputSize();
  removeSketchGrid();
  createSketchGrid(gridSize);
  currentGridSize = gridSize;

  function clampInputSize() {
    if (gridSize > 128)
      gridSize = 128;
    if (gridSize < 1)
      gridSize = 1;
  }
}

function toggleEraser() {
  eraserState = !eraserState;
  const eraserStyle = document.querySelector("#eraserButton").style;
  if (eraserState) {
    eraserStyle.setProperty("color", "rgb(232, 232, 232)")
    eraserStyle.setProperty("background-color", "rgb(8, 8, 8)")
  } else {
    eraserStyle.setProperty("color", "yellow")
    eraserStyle.setProperty("background-color", "rgb(82, 72, 124)")
  }
}

function resetPixels() {
  if (!confirm("Are you sure?")) return;
  document.querySelectorAll('.sketchPixel').forEach(e => e.style.setProperty(
    'background-color', 'rgb(232, 232, 232)'
  ));
}

function onHover(e) {
  // We should only draw if the mouse button is down
  if (!mouseDown) return;
  if (e.target.className !== "sketchPixel") return;
  if (eraserState) {
    e.target.style.backgroundColor = "rgba(232, 232, 232, 1.0)";
    return;
  } else {
    e.target.style.backgroundColor = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
  }

}

function onClick(e) {
  if (e.target.className !== "sketchPixel") return;
  if (eraserState) {
    e.target.style.backgroundColor = "rgba(232, 232, 232, 1.0)";
    return;
  } else {
    e.target.style.backgroundColor = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
  }
}

function exportImage() {
  const link = document.createElement("a");
  const file = new Blob([composeImage()], { type: 'text/plain' })
  link.href = URL.createObjectURL(file);
  link.download = "pixel_art.ppm"
  link.click();
  URL.revokeObjectURL(link.href);
}

function composeImage() {
  let imageData = [];
  // Write the file header
  imageData.push("P3");
  imageData.push(`${currentGridSize}x${currentGridSize}`);
  imageData.push("255");
  document.querySelectorAll('.sketchPixel').forEach(e =>
    imageData.push(e.style.backgroundColor)
  );

  // Convert rgb(x,y,z) to x\n y\n z\n
  imageData = imageData.join("\r\n");
  imageData = imageData.replaceAll(",", "");
  imageData = imageData.replaceAll("r", "");
  imageData = imageData.replaceAll("g", "");
  imageData = imageData.replaceAll("b", "");
  imageData = imageData.replaceAll("(", "");
  imageData = imageData.replaceAll(")", "");
  imageData = imageData.replaceAll(" ", "\r\n");
  imageData = imageData.replaceAll("x", " ");
  return imageData;
}
