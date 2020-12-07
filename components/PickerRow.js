import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Picker } from "@react-native-picker/picker"

const PickerRow = (props) => {
  return (
    <View style={styles.inputRow}>
      <Text style={styles.inputName}>{props.pickerName}</Text>
      <Picker
        selectedValue={props.selectedValue}
        style={{ height: 50, width: "80%" }}
        onValueChange={props.onValueChange}>
        {props.children}
      </Picker>
    </View>
  )
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  inputName: {
    color: "#4059ad",
    fontWeight: "bold",
  },
})

export default PickerRow
