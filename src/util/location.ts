import _ from 'lodash';

export default class LocationFinder {
  searchParams: Map<string, string>;

  constructor(search: string) {
    let searchString = search;
    this.searchParams = new Map();
    // parse search
    // like ?a=b&c=d
    if (searchString.startsWith('?')) {
      searchString = searchString.substring(1);
    }
    if (!_.isEmpty(searchString)) {
      searchString
        .split('&')
        // like a=b
        .forEach((kvPairString) => {
          const kvPair = kvPairString.split('=');
          const key = kvPair[0];
          const value = kvPair[1];
          this.searchParams.set(key, value);
        });
    }
  }

  get = (key: string): string | undefined => {
    return this.searchParams.get(key);
  };
}
