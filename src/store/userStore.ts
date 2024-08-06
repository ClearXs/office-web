'use client';

import { UserInfo } from '@/services/user';
import { action, makeObservable, observable } from 'mobx';

export default class UserStore {
  user: UserInfo | undefined = undefined;

  constructor() {
    makeObservable(this, {
      user: observable,
      setUser: action,
    });
  }

  setUser = (user: UserInfo) => {
    this.user = user;
  };
}
