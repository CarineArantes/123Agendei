import { forwardRef } from 'react';
import { Text, View } from 'react-native';

import { cn } from '../lib/utils';

const Avatar = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & { name?: string }
>(({ className, name, ...props }, ref) => {

  const displayName = name && `${name[0]}${name[1]}`
  return (
    <View
      ref={ref}
      className={cn('h-16 w-16 rounded-xl flex justify-center items-center bg-colorBase', className)}
      {...props}
    >
      <Text className=' text-xl font-bold text-white'>
        {displayName}
      </Text>
    </View>
  );
});
Avatar.displayName = 'Avatar';

export { Avatar };
