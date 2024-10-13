import { SafeAreaView } from 'react-native-safe-area-context';
import { ExpandableCalendarScreen } from '../../components'

export function Home() {
    return (
        <SafeAreaView className=" flex-1" style={{backgroundColor:'white'}}>
            <ExpandableCalendarScreen />
        </SafeAreaView>
    )
}