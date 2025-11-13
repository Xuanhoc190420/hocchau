import Svg, { Path, Circle, Rect, Ellipse } from "react-native-svg"

interface IconProps {
  size?: number
  color?: string
}

export const NaturalBadgeIcon = ({ size = 24, color = "#4caf50" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Outer green circle */}
    <Circle cx={12} cy={12} r={10} fill={color} />

    {/* Inner white circle */}
    <Circle cx={12} cy={12} r={7.5} fill="#fff" />

    {/* Decorative ring lines */}
    <Circle cx={12} cy={12} r={9.5} stroke="#fff" strokeWidth={0.4} fill="none" opacity={0.8} />
    <Circle cx={12} cy={12} r={8.8} stroke="#fff" strokeWidth={0.3} fill="none" opacity={0.6} />

    {/* Large leaf */}
    <Path d="M12 14c2-2 4-3 5-2s0 3-2 4c-2 1-4 0-5-1s-1-2 2-1z" fill={color} transform="rotate(-25 12 12)" />

    {/* Small leaf */}
    <Path
      d="M10.5 13c1-1.5 2-2 2.5-1.5s0 2-1 2.5c-1 0.5-2 0-2.5-0.5s0-1.5 1-0.5z"
      fill={color}
      transform="rotate(35 12 12)"
    />

    {/* Leaf stem/vein detail */}
    <Path d="M11.5 12.5c0.5 0.5 1 1 1.5 1.5" stroke="#fff" strokeWidth={0.3} strokeLinecap="round" opacity={0.8} />

    {/* Text indicators (simplified as small marks since curved text is complex in SVG) */}
    <Path
      d="M12 3.5c0-0.5 0-0.5 0-0.5M9 4c0-0.3 0-0.3 0-0.3M15 4c0-0.3 0-0.3 0-0.3M6.5 5.5c0-0.2 0-0.2 0-0.2M17.5 5.5c0-0.2 0-0.2 0-0.2"
      stroke="#fff"
      strokeWidth={0.5}
      strokeLinecap="round"
      opacity={0.9}
    />
    <Path
      d="M12 20.5c0 0.5 0 0.5 0 0.5M9 20c0 0.3 0 0.3 0 0.3M15 20c0 0.3 0 0.3 0 0.3M6.5 18.5c0 0.2 0 0.2 0 0.2M17.5 18.5c0 0.2 0 0.2 0 0.2"
      stroke="#fff"
      strokeWidth={0.5}
      strokeLinecap="round"
      opacity={0.9}
    />
  </Svg>
)

export const WheatIcon = ({ size = 24, color = "#f57c00" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2v20M8 4c0 2 2 3 4 3s4-1 4-3M8 8c0 2 2 3 4 3s4-1 4-3M8 12c0 2 2 3 4 3s4-1 4-3M8 16c0 2 2 3 4 3s4-1 4-3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
)

export const CheckIcon = ({ size = 24, color = "#2e7d32" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} fill={color} opacity={0.2} />
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
    <Path d="M7 12l3 3 7-7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export const DeliveryIcon = ({ size = 24, color = "#1976d2" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={2} y={7} width={14} height={10} rx={1} stroke={color} strokeWidth={2} fill="none" />
    <Path d="M16 7h2.5a1.5 1.5 0 011.5 1.5V14l-4 3v-10z" fill={color} opacity={0.3} />
    <Path d="M16 7h2.5a1.5 1.5 0 011.5 1.5V14l-4 3" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx={7} cy={19} r={2} fill={color} />
    <Circle cx={17} cy={19} r={2} fill={color} />
  </Svg>
)

export const ChickenIcon = ({ size = 24, color = "#f57c00" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Ellipse cx={12} cy={13} rx={6} ry={7} fill={color} opacity={0.3} />
    <Path d="M12 6c-3.5 0-6 3-6 7s2.5 7 6 7 6-3 6-7-2.5-7-6-7z" stroke={color} strokeWidth={2} />
    <Circle cx={10} cy={11} r={1.5} fill={color} />
    <Circle cx={14} cy={11} r={1.5} fill={color} />
    <Path
      d="M8 4c0-1 1-2 2-2s2 1 2 2M12 4c0-1 1-2 2-2s2 1 2 2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path d="M9 14c0 1 1.5 2 3 2s3-1 3-2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
)

export const DrumstickIcon = ({ size = 24, color = "#d84315" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 20c-1.5 0-3-1-3-2.5S6.5 15 8 15l5-10c1-2 3-3 5-2s2 3 1 5l-5 10c-1.5 0-3 1-3 2.5S9.5 22 8 22"
      fill={color}
      opacity={0.3}
    />
    <Path
      d="M8 15c-1.5 0-3 1-3 2.5S6.5 20 8 20M13 5c1-2 3-3 5-2s2 3 1 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Ellipse cx={8} cy={17.5} rx={2} ry={1.5} fill={color} />
  </Svg>
)

export const EggIcon = ({ size = 24, color = "#fdd835" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3c-3 0-5 3-5 7 0 4 2 8 5 8s5-4 5-8c0-4-2-7-5-7z" fill={color} opacity={0.3} />
    <Path d="M12 3c-3 0-5 3-5 7 0 4 2 8 5 8s5-4 5-8c0-4-2-7-5-7z" stroke={color} strokeWidth={2} />
    <Path d="M10 8c0-1 1-1.5 2-1.5" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
  </Svg>
)

export const BowlIcon = ({ size = 24, color = "#e64a19" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 11h16c0 4-3.5 8-8 8s-8-4-8-8z" fill={color} opacity={0.3} />
    <Path d="M4 11h16c0 4-3.5 8-8 8s-8-4-8-8z" stroke={color} strokeWidth={2} />
    <Path d="M8 11V9M12 11V7M16 11V9" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Ellipse cx={12} cy={11} rx={8} ry={1} fill={color} opacity={0.2} />
  </Svg>
)

export const PhoneIcon = ({ size = 24, color = "#2e7d32" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 4h4l2 5-2.5 1.5c1 2 2 3 4 4L14 12l5 2v4c-9 0-14-5-14-14z" fill={color} opacity={0.2} />
    <Path
      d="M5 4h4l2 5-2.5 1.5c1 2 2 3 4 4L14 12l5 2v4c-9 0-14-5-14-14z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export const EmailIcon = ({ size = 24, color = "#1976d2" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={5} width={18} height={14} rx={2} fill={color} opacity={0.2} />
    <Rect x={3} y={5} width={18} height={14} rx={2} stroke={color} strokeWidth={2} />
    <Path d="M3 7l9 6 9-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export const LocationIcon = ({ size = 24, color = "#d32f2f" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.5 2 5.5 5 5.5 8.5c0 5.25 6.5 11.5 6.5 11.5s6.5-6.25 6.5-11.5C18.5 5 15.5 2 12 2z"
      fill={color}
      opacity={0.3}
    />
    <Path
      d="M12 2C8.5 2 5.5 5 5.5 8.5c0 5.25 6.5 11.5 6.5 11.5s6.5-6.25 6.5-11.5C18.5 5 15.5 2 12 2z"
      stroke={color}
      strokeWidth={2}
    />
    <Circle cx={12} cy={9} r={2.5} fill="#fff" />
  </Svg>
)
