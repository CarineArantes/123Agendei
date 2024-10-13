import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native'
import { Input, Select } from '../../components'

export function CreateCostumerService() {

    return (
        <SafeAreaView className=" flex-1 justify-center align-middle p-2">
            <Input label="Nome" placeholder="Digite o nome do cliente" errorMessages='sadsa' />
            <Select label="Tipo de serviço" errorMessages='dsadas' />
        </SafeAreaView>
    )
}