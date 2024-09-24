import { SafeAreaView, Text } from 'react-native';
import {
    Button,
    ButtonText,
} from "@gluestack-ui/themed"

export function CostumerServiceList() {
    return (
        <SafeAreaView>
            <Text>CostumerServiceList</Text>
            <Button>
                <ButtonText>Hello World</ButtonText>
            </Button>
        </SafeAreaView>
    );
}