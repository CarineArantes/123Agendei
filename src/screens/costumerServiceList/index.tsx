import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Text } from 'react-native';
import {
    Button,
    ButtonText,
} from "@gluestack-ui/themed"
import {
    useCostumerServiceDatabase,
    CostumerServiceDatabase
} from '../../database/useProductDatabase';


export function CostumerServiceList() {
    const costumerServiceDatabase = useCostumerServiceDatabase();

    const [list, setList]
        = useState<any>([]);

    const fetchCostumerServiceList = useCallback(async () => {
        const costumerServiceList = await costumerServiceDatabase.findByDate(
            new Date().toISOString().split('T')[0]
        );
        setList(costumerServiceList);
    }, []);
    useEffect(() => {
        fetchCostumerServiceList();
    }, []);

    return (
        <SafeAreaView>
            <Button onPress={() => fetchCostumerServiceList()}></Button>
            {list.map((costumerService: CostumerServiceDatabase) => {
                return (
                    <Text key={costumerService.id}>
                        {costumerService.clientName}
                    </Text>
                )
            })}
        </SafeAreaView>
    );
}