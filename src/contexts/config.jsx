import {
  createContext,
  useContext,
} from 'react';

const ConfigContext = createContext({});


const ConfigProvider = ({ children }) => {

  return (
    <ConfigContext.Provider
      value={{}}
    >
      {children}
    </ConfigContext.Provider>
  );
}

function useConfig(){
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}

export { ConfigProvider, useConfig };
