import mobxstore from 'mobx-store';
/**
 * @param  {[]} {rowStateArray
 * @param  {} }
 */
const rowState = mobxstore({
  rowStateArray: [],
});
/**
 * @param  {[]} {columnStateArray
 * @param  {} }
 */
const columnState = mobxstore({
  columnStateArray: [],
});

export { rowState, columnState };
