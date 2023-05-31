// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
// A storage of string
export class UserDefinedNameStore {
  _store: Map<string, Set<string>>;

  constructor() {
    this._store = new Map();
  }

  addName(name: string, language: string) {
    const subStore = this._store.get(language);

    if (!subStore) {
      const set: Set<string> = new Set();
      set.add(name);

      this._store.set(language, set);
    } else {
      subStore.add(name);
    }
  }

  hasName(name: string, language: string): boolean {
    const subStore = this._store.get(language);

    return !!subStore && subStore.has(name);
  }

}