'use client';

import { TourStepProps } from 'antd';
import { action, makeObservable, observable } from 'mobx';

type NumberTourStep = {
  num: number;
  step: TourStepProps;
};

export default class TourStore {
  steps: NumberTourStep[] = [];

  constructor() {
    makeObservable(this, {
      steps: observable,
      register: action,
    });
  }

  register = (num: number, step: TourStepProps) => {
    this.steps.push({ num, step });
  };
}
