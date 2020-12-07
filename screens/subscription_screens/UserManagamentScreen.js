import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ScrollView,
  Keyboard,
  TouchableNativeFeedback,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import * as userActions from "../../store/actions/user"
import InputRow from "../../components/InputRow"
import { Button } from "react-native-paper"

import Colors from "../../constants/Colors"

const UserManagamentScreen = (props) => {
  //Const declaration
  const currentYear = new Date().getFullYear()
  const dispatch = useDispatch()
  let years = []

  const [userName, setUserName] = useState("")
  const [error, setError] = useState()

  //Fetching the user from the store by using the id
  const openedUserId = props.navigation.getParam("userId")
  const openedUser = useSelector((state) =>
    state.users.userList.find((user) => user.id === openedUserId)
  )

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{ text: "okay" }])
    }
  }, [error])

  const displayRentedItems = () => {
    const object = openedUser.borrowedGames
    let rentedItemsArr = []
    if (object == undefined) {
      rentedItemsArr.push(
        <Text key='NemaPosudbi' style={styles.rentedItemText}>
          No items rented
        </Text>
      )
    } else {
      for (const gameId in object) {
        rentedItemsArr.push(
          <TouchableNativeFeedback
            key={object[gameId].gameName}
            onPress={() => {
              props.navigation.navigate({
                routeName: "ItemInfo",
                params: {
                  itemId: gameId,
                },
              })
            }}>
            <View style={styles.rentItemContainer}>
              <Text style={styles.rentedItemText}>
                {object[gameId].gameName}
              </Text>
            </View>
          </TouchableNativeFeedback>
        )
      }
    }
    return rentedItemsArr
  }
  //Fetching the user list data from the servers
  const loadingData = useCallback(async () => {
    await dispatch(userActions.fetchUserList())
  }, [dispatch])

  //If an id exist, the user data is loaded to the screen
  useEffect(() => {
    if (openedUser) {
      setUserName(openedUser.name)
    }
  }, [openedUser, setUserName])

  //Function that creates a new user to the database
  const submitUser = useCallback(() => {
    Keyboard.dismiss()
    setError(false)
    if (userName.length === 0) {
      Alert.alert(
        "Please input a valid user name!",
        "A valid user name needs to have atleast one character!",
        [{ text: "OK" }],
        { cancelable: false }
      )
    } else {
      if (openedUserId) {
        dispatch(userActions.updateUserName(openedUserId, userName))
          .then(() => {
            Alert.alert(
              "Changes saved",
              "User name has been changed.",
              [{ text: "OK" }],
              { cancelable: false }
            )
            loadingData()
          })
          .catch((error) => {
            setError(error.message)
          })
      } else {
        dispatch(userActions.createUser(userName))
          .then(() => {
            Alert.alert(
              "Success!",
              "A new user has been created.",
              [{ text: "OK" }],
              {
                cancelable: false,
              }
            )
            loadingData()
            setUserName("")
          })
          .catch((error) => {
            setError(error.message)
          })
      }
    }
  }, [dispatch, userName, userActions])

  //Function that creates year payment info for every user and every year
  if (openedUserId) {
    for (let startYear = 2016; startYear <= currentYear; startYear++) {
      let paymentValue = `payment${startYear}`
      years.push(
        <View key={startYear} style={styles.yearRow}>
          <Text style={styles.yearText}>
            <Text>{startYear} year:</Text>
            <Text style={styles.paymentValues}>
              {"  "}
              {openedUser
                ? openedUser[paymentValue]
                  ? Object.values(openedUser[paymentValue]).reduce(
                      (total, amount) => parseInt(total) + parseInt(amount),
                      0
                    )
                  : "No payments"
                : null}
            </Text>
            <Text style={styles.paymentValues}>
              {openedUser ? (openedUser[paymentValue] ? "units" : null) : null}
            </Text>
          </Text>
          <Button
            labelStyle={{ color: Colors.primary }}
            mode='contained'
            color='white'
            onPress={() => {
              props.navigation.navigate({
                routeName: "PaymentManagament",
                params: {
                  year: startYear,
                  openedUser: openedUserId,
                },
              })
            }}>
            {startYear}
          </Button>
        </View>
      )
    }
  }

  //Deleting user handler
  const deleteHandler = (id) => {
    Alert.alert("Delete user?", "Do you really want to delete the user?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(userActions.deleteUser(openedUserId))
            .then(() => {
              props.navigation.navigate("SubscriptionOverview")
            })
            .catch((error) => {
              setError(error.message)
            })
        },
      },
    ])
  }

  return (
    <View style={styles.screen}>
      <InputRow
        rowName='Name'
        placeholderText='Input username'
        onChangeTextValue={(text) => setUserName(text)}
        textValue={userName}
      />
      {openedUser ? (
        <ScrollView style={styles.yearsCard}>{years}</ScrollView>
      ) : null}
      {openedUser ? (
        <ScrollView style={styles.borrowedGamesContainer}>
          <Text style={styles.borrowedGamesHeader}>Rented items:</Text>
          {displayRentedItems()}
        </ScrollView>
      ) : null}

      <View
        style={
          openedUser
            ? { ...styles.btnContainer, ...styles.twoBtnContainer }
            : { ...styles.btnContainer, ...styles.oneBtnContainer }
        }>
        {openedUserId ? (
          <Button
            style={styles.saveButton}
            mode='contained'
            color='red'
            onPress={() =>
              !openedUserId ? props.navigation.goBack() : deleteHandler()
            }>
            DELETE USER
          </Button>
        ) : null}
        <Button
          style={styles.saveButton}
          mode='contained'
          color='green'
          onPress={() => {
            submitUser()
          }}>
          {openedUserId ? "Change Name" : "Create User"}
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    marginHorizontal: "5%",
    marginVertical: 5,
  },
  saveButton: {
    width: "45%",
  },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  yearText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  inputBtn: {
    width: "40%",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  btnContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  oneBtnContainer: {
    justifyContent: "center",
  },
  twoBtnContainer: {
    justifyContent: "space-between",
  },
  paymentValues: {
    fontWeight: "normal",
  },
  borrowedGamesHeader: {
    textAlign: "center",
    fontSize: 20,
    color: Colors.accent,
    fontWeight: "bold",
    padding: 15,
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  yearsCard: {
    backgroundColor: Colors.orange,
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    maxHeight: "40%",
    elevation: 5,
  },
  rentedItemText: {
    textAlign: "center",
    padding: 5,
    color: "white",
    fontSize: 19,
  },
  borrowedGamesContainer: {
    backgroundColor: Colors.accent,
    padding: 0,
    marginVertical: 10,
    borderRadius: 10,
    maxHeight: "30%",
    elevation: 5,
  },
  rentItemContainer: {
    paddingVertical: 10,
  },
})

export default UserManagamentScreen
