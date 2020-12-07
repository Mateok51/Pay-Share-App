import React from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

const Input = (props) => {
  return (
    <View style={styles.inputRow}>
      <Text style={styles.inputName}>{props.inputName}</Text>
      <TextInput
        style={styles.inputBox}
        placeholder={props.placeholder}
        onChangeText={props.changeTextHandler}
        value={props.inputValue}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputName: {
    color: "#4059ad",
  },
  inputBox: {
    borderColor: "#4059ad",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    height: 40,
    width: "80%",
  },
})

export default Input
