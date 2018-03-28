import { observable, autorun } from 'mobx';
import csvToJson from './data-loader';
import drawCanvas from './table-grid';
import mergerow from './row-merger';
import mergecol from './column-merger';

/** Class representing a Grid. */
class Grid {
  /**
   *@description create a class Grid
   * @param  {String} canvasId
   */
  // initialising contructor for class Grid
  constructor(canvasId) {
    // Initialising a flag to stop the user form re-pivoting if once pivoted the Table.
    this.pivotFlag = 0;

    // Initialising a flag to stpo the user from pivoting if rowa and columns are merged.
    this.mergeFlag = 0;

    // Initializing data array
    this.data = [];

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


  /**
   *@description function to get CSV data
   * @param  {String} csv
   */
  // to convert the  CSV Data into JSON
  getData(csv) {
    // Contains JSON converted Data from CSV
    observable(this.data = JSON.parse(csvToJson(csv)));

    // AutoRun in Mobx
    autorun(() => this.render());
  }


  /**
   * @description render the Table on the Canvas
   */
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

    /**
     * @param  {} this.context
     * @param  {} this.canvas
     * @param  {} this.data
     * @param  {} this.pageCount
     */
    // calling drawBoard function.
    drawCanvas(this.context, this.canvas, this.data, this.pageCount);

    // To save the context of Canvas into Stack.
    this.context.save();
  }


  /**
   * @description Function to merge the Row of table
   * @param  {} ...rowParams
   * @return null
   */
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
      };

      observable(rowParams);
      autorun(() => mergerow(tempRowObject));
    } else {
      return 'Sorry! you have already pivoted the Table. Please Rerender the Original table to Merge Rows.';
    }

    return null;
  }


  /**
   * @description Function to merge the column of table
   * @param  {} ...colParams
   * @return null
   */
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
      };
      observable(colParams);
      autorun(() => mergecol(tempColObject));
    } else {
      return 'Sorry! you have already pivoted the Table. Please Rerender the Original table to Merge Columns.';
    }
    return null;
  }

  /**
   * @description To increment the page count
   */
  // logic to redraw the Canvas when the page is incremented
  pageIncrementCanvas() {
  // incrementing the page
    this.pageCount = this.pageCount + 1;

    // to put upper bound check on page...
    if (this.pageCount >= (this.data.length / 10)) {
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

    /**
     * @param  {} this.context
     * @param  {} this.canvas
     * @param  {} this.data
     * @param  {} this.pageCount
     */
    // calling drawBoard function and sending ghte data for the pagnation.
    drawCanvas(this.context, this.canvas, this.data, this.pageCount);
  }


  /**
   * @description Function to decrement the page of table
   */
  // logic to redraw the Canvas when the page is decremented
  pageDecrementCanvas() {
    // Decrementing the page
    this.pageCount = this.pageCount - 1;

    // to put lower bound check on page...
    if (this.pageCount <= 1) {
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

    /**
     * @param  {} this.context
     * @param  {} this.canvas
     * @param  {} this.data
     * @param  {} this.pageCount
     */
    // calling drawBoard function and sending ghte data for the pagnation.
    drawCanvas(this.context, this.canvas, this.data, this.pageCount);
  }
}

export default Grid;
