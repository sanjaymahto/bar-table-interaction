import Grid from './grid';
import BarChart from './bar-creator';

/**
 * @description function to canvas create function and bar chart create function.
 * @param  {String} canvasId
 * @return {Object} object
 */
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

/**
 * @description To assign the myGrid() function to canvas and passing it to window object.
 */
// We need that our library is globally accesible, then we save in the window
window.canvas = myGrid();

