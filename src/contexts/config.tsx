import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
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
  costumerServiceSelected: CostumerServiceDatabase | null;
  setCostumerServiceSelected: (costumerService: CostumerServiceDatabase | null) => void;
  setFilterDate: (date: string) => void;
}

interface ConfigProviderProps {
  children: ReactNode;
}

const ConfigContext = createContext({} as ConfigContextData);

const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const today = new Date();
  const [filterDate, setFilterDate] = useState(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`);
  const [costumerServiceSelected, setCostumerServiceSelected] = useState<CostumerServiceDatabase | null>(null);
  const [costumerServiceList, setCostumerServiceList] = useState<any>([]);

  const costumerServiceDatabase = useCostumerServiceDatabase();

  useEffect (() => {
    onReloadCostumerServiceList();
  }, [filterDate]);
  async function onReloadCostumerServiceList() {
    const costumerServiceList = await costumerServiceDatabase.findByDate(
      filterDate
    );
    setCostumerServiceList(costumerServiceList);
  }

  return (
    <ConfigContext.Provider
      value={{
        costumerServiceList,
        onReloadCostumerServiceList,
        costumerServiceSelected,
        setCostumerServiceSelected,
        setFilterDate
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
