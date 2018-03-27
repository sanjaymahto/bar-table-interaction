/**
 * @description function to create table in canvas and populate the it with data.
 * @param  {String} context
 * @param  {String} canvas
 * @param  {JSON} data
 * @param  {Number} pageCount
 */
export default function drawCanvas(context, canvas, data, pageCount) {
  // To clear the canvas before drawing or redrawing the Canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Logic to create a table
  const bw = (Object.keys(data[0]).length) * 200; // Calculating Border Width
  const bh = 440; // Calculating Border Height
  const p = 10; // margin

  // Drawing rows outline on the table...
  for (let x = 0; x <= bw; x += 200) {
    context.moveTo(0.5 + x + p, p);
    context.lineTo(0.5 + x + p, bh + p);
  }

  // Drawing column outline on the table...
  for (let y = 0; y <= bh; y += 40) {
    context.moveTo(p, 0.5 + y + p);
    context.lineTo(bw + p, 0.5 + y + p);
  }

  // Setting properties for the border lines in the table drawn
  context.strokeStyle = 'black';
  context.stroke();


  const keys = Object.keys(data[0]); // finding keys in each JSON object

  // To print the values of the Table Excluding Header...
  for (let y = 80, count = (pageCount - 1) * 10; y <= bh; y += 40) {
    for (let x = 0, keyCount = 0; x < bw; x += 200) {
      context.font = 'normal 16px Verdana';
      context.fillStyle = 'black';
      context.fillText((data[count])[keys[keyCount]], 0.5 + x + p + 5, y);
      keyCount += 1;
    }
    count += 1;
  }

  // To Print the Header...
  for (let x = 0, keyCount = 0; x < bw; x += 200) {
    context.font = 'bold 16px Verdana';
    context.fillStyle = 'black';
    context.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
    keyCount += 1;
  }

  // To clear extra rows and table in the column in canvas when table restructures.
  context.clearRect(10, bh + 11, canvas.width, canvas.height);
  context.clearRect(bw + 11, 9.5, canvas.width, canvas.height);
}
