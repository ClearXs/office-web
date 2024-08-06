'use client';

import React, { useContext } from 'react';

import UserStore from '../store/userStore';
import EventStore from '../store/eventStore';
import DocumentStore from '@/store/documentStore';
import TourStore from '@/store/tourStore';
import MenuStore from '@/store/menuStore';

export type Store = {
  userStore: UserStore;
  eventStore: EventStore;
  documentStore: DocumentStore;
  tourStore: TourStore;
  menuStore: MenuStore;
};

const StoreContext = React.createContext<Store>(null);

export const useStore = () => {
  return useContext(StoreContext);
};

const initializeStore = (): Store => {
  return {
    userStore: new UserStore(),
    eventStore: new EventStore(),
    documentStore: new DocumentStore(),
    tourStore: new TourStore(),
    menuStore: new MenuStore(),
  };
};

const StoreProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const store = initializeStore();
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;
