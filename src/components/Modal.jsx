import * as ReactNative from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';

const { width } = ReactNative.Dimensions.get('window');

export function Modal(props) {

    const {
        visible,
        transparent,
        animationType = 'slide',
        title,
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
            <ReactNative.SafeAreaView className="flex-1 bg-customGray">
                <ReactNative.View className="justify-center p-4">
                    <ReactNative.Pressable
                        onPress={onRequestClose}
                        className=" flex flex-row w-full"
                    >
                        <ReactNative.Text
                            style={[{ width: width - 65 }]}
                            className='text-center text-xl '
                        >
                            {title}
                        </ReactNative.Text>
                        <AntDesign
                            name="closecircle"
                            size={30}
                            color={'#539DF3'}
                        />
                    </ReactNative.Pressable>
                </ReactNative.View>
                <ReactNative.View className=" flex-1">
                    {children}
                </ReactNative.View>
            </ReactNative.SafeAreaView>
        </ReactNative.Modal>
    )
}