'use client';

import { action, makeObservable, observable } from 'mobx';

export default class MenuStore {
  mineMenu: string = 'recently';
  constructor() {
    makeObservable(this, {
      mineMenu: observable,
      setMenu: action,
    });
  }

  setMenu = (menu: string) => {
    this.mineMenu = menu;
  };
}
