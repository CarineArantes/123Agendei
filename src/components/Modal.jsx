import * as ReactNative from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export function Modal(props) {

    const {
        visible,
        transparent,
        animationType = 'slide',
        onRequestClose,
        children
    } = props;

    return (
        <ReactNative.Modal
            visible={visible}
            transparent={transparent}
            animationType={animationType}
            onRequestClose={onRequestClose}
        >
            <ReactNative.SafeAreaView className=" flex-1">
                <ReactNative.View className=" justify-center p-2">
                    <ReactNative.TouchableOpacity
                        onPress={onRequestClose}
                    >
                        <AntDesign
                            name="closecircleo"
                            size={24}
                            color="black"
                        />
                    </ReactNative.TouchableOpacity>
                </ReactNative.View>
                <ReactNative.View className=" flex-1">
                    {children}
                </ReactNative.View>
            </ReactNative.SafeAreaView>
        </ReactNative.Modal>
    )
}