import React from 'react';
import {
  FlatList,
  Text,
  Pressable,
  View,
  Dimensions
} from 'react-native';
import { cn } from '../lib'
import AntDesign from '@expo/vector-icons/AntDesign';

export interface ISelectedOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  options: ISelectedOption[];
  onSelect: (value: ISelectedOption[]) => void;
  selectedValue?: ISelectedOption[];
  errorMessages?: string;
  isPreview?: boolean;
}

export const Select = ({
  label = "select",
  options,
  onSelect,
  selectedValue,
  errorMessages,
  isPreview = false
}: SelectProps) => {

  const { height } = Dimensions.get('window');

  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [dropdownPosition, setDropdownPosition] =
  //   useState<LayoutRectangle | null>(null);

  // const selectButtonRef = useRef<any>(null);

  const handleCleatAll = () => {
    onSelect([]);
  }
  const handleSelectAll = () => {
    onSelect(options);
  }
  const handleSelect = (value: ISelectedOption | null) => {
    if (isPreview) return;
    if (!value) return;
    const currentSelected = selectedValue || [];
    const isSelected = currentSelected.some(item => item?.value === value?.value);
    const updatedSelection = isSelected
      ? currentSelected.filter(item => item?.value !== value?.value)
      : [...currentSelected, value];
    onSelect(updatedSelection);
  };
  const isSelected = (value: string) => {
    return selectedValue?.some(item => item?.value === value);
  }

  // const openDropdown = () => {
  //   selectButtonRef.current?.measure((_fx: any, _fy: any, _w: any, _h: any, px: any, py: any) => {
  //     setDropdownPosition({
  //       x: px,
  //       y: py + _h,
  //       width: _w,
  //       height: _h,
  //     });
  //     setIsDropdownOpen(true);
  //   });
  // };



  return (
    <View>
      <View className={cn('flex flex-col')}>
        <View className='flex-row justify-between'>
          <Text className="text-colorBase text-xl">
            {label}
          </Text>
          <Text className="text-colorBase text-xl">
            {selectedValue?.length ?? 0} / {options?.length}
          </Text>
        </View>
        <View>
          <FlatList
            data={options}
            keyExtractor={item => item.value.toString()}
            style={{
              height: isPreview ? (height - 320) : 300,
              maxHeight: isPreview ? (height - 320) : 300
            }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                className="border-b border-gray-200"
              >
                <View className='flex-row items-center p-1.5'>
                  <AntDesign
                    name={isSelected(item.value) ? "star" : "staro"}
                    size={20}
                    color="#C084FC"
                  />
                  <Text
                    className="text-lg ml-2 font-light"
                  >
                    {item.label}
                  </Text>
                </View>
              </Pressable>
            )}
          />
          {!isPreview && (
            <View className='flex-row justify-end items-center mt-2'>
              <Pressable onPress={handleSelectAll}>
                <Text className='text-base text-colorBase2'>
                  Selecionar todos
                </Text>
              </Pressable>
              <Text className='mr-1 ml-1'> | </Text>
              <Pressable onPress={handleCleatAll}>
                <Text className='text-base text-colorBase2'>
                  Limpar todos
                </Text>
              </Pressable>
            </View>
          )}
        </View>
        {/* {isDropdownOpen && dropdownPosition && (
          <Modal visible={isDropdownOpen} transparent animationType="none" >
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setIsDropdownOpen(false)}
            >
              <View
                style={{
                  top: dropdownPosition.y,
                  left: dropdownPosition.x,
                  width: dropdownPosition.width,
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 8,
                  elevation: 5,
                  maxHeight: 220,
                }}
                className="absolute bg-white shadow-sm p-2 rounded-xl shadow-black dark:shadow-white"
              >
                <FlatList
                  data={options}
                  keyExtractor={item => item.value.toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => handleSelect(item)}
                      className="border-b border-gray-200"
                    >
                      <View className='flex-row items-center p-1.5'>
                        <Entypo
                          name="check"
                          size={20}
                          color={isSelected(item.value) ? "#000000" : "#ffffff"}
                        />
                        <Text
                          className=" text-lg ml-2 font-light"
                        >
                          {item.label}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            </Pressable>
          </Modal>
        )} */}
      </View>
      {errorMessages &&
        <View className=' flex-row gap-2 mt-1'>
          <AntDesign name="exclamationcircleo" size={20} color="#dc2626" />
          <Text className=' text-red-600'>
            {errorMessages}
          </Text>
        </View>
      }
    </View>
  );
};
