import { StyleSheet, View, Pressable, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AppColors } from "../styles/colors";
type Props = {
  label: string;
  theme?: "primary";
  onPress?: () => void;
};

export default function GpsButton({ label, theme, onPress }: Props) {
  return (
    <View style={[styles.buttonContainer]}>
      <Pressable
        style={[styles.button, { backgroundColor: AppColors.white }]}
        onPress={onPress}
      >
        <FontAwesome
          name="crosshairs"
          size={20}
          color={AppColors.dark_blue}
          style={styles.buttonIcon}
        />
        <Text style={[styles.buttonLabel, { color: AppColors.black }]}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 50,
    height: 50,
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
  buttonIcon: {
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 16,
  },
});