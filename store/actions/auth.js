import AsyncStorage from "@react-native-community/async-storage"

export const AUTHENTICATE = "AUTHENTICATE"

export const authenticate = (userId, token) => {
  return { type: AUTHENTICATE, userId: userId, token: token }
}

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=
      AIzaSyAA2atG1nUrnRp-9Z80JrM7Flcbfh3vNEQ`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    )

    if (!response.ok) {
      const errorResData = await response.json()
      const errorId = errorResData.error.message
      let message = "Something went wrong!"
      if (errorId === "EMAIL_EXISTS") {
        message = "This email already exists!"
      }
      throw new Error(message)
    }

    const resData = await response.json()

    dispatch(authenticate(resData.localId, resData.idToken))
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    )
    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
  }
}

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAA2atG1nUrnRp-9Z80JrM7Flcbfh3vNEQ`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    )

    if (!response.ok) {
      const errorResData = await response.json()
      const errorId = errorResData.error.message
      let message = "Something went wrong!"
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!"
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!"
      }
      throw new Error(message)
    }

    const resData = await response.json()

    dispatch(authenticate(resData.localId, resData.idToken))
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    )
    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
  }
}

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  )
}
