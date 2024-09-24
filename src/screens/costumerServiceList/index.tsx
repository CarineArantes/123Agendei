import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Text } from 'react-native';
import {
    Button,
    ButtonText,
} from "@gluestack-ui/themed"
import {
    useCostumerServiceDatabase,
    CostumerServiceDatabase
} from '../../database/useCostumerServiceDatabase';
import { useConfig } from '../../contexts/config';

export function CostumerServiceList() {

    const {
        costumerServiceList,
        onReloadCostumerServiceList
    } = useConfig();

    return (
        <SafeAreaView>
            <Button
                onPress={onReloadCostumerServiceList}   
            >
                
            </Button>
            {costumerServiceList.map((costumerService: CostumerServiceDatabase) => {
                return (
                    <Text key={costumerService.id}>
                        {costumerService.clientName}
                    </Text>
                )
            })}
        </SafeAreaView>
    );
}