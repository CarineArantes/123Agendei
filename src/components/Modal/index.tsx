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
            <ReactNative.View style={styles.container}>
                <ReactNative.View style={styles.close}>
                    <AntDesign
                        name="close"
                        size={24}
                        onPress={onRequestClose}
                    />
                </ReactNative.View>
                <ReactNative.View style={styles.content}>
                    {children}
                </ReactNative.View>
            </ReactNative.View>
        </ReactNative.Modal>
    )
}
const styles = ReactNative.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(173, 165, 165, 0.5)',
    },
    close:{
        backgroundColor: 'red',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 40,
    },
    content: {
        flex: 1,
        backgroundColor: 'blue',
    }
});