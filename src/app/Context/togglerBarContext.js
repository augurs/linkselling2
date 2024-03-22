import React, { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarActive((prevSidebarActive) => !prevSidebarActive);
  }, []);

  const toggleSidebar1 = useCallback(() => {
    if (!hasBeenOpened) {
      setSidebarActive(true);
      setHasBeenOpened(false);
    } else {
      setSidebarActive(true);
    }
  }, [hasBeenOpened]);

  const toggleSidebar2 = useCallback(() => {
    if (hasBeenOpened) {
      setSidebarActive(false);
      setHasBeenOpened(true);
    } else {
      setSidebarActive(false);
    }
  }, [hasBeenOpened]);
  return (
    <SidebarContext.Provider value={{ sidebarActive, toggleSidebar, toggleSidebar1, toggleSidebar2 }}>
      {children}
    </SidebarContext.Provider>
  );
};
