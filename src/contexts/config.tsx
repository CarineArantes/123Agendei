import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react';

import {
  useCostumerServiceDatabase,
  CostumerServiceDatabase
} from '../database/useCostumerServiceDatabase';

interface ConfigContextData {
  costumerServiceList: CostumerServiceDatabase[];
  onReloadCostumerServiceList: () => void;
}

interface ConfigProviderProps {
  children: ReactNode;
}

const ConfigContext = createContext({} as ConfigContextData);

const ConfigProvider = ({ children }: ConfigProviderProps) => {

  const [costumerServiceList, setCostumerServiceList] = useState<any>([]);

  const costumerServiceDatabase = useCostumerServiceDatabase();

  async function onReloadCostumerServiceList() {
    const costumerServiceList = await costumerServiceDatabase.findByDate(
      new Date().toISOString().split('T')[0]
    );
    if (costumerServiceList.length === 0) return;
    setCostumerServiceList(costumerServiceList);
  }

  return (
    <ConfigContext.Provider
      value={{
        costumerServiceList, 
        onReloadCostumerServiceList 
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

function useConfig(): ConfigContextData {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}

export { ConfigProvider, useConfig };
