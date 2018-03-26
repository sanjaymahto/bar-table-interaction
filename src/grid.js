import { observable, autorun } from 'mobx';
import csvToJson from './data-loader';
import drawCanvas from './table-grid';
import mergerow from './row-merger';
import mergecol from './column-merger';

class Grid {
  // initialising contructor for class Grid
  constructor(canvasId) {
    // Initialising a flag to stop the user form re-pivoting if once pivoted the Table.
    this.pivotFlag = 0;

    // Initialising a flag to stpo the user from pivoting if rowa and columns are merged.
    this.mergeFlag = 0;

    // Initializing data array
    this.data = [];

    // Defining an array to save the current state of Row
    this.previousStateArray = [];

    // Defining an array to save the current state of Column
    this.previousColumnStateArray = [];

    // Obtaining a reference to the canvas element.
    this.canvas = document.getElementById(canvasId);

    // Obtaining a 2D context from the canvas element.
    this.context = this.canvas.getContext('2d');

    // to control the transparency of the table
    this.context.globalAlpha = 1; // can be change later on by passing the parameter by User.

    // Initialisind d3 array to render a chart based on CSV data provided
    this.d3Array = [];
    this.chartArray = [];

    // Initilizing the variable for the pagination.
    this.pageCount = 1;
  }

  // to convert the  CSV Data into JSON
  getData(csv) {
    // Contains JSON converted Data from CSV
    observable(this.data = JSON.parse(csvToJson(csv)));

    // AutoRun in Mobx
    autorun(() => this.render());
  }

  // to render table in Canvas
  render() {
    // merge Flag variable
    this.mergeFlag = 0;

    // Logic to create a table
    const bw = (Object.keys(this.data[0]).length) * 200; // Calculating Border Width
    const bh = 440; // Calculating Border Height

    // to resize Canvas
    this.context.canvas.width = bw + 11;
    this.context.canvas.height = bh + 11;

    // to scale the Canvas to fit into the canvas size
    this.context.scale(0.80, 0.80);

    // calling drawBoard function.
    drawCanvas(this.context, this.canvas, this.data, this.pageCount);

    // To save the context of Canvas into Stack.
    this.context.save();
  }

  // to merge Rows...
  mergeRow(...rowParams) {
    if (this.pivotFlag === 0) {
      if (rowParams.length < 3) {
        return 'Please pass all the required Arguments';
      }
      this.mergeFlag = 1;

      const tempRowObject = {
        column: rowParams[0],
        startRow: rowParams[1],
        endRow: rowParams[2],
        context: this.context,
        canvas: this.canvas,
        data: this.data,
        previousStateArray: this.previousStateArray,
      };

      observable(rowParams);
      autorun(() => mergerow(tempRowObject));
    } else {
      return 'Sorry! you have already pivoted the Table. Please Rerender the Original table to Merge Rows.';
    }

    return null;
  }

  // to merge Columns...
  mergeColumn(...colParams) {
    if (this.pivotFlag === 0) {
      if (colParams.length < 3) {
        return 'Please pass all the required Arguments';
      }
      this.mergeFlag = 1;

      const tempColObject = {
        Row: colParams[0],
        startColumn: colParams[1],
        endColumn: colParams[2],
        context: this.context,
        canvas: this.canvas,
        data: this.data,
        previousColumnStateArray: this.previousColumnStateArray,
      };
      observable(colParams);
      autorun(() => mergecol(tempColObject));
    } else {
      return 'Sorry! you have already pivoted the Table. Please Rerender the Original table to Merge Columns.';
    }
    return null;
  }

  // logic to redraw the Canvas when the page is incremented
  pageIncrementCanvas() {
    // incrementing the page
    this.pageCount = this.pageCount + 1;

    // to put upper bound check on page...
    if (this.pageCount > (this.data.length / 10)) {
      this.pageCount = (this.data.length / 10);
    }

    // Logic to create a table
    const bw = (Object.keys(this.data[0]).length) * 200; // Calculating Border Width
    const bh = 400; // Calculating Border Height

    // to resize Canvas
    this.context.canvas.width = bw + 11;
    this.context.canvas.height = bh + 11;

    // to scale the Canvas to fit into the canvas size
    this.context.scale(0.80, 0.80);

    // calling drawBoard function and sending ghte data for the pagnation.
    drawCanvas(this.context, this.canvas, this.data, this.pageCount);
  }

  // logic to redraw the Canvas when the page is decremented
  pageDecrementCanvas() {
    // Decrementing the page
    this.pageCount = this.pageCount - 1;

    // to put lower bound check on page...
    if (this.pageCount < 1) {
      this.pageCount = 1;
    }

    // Logic to create a table
    const bw = (Object.keys(this.data[0]).length) * 200; // Calculating Border Width
    const bh = 400; // Calculating Border Height

    // to resize Canvas
    this.context.canvas.width = bw + 11;
    this.context.canvas.height = bh + 11;

    // to scale the Canvas to fit into the canvas size
    this.context.scale(0.80, 0.80);

    // calling drawBoard function and sending ghte data for the pagnation.
    drawCanvas(this.context, this.canvas, this.data, this.pageCount);
  }
}

export default Grid;