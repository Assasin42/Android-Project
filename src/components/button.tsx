import { StyleSheet, View, Pressable, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import { AppColors } from "../styles/colors";
type Props = {
  label: string;
  theme?: "primary" | "secondary";
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  const { colors } = useTheme();

  if (theme === "primary") {
    return (
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.background }]}
          onPress={onPress}
        >
          <FontAwesome
            name="bus"
            size={18}
            color={colors.primaryBlue}
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: colors.textPrimary }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }
  else if (theme === "secondary") {
    return (
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button2, { backgroundColor: AppColors.gaybuton }]}
          onPress={onPress}
        >
          <FontAwesome
            name="camera"
            size={18}
            color={colors.primaryBlue}
            style={styles.buttonIcon2}
          />
          <Text style={[styles.buttonLabel2, { color: colors.textPrimary }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
    height: 48,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 60,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  button2: {
    borderRadius: 60,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    color: AppColors.gray1_0,
   
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonIcon2: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,   
  },
  buttonLabel2: {
    fontSize: 16, 
  },
});