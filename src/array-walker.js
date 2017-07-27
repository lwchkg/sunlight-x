// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
export class ArrayWalker<T> {
  _data: T[];
  index: number;
  constructor(arr: T[], index: number = 0) {
    this._data = arr;
    this.index = index;
  }
  current(): T {
    if (this.index < 0 || this.index >= this._data.length)
      throw new Error(
        `Invalid index ${this.index}. The array has ${this._data
          .length} elements.`
      );
    return this._data[this.index];
  }

  // Note: hasPrev and hasNext does not detect empty items nor undefined. The
  // former is impossible anyway.
  hasPrev(): boolean {
    return this.index > 0;
  }
  hasNext(): boolean {
    return this.index < this._data.length - 1;
  }

  prev(): T {
    this.index--;
    return this.current();
  }
  next(): T {
    this.index++;
    return this.current();
  }

  prevUnsafe(): ?T {
    this.index--;
    return this._data[this.index];
  }
  nextUnsafe(): ?T {
    this.index++;
    return this._data[this.index];
  }

  hasOffset(offset: number): boolean {
    const index = this.index + offset;
    return index >= 0 && index < this._data.length;
  }

  peek(offset: number): T {
    const index = this.index + offset;
    if (index < 0 || index >= this._data.length)
      throw new Error(
        `Invalid index ${index}. The array has ${this._data.length} elements.`
      );
    return this._data[this.index + offset];
  }

  peekUnsafe(offset: number): ?T {
    return this._data[this.index + offset];
  }
}
