import React from 'react';

export type ModalProps = {
    visible: boolean;
    transparent: boolean;
    animationType: 'none' | 'slide' | 'fade' | undefined;
    onRequestClose: () => void;
    children?: React.ReactNode;
}