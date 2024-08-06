'use client';

import { action, makeObservable, observable } from 'mobx';

export default class EventStore {
  counter: number = 0;
  constructor() {
    makeObservable(this, {
      counter: observable,
      onRefresh: action,
    });
  }

  onRefresh = () => {
    this.counter += 1;
  };
}
