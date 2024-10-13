import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Select, Button } from '../../components'
import { useState } from 'react'

export function CreateCostumerService() {
    const [error, setError] = useState('campo obrigatório !')

    return (
        <SafeAreaView className=" flex-1 justify-center align-middle p-2">
            <Input label="Nome" errorMessages={error} />
            <Select
                label="Choose an option"
                options={[
                    { description: 'Option A', code: 'A' },
                    { description: 'Option B', code: 'B' },
                ]}

                onSelect={() => { }}
                selectedValue={() => { }}
                labelKey="description"
                valueKey="code"
                errorMessages={error}
            />
        </SafeAreaView>
    )
}