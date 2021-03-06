import * as d3 from 'd3';
import Grid from './grid';
import transformTable from './transform-table';
import csvToJson from './data-loader';

/** @description Barchart extending Grid. */
class BarChart extends Grid {
  /**
   *@description Function to get the CSV data from user and convert it to JSON.
   * @param {*} csv
   */
  getBarData(csv) {
    // Contains JSON converted Data from CSV
    this.data = JSON.parse(csvToJson(csv));
  }
  /**
   * @description Function to filter the required Json data from Original Csv data sent.
   * @param  {JSON} JSON data
   * @function getD3Data()
   */
  // to render d3 chart from CSV data
  getD3Data() {
    const tempArray = this.data.slice();

    for (let i = 0; i < tempArray.length;) {
      let count = 1;
      const str = (tempArray[i].Name).split(' ')[0];

      for (let j = i + 1; j < tempArray.length; j += 1) {
        const compstr = (tempArray[j].Name).split(' ')[0];

        if (str.localeCompare(compstr) === 0) {
          count += 1;
          tempArray.splice(j, 1);
        }
      }
      const tempElement = {
        name: str,
        count,
      };

      this.d3Array.push(tempElement);
      tempArray.splice(0, 1);
      i = 0;
    }

    for (let i = 0, count = 0; i < this.d3Array.length;) {
      [count] = [this.d3Array[i].count];
      const str = (this.d3Array[i].name);
      for (let j = i + 1; j < this.d3Array.length; j += 1) {
        const compstr = (this.d3Array[j].name);
        if (str.localeCompare(compstr) === 0) {
          count += this.d3Array[j].count;
          this.d3Array.splice(j, 1);
        }
      }
      const tempElement = {
        name: str,
        count,
      };
      this.chartArray.push(tempElement);
      this.d3Array.splice(0, 1);
      i = 0;
    }
    // console.log('new d3 array: ', this.chartArray);
  }
  /**
   * @description function to create bar chart.
   */
  createBarChart() {
    // creating a local variable for this refrence of the Class
    const grid = this;
    const svg = d3.select('svg');
    const margin = {
      top: 20, right: 20, bottom: 30, left: 40,
    };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);


    x.domain(this.chartArray.map(d => d.name));
    y.domain([0, d3.max(this.chartArray, d => d.count)]);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('count');

    const bar = g.selectAll('.bar')
      .data(this.chartArray);
    bar.exit().remove();
    bar.enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count))
      .attr('fill', '#89B1F0')
      .on('click', function clickEvent(d, i) {
        const children = this.parentNode.childNodes;
        for (let c = 2; c < children.length - 2; c += 1) {
          if ((c - 2) === i) {
            d3.select(children[c]).attr('fill', '#684677');
          } else {
            d3.select(children[c]).attr('fill', '#89B1F0');
          }
        }
        grid.filterCanvas(d);
      })
      .on('dblclick', function doubleClickEvent() {
        d3.select(this)
          .attr('fill', '#89B1F0');
        grid.restoreCanvas();
      });

    // to add titles to the axes
    g.append('text')
      .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
      .attr('transform', `translate(${-30},${height / 2})rotate(-90)`) // text is drawn off the screen top left, move down and out and rotate
      .text('Car Variants');

    g.append('text')
      .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
      .attr('transform', `translate(${width / 2},${height + 80})`) // centre below axis
      .text('Car Companies');

    g.append('text')
      .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
      .attr('transform', `translate(${(width / 2) + (width / 4)},${height - 200})`) // centre below axis
      .style('font-size', '15px')
      .text('Click on the bars to filter the car variants');

    g.append('text')
      .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
      .attr('transform', `translate(${(width / 2) + (width / 4)},${height - 180})`) // centre below axis
      .style('font-size', '15px')
      .text('Double click on the bars to Rerender the Original Table');
  }
  /**
   * @description filtering the canvas while interacting with the bar chart.
   * @param  {object} d
   */
  // filter the Canvas
  filterCanvas(d) {
    // logic to hide the pagination tags
    const div = document.getElementById('page');
    div.style.display = 'none';

    // To clear the canvas before drawing or redrawing the Table
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // to scale the Canvas to fit into the canvas size
    this.context.scale(0.70, 0.60);

    transformTable(this.context, this.canvas, d, this.data);
  }
  /**
   * @description Function to restrore the Canvas on doubleclicking the bar
   */
  // to restore the canvas
  restoreCanvas() {
    // logic to reshow the pagination tags
    const div = document.getElementById('page');
    div.style.display = 'block';

    // making the counter zero for pagination.
    this.pageCount = 1;

    // To restore the canvas
    this.render();
  }
}

export default BarChart;

