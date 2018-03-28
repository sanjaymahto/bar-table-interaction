import mobxstore from 'mobx-store';

const rowState = mobxstore({
  rowStateArray: [],
});

const columnState = mobxstore({
  columnStateArray: [],
});

export { rowState, columnState };
