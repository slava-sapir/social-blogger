import { createContext, useContext, useState } from 'react';

const FlashContext = createContext();

export const FlashProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addFlashMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <FlashContext.Provider value={{ messages, addFlashMessage }}>
      {children}
    </FlashContext.Provider>
  );
};

export const useFlash = () => useContext(FlashContext);
