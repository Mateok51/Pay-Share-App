import React, { useCallback, useEffect, useReducer, useState } from "react"
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Keyboard,
  ActivityIndicator,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "react-native-paper"

import InputRow from "../../components/InputRow"

import * as userActions from "../../store/actions/user"
import Colors from "../../constants/Colors"

//Initial state for all the monts
const initialState = {
  january: "0",
  february: "0",
  march: "0",
  april: "0",
  may: "0",
  june: "0",
  july: "0",
  august: "0",
  september: "0",
  october: "0",
  november: "0",
  december: "0",
  total: 0,
}

const UPDATE_MONTH = "UPDATE_MONTH"
const UPDATE_MONTHS = "UPDATE_MONTHS"

//Reducer function that changes payment for every month
function reducer(state, action) {
  switch (action.type) {
    case UPDATE_MONTH:
      return { ...state, [action.inputType]: action.inputData }
    case UPDATE_MONTHS:
      return {
        january: action.inputData[0],
        february: action.inputData[1],
        march: action.inputData[2],
        april: action.inputData[3],
        may: action.inputData[4],
        june: action.inputData[5],
        july: action.inputData[6],
        august: action.inputData[7],
        september: action.inputData[8],
        october: action.inputData[9],
        november: action.inputData[10],
        december: action.inputData[11],
      }
    default:
      throw new Error()
  }
}

const PaymentManagamentScreen = (props) => {
  //Variables needed for accesing the right data in the database
  const openedYear = props.navigation.getParam("year")
  const paymentYear = `payment${openedYear}`
  const openedUserId = props.navigation.getParam("openedUser")
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  //Fetching the user list data from the servers
  const loadingData = useCallback(async () => {
    setIsLoading(true)
    await dispatch(userActions.fetchUserList())
    setIsLoading(false)
  }, [dispatch])

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{ text: "okay" }])
    }
  }, [error])

  //Fetch data for this year and this user
  const userData = useSelector((state) =>
    state.users.userList.find((user) => user.id === openedUserId)
  )

  useEffect(() => {
    props.navigation.setParams({ submit: submitPayments, state: state })
  }, [submitPayments])

  //Creating a reducer for storing the game data
  const [state, dispatchState] = useReducer(reducer, initialState)

  //Function that handles the change input of the reducer state
  const handleInputChange = (reducerType, inputType, inputData) => {
    dispatchState({
      type: reducerType,
      inputType: inputType,
      inputData: inputData,
    })
  }

  //Load past data if the year exists already
  useEffect(() => {
    if (`${paymentYear}` in userData) {
      let yearsValues = Object.values(userData[paymentYear])
      handleInputChange(UPDATE_MONTHS, "", [
        yearsValues[0],
        yearsValues[1],
        yearsValues[2],
        yearsValues[3],
        yearsValues[4],
        yearsValues[5],
        yearsValues[6],
        yearsValues[7],
        yearsValues[8],
        yearsValues[9],
        yearsValues[10],
        yearsValues[11],
      ])
    }
  }, [])

  //Sum of every year
  let sum
  const [sumYear, setSumYear] = useState()
  useEffect(() => {
    sum =
      parseInt(state.january) +
      parseInt(state.february) +
      parseInt(state.march) +
      parseInt(state.april) +
      parseInt(state.may) +
      parseInt(state.june) +
      parseInt(state.july) +
      parseInt(state.august) +
      parseInt(state.september) +
      parseInt(state.october) +
      parseInt(state.november) +
      parseInt(state.december)

    setSumYear(sum)
  }, [state, setSumYear])

  //Submiting data alert handler
  const submiterHandler = () => {
    Alert.alert("Save payments?", "Do you want to save the payments?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        onPress: () => {
          submitPayments()
        },
      },
    ])
  }

  const submitPayments = useCallback(() => {
    Keyboard.dismiss()
    setError(false)
    if (
      state.january === "" ||
      state.february === "" ||
      state.march === "" ||
      state.april === "" ||
      state.may === "" ||
      state.june === "" ||
      state.july === "" ||
      state.august === "" ||
      state.september === "" ||
      state.october === "" ||
      state.november === "" ||
      state.december === ""
    ) {
      Alert.alert("Wrong input!", "Input has bigger than number 0!", [
        { text: "Ok", style: "default" },
      ])
      return
    } else {
      dispatch(
        userActions.createNewPaymentYear(
          openedUserId,
          paymentYear,
          state.january,
          state.february,
          state.march,
          state.april,
          state.may,
          state.june,
          state.july,
          state.august,
          state.september,
          state.october,
          state.november,
          state.december
        )
      )
        .then(() => {
          dispatch(
            userActions.createTotalYearPayment(
              openedUserId,
              paymentYear,
              sumYear
            )
          )
          loadingData()
        })
        .catch((error) => {
          setError(error.message)
        })
    }
  }, [state, sumYear])

  if (isLoading === true) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  } else {
    return (
      <ScrollView style={styles.screen}>
        <View style={styles.headerContainer}>
          <Text style={styles.openedYear}>{openedYear}</Text>
          <Button
            icon='playlist-plus'
            mode='contained'
            color='green'
            onPress={() => {
              submiterHandler()
            }}>
            {openedYear ? "CHANGE" : "ADD"}
          </Button>
        </View>
        <InputRow
          rowName='January'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "january", text)
          }
          textValue={state.january}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />

        <InputRow
          rowName='February'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "february", text)
          }
          textValue={state.february}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />

        <InputRow
          rowName='March'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "march", text)
          }
          textValue={state.march}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />

        <InputRow
          rowName='April'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "april", text)
          }
          textValue={state.april}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />

        <InputRow
          rowName='May'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "may", text)
          }
          textValue={state.may}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />

        <InputRow
          rowName='June'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "june", text)
          }
          textValue={state.june}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />

        <InputRow
          rowName='July'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "july", text)
          }
          textValue={state.july}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />
        <InputRow
          rowName='August'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "august", text)
          }
          textValue={state.august}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />

        <InputRow
          rowName='September'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "september", text)
          }
          textValue={state.september}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />

        <InputRow
          rowName='October'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "october", text)
          }
          textValue={state.october}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />
        <InputRow
          rowName='November'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "november", text)
          }
          textValue={state.november}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />
        <InputRow
          rowName='December'
          placeholderText='Unesi iznos'
          onChangeTextValue={(text) =>
            handleInputChange(UPDATE_MONTH, "december", text)
          }
          textValue={state.december}
          defaultValueText='0'
          keyboardTypeText='decimal-pad'
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: "5%",
  },
  openedYear: {
    fontSize: 25,
    textAlign: "center",
    color: "#4059ad",
    fontWeight: "bold",
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingLeft: 50,
  },
})

export default PaymentManagamentScreen
