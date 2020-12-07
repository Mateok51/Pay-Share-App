import React from "react"
import { View, Text, StyleSheet } from "react-native"
import TextInputComponent from "./TextInputComponent"

const InputRow = (props) => {
  return (
    <View style={styles.inputRow}>
      <Text style={styles.inputName}>{props.rowName}</Text>
      <TextInputComponent
        placeholderText={props.placeholderText}
        onChangeTextValue={props.onChangeTextValue}
        textValue={props.textValue}
        style={styles.textInput}
        defaultValueText={props.defaultValueText}
        keyboardTypeText={props.keyboardTypeText}
        name={props.nameProperty}
      />
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
  textInput: {
    width: "72%",
  },
})

export default InputRow
