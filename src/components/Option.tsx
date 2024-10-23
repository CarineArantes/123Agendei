import {
  ColorValue,
  Pressable,
  PressableProps,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { cn } from '../lib/utils'

type Props = PressableProps & {
  icon: keyof typeof MaterialIcons.glyphMap
  backgroundColor: ColorValue
  className?: string
}

export function Option({ icon, backgroundColor, className, ...rest }: Props) {
  return (
    <Pressable
      className={cn("w-20 h-20 flex justify-center items-center", className)}
      style={[{ backgroundColor }]}
      {...rest}
    >
      <MaterialIcons name={icon} size={24} color="#FFF" />
    </Pressable>
  )
}