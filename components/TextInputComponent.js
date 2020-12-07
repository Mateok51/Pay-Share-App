import React from "react"
import { TextInput, StyleSheet } from "react-native"

const TextInputComponent = (props) => {
  return (
    <TextInput
      placeholder={props.placeholderText}
      placeholderColor='#c4c3cb'
      autoCapitalize='none'
      autoCorrect={false}
      style={{ ...styles.loginFormTextInput, ...props.style }}
      onChangeText={props.onChangeTextValue}
      value={props.textValue}
      defaultValue={props.defaultValueText}
      keyboardType={props.keyboardTypeText}
      name={props.nameProperty}
    />
  )
}

const styles = StyleSheet.create({
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },
})

export default TextInputComponent
