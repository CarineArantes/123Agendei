import React, { useRef, useState } from 'react';
import {
  FlatList,
  LayoutRectangle,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { cn } from '../lib/utils';

// Extra types to you if you need :)
export interface ISelectedOption {
  label: string;
  value: string;
}

export interface ISelectedOptionsArray {
  options?: ISelectedOption[];
}

export type ISelectedValue = string | number | undefined;


export interface SelectProps {
  /** Add label string */
  label?: string;
  /** Add style to label*/
  labelClasses?: string;
  /** Add style to touchableOpacity selector*/
  selectClasses?: string;
  /** Add your options array -> send any type (example model: [{item:'',key:''}]) to converter to ISelectedOption > {label, value}*/
  options: ISelectedOption[];
  /** Add your selected state changer*/
  onSelect: (value: string | number) => void;
  /** Add your selected state value*/
  selectedValue?: string | number;
  /** Add your selected placeholder -> default is 'Select an option' */
  placeholder?: string;
  /** Define labelKey to options */
  labelKey: string;
  /** Define valueKey to options */
  valueKey: string;
  /** Define default label */
  defaultLabel?: string;
}

/** Customizable Select Component :) options receive any data type and converter into label and value to render  */
export const List = ({
  label,
  labelClasses,
  selectClasses,
  options,
  onSelect,
  selectedValue,
  placeholder = 'Select an option',
  labelKey,
  valueKey,
  defaultLabel = ''
}: SelectProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] =
    useState<LayoutRectangle | null>(null);
  const selectButtonRef = useRef<TouchableOpacity>(null);

  const handleSelect = (value: string | number) => {
    onSelect(value);
    setIsDropdownOpen(false);
  };

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

  return (
    <View className={cn('flex flex-col flex-1')}>
      {label && (
        <Text className={cn('text-lg ', labelClasses)}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        ref={selectButtonRef}
        className={cn('flex-1 pl-2 pr-1 items-end')}
        onPress={openDropdown}
      >
        <Text  className={cn('text-lg text-colorBase2')}>
          {selectedValue
            ? options.find(option => option.value === selectedValue)?.label || defaultLabel
            : placeholder}
        </Text>
      </TouchableOpacity>

      {isDropdownOpen && dropdownPosition && (
        <Modal visible={isDropdownOpen} transparent animationType="none">
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setIsDropdownOpen(false)}
          >
            <View
              style={{
                top: dropdownPosition.y,
                right: 12,
                width:300,
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 8,
                elevation: 5,
              }}
              className="absolute bg-white shadow-sm dark:bg-black p-2 rounded-md shadow-black dark:shadow-white"
            >
              <FlatList
                data={options}
                keyExtractor={item => item.value.toString()}
                style={{
                  maxHeight: 500
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item.value)}
                    className="border-b border-gray-200 p-2"
                  >
                    <Text className="text-lg ml-2 font-light">{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};
