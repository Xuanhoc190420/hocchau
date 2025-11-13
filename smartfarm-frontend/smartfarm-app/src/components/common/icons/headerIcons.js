import { View } from "react-native";
import Svg, { Path, Circle, Polyline, Line } from "react-native-svg";

export function ChickenIcon({ size = 24, color = "#2e7d32" }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2C10.5 2 9 2.5 8 3.5C7 4.5 6.5 6 6.5 7.5C6.5 8.5 6.7 9.4 7 10.2C5.8 10.6 5 11.7 5 13V15C5 16.1 5.9 17 7 17H8V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V17H17C18.1 17 19 16.1 19 15V13C19 11.7 18.2 10.6 17 10.2C17.3 9.4 17.5 8.5 17.5 7.5C17.5 6 17 4.5 16 3.5C15 2.5 13.5 2 12 2Z"
          fill={color}
          stroke={color}
          strokeWidth="1"
        />
        <Circle cx="10" cy="8" r="1" fill="white" />
        <Circle cx="14" cy="8" r="1" fill="white" />
      </Svg>
    </View>
  );
}

export function SearchIcon({ size = 20, color = "#666" }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
        <Path
          d="M16 16L21 21"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export function PhoneIcon({ size = 20, color = "#666" }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M22 16.92V19.92C22 20.49 21.54 20.97 20.97 21C9.94 21.47 2.53 14.06 3 3.03C3.03 2.46 3.51 2 4.08 2H7.08C7.64 2 8.11 2.46 8.13 3.02C8.23 4.61 8.53 6.16 9.01 7.64C9.15 8.08 9.01 8.56 8.65 8.83L6.71 10.21C8.28 13.37 10.63 15.72 13.79 17.29L15.17 15.35C15.44 14.99 15.92 14.85 16.36 14.99C17.84 15.47 19.39 15.77 20.98 15.87C21.54 15.89 22 16.36 22 16.92Z"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </Svg>
    </View>
  );
}

export function UserIcon({ size = 20, color = "#666" }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
        <Path
          d="M6 21C6 17.69 8.69 15 12 15C15.31 15 18 17.69 18 21"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export function CartIcon({ size = 24, color = "#666" }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9 2L7.17 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4H16.83L15 2H9Z"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <Circle cx="9" cy="21" r="1" fill={color} />
        <Circle cx="20" cy="21" r="1" fill={color} />
        <Polyline
          points="1 4 4 4 6 16 20 16"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </Svg>
    </View>
  );
}

export function SettingsIcon({ size = 20, color = "#666" }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
        <Path
          d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export function LogoutIcon({ size = 20, color = "#666" }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 17L21 12L16 7"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M21 12H9"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function PackageIcon({ size = 20, color = "#666" }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 16V8C21 7.4 20.6 6.9 20.1 6.6L13 3.1C12.4 2.8 11.6 2.8 11 3.1L3.9 6.6C3.4 6.9 3 7.4 3 8V16C3 16.6 3.4 17.1 3.9 17.4L11 20.9C11.6 21.2 12.4 21.2 13 20.9L20.1 17.4C20.6 17.1 21 16.6 21 16Z"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M3.3 7L12 12L20.7 7"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Line x1="12" y1="12" x2="12" y2="21" stroke={color} strokeWidth="2" />
      </Svg>
    </View>
  );
}
