import React, { useCallback, useEffect, useReducer, useState } from "react"
import { View, StyleSheet, Alert, Text, Keyboard } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import InputRow from "../../components/InputRow"
import { Button } from "react-native-paper"
import { Picker } from "@react-native-picker/picker"
import * as userActions from "../../store/actions/user"
import * as itemsActions from "../../store/actions/items"

//Initial state for all the inputs
const initialState = {
  itemName: "",
  ps4: "Available",
  ps5: "Available",
  itemBackground:
    "https://cdn3.dualshockers.com/wp-content/uploads/2018/03/playstation_logo.png",
  itemOwner: "",
  itemReservations: "",
  itemPrice: "",
  note: "",
}

const UPDATE_INPUT = "UPDATE_INPUT"
const RESET_ALL = "RESET_ALL"
const CHANGE_ALL = "CHANGE_ALL"

//Reducer function that changes the input
function reducer(state, action) {
  switch (action.type) {
    case UPDATE_INPUT:
      return { ...state, [action.inputType]: action.inputData }
    case RESET_ALL:
      return initialState
    case CHANGE_ALL:
      return {
        itemName: action.inputData[0],
        ps4: action.inputData[1],
        ps5: action.inputData[2],
        itemBackground: action.inputData[3],
        itemOwner: action.inputData[4],
        itemReservations: action.inputData[5],
        itemPrice: action.inputData[6],
        note: action.inputData[7],
      }
    default:
      throw new Error()
  }
}

const ItemManagamentScreen = (props) => {
  const [lastUserTypeOne, setLastUserTypeOne] = useState()
  const [lastUserTypeTwo, setLastUserTypeTwo] = useState()
  const date = `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}`
  const dispatch = useDispatch()
  const [error, setError] = useState()

  //Fetching the user list data from the servers
  const loadingData = useCallback(async () => {
    await dispatch(userActions.fetchUserList())
    await dispatch(itemsActions.fetchItemList())
  }, [dispatch])

  useEffect(() => {
    loadingData()
  }, [dispatch, loadingData])

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{ text: "okay" }])
    }
  }, [error])

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
  //Changes the data to the fetched game data if id exist
  useEffect(() => {
    if (itemId && existingItem) {
      handleInputChange(CHANGE_ALL, "", [
        existingItem.name,
        existingItem.ps4,
        existingItem.ps5,
        existingItem.background_image,
        existingItem.owner,
        existingItem.reservations,
        existingItem.price,
      ])
      setLastUserTypeOne(existingItem.ps4)
      setLastUserTypeTwo(existingItem.ps5)
    }
  }, [itemId, existingItem])

  //Fetching objects for all users, current users and old users
  const userList = useSelector((state) => state.users.userList)
  const historyUserTypeOne = userList.find(
    (user) => user.name === lastUserTypeOne
  )
  const historyUserTypeTwo = userList.find(
    (user) => user.name === lastUserTypeTwo
  )
  const currentUserTypeOne = userList.find((user) => user.name === state.ps4)
  const currentUserTypeTwo = userList.find((user) => user.name === state.ps5)

  //Fetching the id of the opened game
  const itemId = props.navigation.getParam("itemId")
  //Fetching the data of the opened game by using the id
  const existingItem = useSelector((state) =>
    state.items.availableItemsList.find((item) => item.id === itemId)
  )

  //Alert handler
  const alertSubmit = useCallback(() => {
    Alert.alert(
      "Item saving!",
      "Do you want to save the data?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => submitItemChanges(),
        },
      ],
      { cancelable: false }
    )
  })

  const alertNotice = useCallback((noticeHeader, noticeMsg) => {
    Alert.alert(
      "Changes saved!",
      "Changes have been saved to the database!",
      [{ text: "OK" }],
      { cancelable: false }
    )
    loadingData()
  })

  //Function for saving the history of borrowed games
  const createHistoryFunction = useCallback(() => {
    if (
      state.ps4 != "Available" &&
      state.ps4 != undefined &&
      lastUserTypeOne != state.ps4
    ) {
      dispatch(itemsActions.addToRentHistory(itemId, "ps4", date, state.ps4))
      dispatch(
        userActions.addBorrowedGame(
          currentUserTypeOne.id,
          itemId,
          state.itemName
        )
      )
    }

    state.ps4 != lastUserTypeOne &&
    lastUserTypeOne != undefined &&
    lastUserTypeOne != "Available"
      ? dispatch(userActions.deleteBorrowedGame(historyUserTypeOne.id, itemId))
      : null

    state.ps5 != lastUserTypeTwo &&
    lastUserTypeTwo != undefined &&
    lastUserTypeTwo != "Available"
      ? dispatch(userActions.deleteBorrowedGame(historyUserTypeTwo.id, itemId))
      : null
    if (
      state.ps5 != "Available" &&
      state.ps5 != undefined &&
      lastUserTypeTwo != state.ps5
    ) {
      dispatch(itemsActions.addToRentHistory(itemId, "ps5", date, state.ps5))
      dispatch(
        userActions.addBorrowedGame(
          currentUserTypeTwo.id,
          itemId,
          state.itemName
        )
      )
    }
  })

  //Submiting to the external database
  const submitItemChanges = useCallback(() => {
    Keyboard.dismiss()
    setError(false)
    if (state.itemName.length === 0) {
      Alert.alert(
        "Input valid item name!",
        "A valid name needs to have atleast one character.",
        [{ text: "OK" }],
        { cancelable: false }
      )
    } else {
      if (!itemId) {
        dispatch(
          itemsActions.createItem(
            state.itemName,
            state.ps4,
            state.ps5,
            state.itemBackground,
            state.itemOwner,
            state.itemReservations,
            state.itemPrice,
            state.note
          )
        )
          .then(() => {
            alertNotice("Changes saved!", "Item data has been saved.")
            handleInputChange(RESET_ALL)
          })
          .catch((error) => {
            setError(error.message)
          })
      } else {
        dispatch(
          itemsActions.updateItemData(
            itemId,
            state.itemName,
            state.ps4,
            state.ps5,
            state.itemBackground,
            state.itemOwner,
            state.itemReservations,
            state.itemPrice,
            state.note
          )
        )
          .then(() => {
            createHistoryFunction()
            alertNotice("Changes saved!", "Item data have been saved.")
          })
          .catch((error) => {
            setError(error.message)
          })
      }
    }
    // props.navigation.goBack()
  }, [state, currentUserTypeOne, historyUserTypeOne, historyUserTypeTwo])

  //Deleting game handler
  const deleteHandler = (id) => {
    Alert.alert("Delete item?", "Do you want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(itemsActions.deleteItem(id))
            .then(() => {
              props.navigation.navigate("ItemList")
            })
            .catch((error) => {
              setError(error.message)
            })
        },
      },
    ])
  }
  //Create a list of options for the picker
  const makeUserList = (console) => {
    let userListArr = []
    if (existingItem) {
      userListArr.push(
        <Picker.Item
          key={existingItem[console]}
          label={existingItem[console]}
          value={existingItem[console]}
        />
      )
      const filteredList = userList.filter(
        (user) => user.name != existingItem[console]
      )
      filteredList.forEach((element) => {
        userListArr.push(
          <Picker.Item
            key={element.id}
            label={element.name}
            value={element.name}
          />
        )
      })
    } else {
      userList.forEach((element) => {
        userListArr.push(
          <Picker.Item
            key={element.id}
            label={element.name}
            value={element.name}
          />
        )
      })
    }
    return userListArr
  }

  return (
    <View style={styles.screen}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}></View>
      <InputRow
        rowName='Item Name'
        placeholderText='Input item name'
        onChangeTextValue={(text) =>
          handleInputChange(UPDATE_INPUT, "itemName", text)
        }
        textValue={state.itemName}
      />
      {itemId ? (
        <View style={styles.inputRow}>
          <Text style={styles.inputName}>Availability 1</Text>
          <View style={styles.pickerRow}>
            <Picker
              selectedValue={state.ps4}
              style={{ height: 40 }}
              onValueChange={(text) =>
                handleInputChange(UPDATE_INPUT, "ps4", text)
              }>
              {!existingItem ? (
                <Picker.Item label='Available' value='Available' />
              ) : null}
              {makeUserList("ps4")}
              {existingItem ? (
                existingItem.ps4 != "Available" ? (
                  <Picker.Item label='Available' value='Available' />
                ) : null
              ) : null}
            </Picker>
          </View>
        </View>
      ) : null}
      {itemId ? (
        <View style={styles.inputRow}>
          <Text style={styles.inputName}>Availability 2</Text>
          <View style={styles.pickerRow}>
            <Picker
              selectedValue={state.ps5}
              style={{ height: 40 }}
              onValueChange={(text) =>
                handleInputChange(UPDATE_INPUT, "ps5", text)
              }>
              {!existingItem ? (
                <Picker.Item label='Available' value='Available' />
              ) : null}
              {makeUserList("ps5")}
              {existingItem ? (
                existingItem.ps5 != "Available" ? (
                  <Picker.Item label='Available' value='Available' />
                ) : null
              ) : null}
            </Picker>
          </View>
        </View>
      ) : null}
      <InputRow
        rowName='Item Picture'
        placeholderText='Input picture url'
        onChangeTextValue={(text) =>
          handleInputChange(UPDATE_INPUT, "itemBackground", text)
        }
        textValue={state.itemBackground}
      />
      <InputRow
        rowName='Owner'
        placeholderText='Input owner name'
        onChangeTextValue={(text) =>
          handleInputChange(UPDATE_INPUT, "itemOwner", text)
        }
        textValue={state.itemOwner}
      />
      <InputRow
        rowName='Reservations'
        placeholderText='Input reservations'
        onChangeTextValue={(text) =>
          handleInputChange(UPDATE_INPUT, "itemReservations", text)
        }
        textValue={state.itemReservations}
      />
      <InputRow
        rowName='Price'
        placeholderText='Input price'
        onChangeTextValue={(text) =>
          handleInputChange(UPDATE_INPUT, "itemPrice", text)
        }
        textValue={state.itemPrice}
      />
      <InputRow
        rowName='Additional Notes'
        placeholderText='Input additional notes'
        onChangeTextValue={(text) =>
          handleInputChange(UPDATE_INPUT, "note", text)
        }
        textValue={state.note}
      />

      <View style={styles.btnContainer}>
        <View style={styles.btnContainer}>
          {existingItem ? (
            <Button
              style={styles.btnStyle}
              icon='delete'
              mode='contained'
              color='red'
              onPress={() => (itemId ? deleteHandler(itemId) : null)}>
              IZBRIŠI IGRU
            </Button>
          ) : null}
          <Button
            icon='playlist-plus'
            mode='contained'
            color='green'
            style={styles.btnStyle}
            onPress={() => {
              alertSubmit()
            }}>
            {itemId ? "CHANGE ITEM" : "ADD ITEM"}
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: "2%",
    marginVertical: 5,
  },
  btnStyle: {
    width: "40%",
  },
  btnContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
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
  pickerRow: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    width: "72%",
  },
})

export default ItemManagamentScreen
