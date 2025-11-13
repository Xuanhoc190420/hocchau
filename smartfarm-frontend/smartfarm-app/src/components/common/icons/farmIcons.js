import Svg, { Path, Circle, Rect, Ellipse } from "react-native-svg";

// Chuồng gà icon
export const CoopIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L2 7V17C2 18.66 3.34 20 5 20H19C20.66 20 22 18.66 22 17V7L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M9 15H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Rect
      x="10"
      y="11"
      width="4"
      height="4"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
  </Svg>
);

// Thức ăn icon
export const FeedIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C12 2 8 4 8 8V12C8 14 10 16 12 16C14 16 16 14 16 12V8C16 4 12 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M8 8H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M6 16L5 21C5 21.5 5.5 22 6 22H18C18.5 22 19 21.5 19 21L18 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Nhập gà icon (arrow down)
export const ImportIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4V20"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 13L12 20L19 13"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 8L12 15L19 8"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Xuất gà icon (arrow up)
export const ExportIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 20V4"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 11L12 4L19 11"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 16L12 9L19 16"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Giỏ hàng icon
export const CartIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="21" r="1" fill={color} />
    <Circle cx="20" cy="21" r="1" fill={color} />
    <Path
      d="M1 1H5L7.68 14.39C7.77 14.78 8.08 15 8.5 15H19.4C19.73 15 20.04 14.85 20.23 14.57L23.42 9.39C23.78 8.84 23.39 8.14 22.72 8.14H6.54"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Gói hàng icon
export const PackageIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 8V16C21 16.5304 20.7893 17.0391 20.4142 17.4142C20.0391 17.7893 19.5304 18 19 18H5C4.46957 18 3.96086 17.7893 3.58579 17.4142C3.21071 17.0391 3 16.5304 3 16V8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M23 3H1V8H23V3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 18V3" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Cửa hàng icon
export const StoreIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9L5 3H19L21 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M3 9V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 21V15H15V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 9C3 10.1046 3.89543 11 5 11C6.10457 11 7 10.1046 7 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M7 9C7 10.1046 7.89543 11 9 11C10.1046 11 11 10.1046 11 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M11 9C11 10.1046 11.8954 11 13 11C14.1046 11 15 10.1046 15 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M15 9C15 10.1046 15.8954 11 17 11C18.1046 11 19 10.1046 19 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M19 9C19 10.1046 19.8954 11 21 11C22.1046 11 23 10.1046 23 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Gà icon
export const ChickenIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Ellipse
      cx="12"
      cy="14"
      rx="8"
      ry="6"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M12 4C12 4 13 2 15 2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="10.5" cy="8" r="1" fill={color} />
    <Path
      d="M12 10C12 10 13 11 14 11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path d="M8 17L6 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M16 17L18 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Số đếm icon
export const CountIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M6 4H10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M14 4H18V8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 10V14H10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 10H18V14H14V10Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 16V20H10V16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 16L14 20L18 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Biểu đồ icon
export const ChartIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3V21H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M7 16V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 16V8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M17 16V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Tiền icon
export const MoneyIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11C13.1046 11 14 11.8954 14 13C14 14.1046 13.1046 15 12 15C10.8954 15 10 14.1046 10 13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path d="M12 5V7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 15V17" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Tiền mặt icon
export const CashIcon = ({ size = 32, color = "#333" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="2"
      y="6"
      width="20"
      height="12"
      rx="2"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M6 9V9.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M18 15V15.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
