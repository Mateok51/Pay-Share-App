import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  ActivityIndicator,
} from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { HeaderButtons, Item } from "react-navigation-header-buttons"
import { Button } from "react-native-paper"
import { FlatList } from "react-native-gesture-handler"

import HeaderButton from "../../components/HeaderButton"
import Colors from "../../constants/Colors"

import * as userActions from "../../store/actions/user"

const SubscriptionOverviewScreen = (props) => {
  //Const declaration
  const dispatch = useDispatch()
  const [sum, setSum] = useState(0)
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  let totalSum = 0
  const [isLoading, setIsLoading] = useState(false)
  const [neededPayment, setNeededPayment] = useState(1320)

  //Calculating the amount needed to pay until now
  useEffect(() => {
    for (let startYear = 2020; startYear <= currentYear; startYear++) {
      for (let startMonth = 0; startMonth <= currentMonth; startMonth++) {
        setNeededPayment((prevState) => prevState + 30)
      }
    }
  }, [])

  //Fetching the user list data from the servers
  const loadingData = useCallback(async () => {
    setIsLoading(true)
    await dispatch(userActions.fetchUserList())
    setIsLoading(false)
  }, [dispatch, setIsLoading])

  useEffect(() => {
    loadingData()
  }, [dispatch, loadingData])

  //Fething the game list and filtering if the price is set
  const purchasedItemsList = useSelector((state) =>
    state.items.availableItemsList.filter((item) => item.price)
  )

  //Calculates the money spent on all items that have a price
  const priceSum = purchasedItemsList.reduce((accumulator, currentValue) => {
    return parseFloat(accumulator) + parseFloat(currentValue.price)
  }, 0)

  //Calling the user list from the store using the useSelector
  const userList = useSelector((state) => state.users.userList)

  //Function that goes through the user list and for every year until present year, sums all the payments of the user
  //Additionaly current money sum is set to be equal to all the payments of the user minus all the money that has been spend
  const sumThePayments = useCallback(() => {
    userList.forEach((element) => {
      for (let startYear = 2016; startYear <= currentYear; startYear++) {
        let paymentValue = `payment${startYear}`
        const yearSum = element[paymentValue]
          ? Object.values(element[paymentValue]).reduce(
              (total, amount) => parseInt(total) + parseInt(amount),
              0
            )
          : 0

        totalSum = totalSum + yearSum
      }
    })

    setSum(totalSum - priceSum)
  }, [userList, totalSum, setSum])

  useEffect(() => {
    sumThePayments()
  }, [sumThePayments])

  //Changes the color of the name if the sum doesnt meet the needed payment for a user
  const nameStyle = (user) => {
    let yearSum = 0

    for (let startYear = 2016; startYear <= currentYear; startYear++) {
      if (
        user[`payment${startYear}Total`] != null &&
        user[`payment${startYear}Total`] != undefined
      ) {
        yearSum =
          yearSum + parseInt(Object.values(user[`payment${startYear}Total`]))
      } else {
        yearSum = yearSum
      }
    }
    if (yearSum >= neededPayment) {
      return true
    } else {
      return false
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.cardStateContainer}>
        <View style={styles.cardContent}>
          <Text style={styles.moneyName}>AVAILABLE MONEY</Text>
          <Text style={styles.moneyValue}>
            {isLoading ? (
              <View style={styles.centered}>
                <ActivityIndicator size='small' color={Colors.primary} />
              </View>
            ) : (
              sum
            )}{" "}
            UNITS
          </Text>
          <Text style={styles.spentText}>SPENT: {priceSum} units</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode='contained'
          color={Colors.primary}
          onPress={() => {
            props.navigation.navigate("PurchaseHistory")
          }}>
          BOUGHT ITEMS
        </Button>
      </View>
      <View style={{ ...styles.cardStateContainer, ...styles.userNameList }}>
        <View style={styles.usernameHeaderContainer}>
          <Text style={styles.userNameHeader}>Users</Text>
        </View>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={userList}
            renderItem={(itemData) => (
              <View style={styles.userNameContainer}>
                <TouchableNativeFeedback
                  onPress={() => {
                    props.navigation.navigate({
                      routeName: "UserManagement",
                      params: {
                        userId: itemData.item.id,
                      },
                    })
                  }}>
                  <View style={styles.userContainer}>
                    <Text
                      style={
                        nameStyle(itemData.item)
                          ? styles.userNameGreen
                          : styles.userName
                      }>
                      {itemData.item.name}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            )}
          />
        )}
      </View>
    </View>
  )
}

SubscriptionOverviewScreen.navigationOptions = (navdata) => {
  return {
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Add new'
          iconName={Platform.OS === "android" ? "ios-add" : "ios-add"}
          onPress={() => {
            navdata.navigation.navigate({
              routeName: "UserManagement",
            })
          }}
        />
      </HeaderButtons>
    ),
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    alignItems: "center",
  },
  cardStateContainer: {
    width: "90%",
    backgroundColor: Colors.orange,
    borderRadius: 10,
    marginVertical: "5%",
    height: "30%",
    elevation: 5,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: "space-evenly",
  },
  moneyName: {
    fontSize: 20,
    color: "white",
  },
  moneyValue: {
    fontSize: 60,
    color: "white",
  },
  spentText: {
    fontSize: 20,
    color: "white",
    marginVertical: 5,
    alignSelf: "flex-end",
  },
  buttonContainer: {
    width: "50%",
    paddingVertical: 10,
  },
  usernameHeaderContainer: {
    backgroundColor: Colors.accent,
  },
  userNameHeader: {
    color: "white",
    textAlign: "center",
    fontSize: 30,
    paddingVertical: 10,
  },
  userNameList: {
    backgroundColor: "#C1CAD6",
    height: "50%",
  },
  userNameContainer: {
    alignItems: "center",
    width: "100%",
  },
  userName: {
    color: Colors.primary,
    fontSize: 20,
  },
  userNameGreen: {
    color: Colors.accent,
    fontSize: 20,
  },
  userContainer: {
    flex: 1,
    paddingVertical: 20,
    width: "100%",
    height: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "white",
  },
})

export default SubscriptionOverviewScreen
