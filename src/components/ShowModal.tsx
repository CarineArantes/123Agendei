import React, { useRef, useState } from 'react';
import {
    LayoutRectangle,
    Modal,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
} from 'react-native';

type ShowModalProps = {
    children: React.ReactNode;
    elemment: React.ReactNode;
}

export function ShowModal(props: ShowModalProps) {
    const { children, elemment } = props;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] =
        useState<LayoutRectangle | null>(null);

    const selectButtonRef = useRef<TouchableOpacity>(null);

    const openDropdown = () => {
        selectButtonRef.current?.measure((_fx, _fy, _w, _h, px, py) => {
            setDropdownPosition({
                x: px,
                y: py + _h,
                width: _w,
                height: _h,
            });
            setIsDropdownOpen(true);
        });
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <>
            <TouchableOpacity
                ref={selectButtonRef}
                onPress={openDropdown}
            >
                {elemment}
            </TouchableOpacity>
            {isDropdownOpen && dropdownPosition && (
                <Modal
                    visible={isDropdownOpen}
                    transparent
                    animationType="none"
                >
                    <TouchableWithoutFeedback onPress={closeDropdown}>
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    top: dropdownPosition.y,
                                    shadowOpacity: 0.2,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowRadius: 8,
                                    elevation: 5,
                                    right: 10,
                                    width: 320,
                                    height: 400,
                                    alignSelf: 'center', // Centraliza o modal na tela
                                }}
                                className="absolute bg-white shadow-sm dark:bg-black p-2 rounded-2xl shadow-black dark:shadow-white"
                                onTouchStart={(e) => e.stopPropagation()} // Impede a propagação do toque
                            >
                                {children}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </>
    );
}
