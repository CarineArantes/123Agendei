import { SafeAreaView, Text } from 'react-native';
import {
    Button,
    ButtonText,
} from "@gluestack-ui/themed"

import { Toast } from 'toastify-react-native';

export function CostumerServiceList() {
    const onSubmit = () => {
        // create(data);
        Toast.success('Cadastro realizado com sucesso')
    };
    return (
        <SafeAreaView>
            <Text>CostumerServiceList</Text>
            <Button>
                <ButtonText onPress={()=>{onSubmit()}}>Hello World</ButtonText>
            </Button>
        </SafeAreaView>
    );
}