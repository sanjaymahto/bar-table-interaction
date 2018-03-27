/**
 * @description function to merge the columns in table.
 * @param  {} mergecolObject
 * @return null
 */
export default function mergecol(mergeColObject) {
  const {
    Row, startColumn, endColumn, context, canvas,
    data, previousColumnStateArray,
  } = mergeColObject;

  // to get the previous states...
  const stateArray = JSON.parse(sessionStorage.getItem('previousColumnState'));
  // console.log('Previous Column State array: ', stateArray);

  // to get the previous row State...
  const rowStateArray = JSON.parse(sessionStorage.getItem('previousState'));
  // console.log('Previous Row State array: ', rowStateArray);

  const bw = (Object.keys(data[0]).length) * 200; // Calculating Border Width
  const bh = (data.length + 1) * 40; // Calculating Border Height
  const p = 10; // margin


  if (rowStateArray != null) {
    for (let rowStateIndex = 0; rowStateIndex < rowStateArray.length; rowStateIndex += 1) {
      if (rowStateArray[rowStateIndex].column >= startColumn
        && rowStateArray[rowStateIndex].column <= endColumn) {
        for (let i = rowStateArray[rowStateIndex].startRow;
          i <= rowStateArray[rowStateIndex].endRow; i += 1) {
          if ((Row - 1) === i) {
            return alert('Invalid Argument Passed!');
          }
        }
      }
    }
  }


  let stateFlag = 0;

  if (stateArray != null) {
    for (let stateIndex = 0; stateIndex < stateArray.length; stateIndex += 1) {
      if (stateArray[stateIndex].row === Row) {
        if (startColumn >= stateArray[stateIndex].startColumn &&
           startColumn <= stateArray[stateIndex].endColumn) {
          stateFlag = 2;
          alert('Invalid argument passed!');
          break;
        } else if (endColumn >= stateArray[stateIndex].startColumn &&
           endColumn <= stateArray[stateIndex].endColumn) {
          stateFlag = 2;
          alert('Invalid argument passed!');
          break;
        }
      }
    }

    if (stateFlag === 0) {
      stateFlag = 1;
    }
  } else {
    stateFlag = 1;
  }


  if (stateFlag === 1 && Row <= data.length + 1 && endColumn > startColumn &&
     startColumn !== endColumn && (endColumn <= Object.keys(data[0]).length + 1)) {
    // Function to restore the Canavas...
    context.restore();

    // logic for columnSpan
    for (let y2 = 0, count = 0, a = 0, b = 0, c = 0, d = 0; y2 <= bw; y2 += 200) {
      if (count === (endColumn - startColumn)) {
        break;
      }
      if (y2 === 0) {
        a = (((startColumn) * 200) + p);
        b = ((Row - 1) * 40) + 11;
        c = 2;
        d = 39;
      }
      context.clearRect(a, b, c, d);
      a += 200;
      count += 1;
    }

    const keys = Object.keys(data[0]); // finding keys in each JSON object

    // To Print the Header...
    for (let x = 0, Count = 1; x < bw; x += 200) {
      context.font = 'bold 16px Verdana';
      context.fillStyle = 'black';
      if (Row === 1) {
        if (Count >= startColumn && Count < endColumn) {
          context.clearRect(((startColumn - 1) * 200) + 11, ((Row - 1) *
           40) + 11, 199 + ((endColumn - startColumn) * 199), 39);
          context.fillText(keys[startColumn - 1], ((startColumn *
             200) + ((Math.floor((endColumn - startColumn) / 2)) * 200)) - 100, 40 - 5);
        }
      }
      Count += 1;
    }

    // To print the values of the Table Excluding Header...
    for (let y = 80, count = 0; y <= bh; y += 40) {
      for (let x = 0, keyCount = 0; x < bw; x += 200) {
        context.font = 'normal 16px Verdana';
        context.fillStyle = 'black';
        if (count + 2 === Row) {
          if (keyCount + 1 >= startColumn && keyCount < endColumn) {
            context.clearRect(((startColumn - 1) * 200) + 11, ((Row - 1) *
             40) + 11, 199 + ((endColumn - startColumn) * 199), 39);
            context.fillText(data[Row - 2][keys[startColumn - 1]], ((startColumn *
               200) + ((Math.floor((endColumn - startColumn) / 2)) * 200)) - 100, y - 5);
          }
        }
        keyCount += 1;
      }
      count += 1;
    }

    // To clear extra rows and table in the column in canvas when table restructures.
    context.clearRect(10, bh + 11, canvas.width, canvas.height);
    context.clearRect(bw + 11, 9.5, canvas.width, canvas.height);

    // To Save the context
    context.save();

    const state = {
      row: Row,
      startColumn,
      endColumn,
    };

    previousColumnStateArray.push(state);

    sessionStorage.setItem('previousColumnState', JSON.stringify(previousColumnStateArray));
  }
  return null;
}
