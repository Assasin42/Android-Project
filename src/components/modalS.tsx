import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppColors } from "../styles/colors";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
type Option = {
  label: string;
  value: string | null;
  onSelect: (value: string | null) => void;
};

type Props = {
  options: Option[];
  value: string | null;
  onSelect: (value: string | null) => void;
};

export default function ModalSelect({ options, value, onSelect }: Props) {
  const [visible, setVisible] = useState<boolean>(false);
  const selectedText = value ?? "Bulunduğunuz Durağı Seçiniz";

  const handleSelect = (item: Option) => {
    onSelect(item.value);
    setVisible(false);
  };
  return (
    <View>
      <Pressable style={styles.selector} onPress={() => setVisible(true)}>
        <FontAwesome style={styles.selectorIcon} name="search" size={18} />
        <Text style={styles.selectorText}>{selectedText}</Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              indicatorStyle="white"
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={true}
            >
              {options.map((item) => (
                <Pressable
                  key={item.value}
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Text>Kapat</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    padding: 12,
    backgroundColor: AppColors.dark_blue,
    borderRadius: 60,
    flexDirection: "row",
    width: 400,
    justifyContent: "flex-start",
  },
  selectorIcon: {
    paddingRight: 8,
    color: AppColors.white,
  },
  selectorText: {
    fontSize: 16,
    color: AppColors.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: AppColors.black0_5,
  },
  modalContent: {
    margin: 20,
    backgroundColor: AppColors.dark_blue,
    borderRadius: 10,
    padding: 20,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: AppColors.white,
    backgroundColor: AppColors.dark_blue,
  },
  optionText: {
    fontSize: 16,
    color: AppColors.white,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
});
