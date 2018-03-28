import { rowState, columnState } from './store';
/**
 * @description function to merge the rows in table.
 * @param  {} mergeRowObject
 * @return null
 */
export default function mergerow(mergeRowObject) {
  const {
    column, startRow, endRow, context, canvas, data,
  }
 = mergeRowObject;

  const bw = (Object.keys(data[0]).length) * 200; // Calculating Border Width
  const bh = (data.length + 1) * 40; // Calculating Border Height
  const p = 10; // margin
  // to get the previous states...
  const stateArray = rowState('rowStateArray');
  // console.log('Previous State array: ', stateArray);

  // to get the previous column state...
  const columnStateArray = columnState('columnStateArray');
  // console.log('Previous Column State array: ', columnStateArray);

  if (columnStateArray != null) {
    for (let columnStateIndex = 0; columnStateIndex < columnStateArray.length;
      columnStateIndex += 1) {
      for (let i1 = startRow; i1 <= endRow; i1 += 1) {
        if ((columnStateArray[columnStateIndex].row - 1) === i1) {
          if (column >= columnStateArray[columnStateIndex].startColumn &&
            column <= columnStateArray[columnStateIndex].endColumn) {
            throw new Error('Invalid arguments passed!');
          }
        }
      }
    }
  }

  let stateFlag = 0;

  if (stateArray != null) {
    for (let stateIndex = 0; stateIndex < stateArray.length; stateIndex += 1) {
      if (stateArray[stateIndex].column === column) {
        if (startRow >= stateArray[stateIndex].startRow &&
          startRow <= stateArray[stateIndex].endRow) {
          stateFlag = 2;
          throw new Error('Invalid Argument Passed!');
        } else if (endRow >= stateArray[stateIndex].startRow &&
           endRow <= stateArray[stateIndex].endRow) {
          stateFlag = 2;
          throw new Error('Invalid Argument Passed!');
        }
      }
    }

    if (stateFlag === 0) {
      stateFlag = 1;
    }
  } else {
    stateFlag = 1;
  }

  if (stateFlag === 1 && column <= data.length && endRow > startRow &&
     startRow !== endRow && endRow <= (data.length + 1)) {
    // Function to restore the Canavas...
    context.restore();

    // logic for rowSpan

    for (let y2 = 0, a = 0, b = 0, c = 0, d = 0, count = 0; y2 <= bh; y2 += 40) {
      if (count === (endRow - startRow)) {
        break;
      }
      if (y2 === 0) {
        a = ((column - 1) * 200) + 11;
        b = ((startRow + 1) * 40) + p;
        c = 199;
        d = 1;
      }
      context.clearRect(a, b, c, d);
      b += 40;
      count += 1;
    }


    const keys = Object.keys(data[0]); // finding keys in each JSON object

    // To print the values of the Table Excluding Header...
    for (let y = 80, count = 0; y <= bh; y += 40) {
      for (let x = 0, keyCount = 0; x < bw; x += 200) {
        context.font = 'normal 16px Verdana';
        context.fillStyle = 'black';
        if ((keyCount + 1) === column && count < endRow && count + 1 > startRow) {
          context.clearRect(((column - 1) * 200) + 11, ((startRow) *
           40) + 11, 199, (39 + ((endRow - startRow) * 40)));
          context.fillText((data[startRow - 1])[keys[keyCount]], 0.5 + x + p + 5, ((startRow + 1) *
           40) + (40 * ((endRow - startRow) / 2)));
        }
        keyCount += 1;
      }
      count += 1;
    }

    // To clear extra rows and table in the column in canvas when table restructures.
    context.clearRect(10, bh + 11, canvas.width, canvas.height);
    context.clearRect(bw + 11, 9.5, canvas.width, canvas.height);

    context.save();

    const state = {
      column,
      startRow,
      endRow,
    };

    rowState('rowStateArray').push(state);
  }
  return null;
}
