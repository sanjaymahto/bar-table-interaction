import Grid from './grid';
import BarChart from './bar-creator';

// Function to create a Grid.
function myGrid() {
  const canvasObject = {};

  let gridObj;
  let barObj;
  // Function to create a Grid.
  canvasObject.create = (canvasId) => {
    gridObj = new Grid(canvasId); // Constructor for creating new Grid
    return gridObj;
  };

  // Function to create a Grid.
  canvasObject.createBar = (canvasId) => {
    barObj = new BarChart(canvasId); // Constructor for creating new Grid
    return barObj;
  };
  return canvasObject;
}

// We need that our library is globally accesible, then we save in the window
((window) => {
  if (typeof (window.canvas) === 'undefined') {
    window.canvas = myGrid();
  }
})(window);
