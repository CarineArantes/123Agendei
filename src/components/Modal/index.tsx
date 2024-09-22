import * as ReactNative from 'react-native';
import * as T from './types';
import AntDesign from '@expo/vector-icons/AntDesign';

export function Modal(props: T.ModalProps) {
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
            <ReactNative.SafeAreaView style={styles.container}>
                <ReactNative.View style={styles.close}>
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
                <ReactNative.View style={styles.content}>
                    {children}
                </ReactNative.View>
            </ReactNative.SafeAreaView>
        </ReactNative.Modal>
    )
}
const styles = ReactNative.StyleSheet.create({
    container: {
        flex: 1,
    },
    close: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    content: {
        flex: 1,
    }
});