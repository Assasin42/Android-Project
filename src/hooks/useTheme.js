import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "../styles/themes";

export default function useTheme() {
  const isDark = useSelector((state) => state.theme.isDark);
  return {
    colors: isDark ? darkTheme : lightTheme,
    isDark,
  };
}