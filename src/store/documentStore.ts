import { DocUser } from '@/services/docUser';
import { action, makeObservable, observable } from 'mobx';

export default class DocumentStore {
  selectDocumentRows: DocUser[] = [];
  constructor() {
    makeObservable(this, {
      selectDocumentRows: observable,
      setSelectDocumentRows: action,
    });
  }

  setSelectDocumentRows = (selectDocumentRows: DocUser[]) => {
    this.selectDocumentRows = selectDocumentRows;
  };
}
