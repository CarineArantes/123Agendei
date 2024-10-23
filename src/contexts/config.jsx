import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const ConfigContext = createContext({});


const ConfigProvider = ({ children }) => {

  const [reload, setReload] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (itemSelected) {
      handleModalVisible(true)
    }
  }, [itemSelected]);

  const onReload = () => {
    setReload(!reload);
    setItemSelected(null);
    setModalVisible(false);
  }
  const handleModalVisible = (isVisible) => {
    setModalVisible(isVisible);
    if (!isVisible) {
      setItemSelected(null);
    }
  }

  return (
    <ConfigContext.Provider
      value={{
        itemSelected,
        setItemSelected,
        onReload,
        modalVisible,
        reload,
        handleModalVisible
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}

export { ConfigProvider, useConfig };
