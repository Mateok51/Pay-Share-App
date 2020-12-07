import React, { useState, useCallback, useEffect } from "react"
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Button } from "react-native-paper"
import { useDispatch } from "react-redux"
import Colors from "../../constants/Colors"

import * as authActions from "../../store/actions/auth"
const AuthScreen = (props) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occured!", error, [{ text: "Okay" }])
    }
  }, [error])

  const signupHandler = useCallback(async () => {
    let action
    if (isSignup) {
      action = authActions.signup(username, password)
    } else {
      action = authActions.login(username, password)
    }
    setError(null)
    setIsLoading(true)
    try {
      await dispatch(action)
      props.navigation.navigate("BottomNav")
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [dispatch, username, password])
  return (
    <KeyboardAvoidingView style={styles.containerView} behavior='padding'>
      <View style={styles.loginScreenContainer}>
        <View style={styles.loginFormView}>
          <Text style={styles.logoText}>Pay&Share</Text>
          <TextInput
            placeholder='Email'
            placeholderColor='#c4c3cb'
            autoCapitalize='none'
            autoCorrect={false}
            style={styles.loginFormTextInput}
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
          <TextInput
            placeholder='Password'
            placeholderColor='#c4c3cb'
            style={styles.loginFormTextInput}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size='small' color='#4059ad' />
              ) : (
                <Button
                  mode='contained'
                  color='#4059ad'
                  style={styles.btnStyle}
                  onPress={() => signupHandler()}>
                  {isSignup ? "Sign up" : "Login"}
                </Button>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                mode='contained'
                color='#4059ad'
                style={styles.btnStyle}
                onPress={() => {
                  setIsSignup((prevState) => !prevState)
                }}>
                {isSignup ? "Login Form" : "SignUp Form"}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate",
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 150,
    marginBottom: 30,
    textAlign: "center",
    color: Colors.primary,
    fontWeight: "bold",
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonContainer: {
    width: "45%",
    padding: 10,
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: "transparent",
  },
})

export default AuthScreen
