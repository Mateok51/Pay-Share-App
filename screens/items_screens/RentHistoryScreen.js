import React from "react"
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { useSelector } from "react-redux"

import Colors from "../../constants/Colors"

const RentHistoryScreen = (props) => {
  const gameId = props.navigation.getParam("openedItemId")
  const openedGame = useSelector((state) =>
    state.items.availableItemsList.find((game) => game.id === gameId)
  )

  const renderList = (console) => {
    let list = []
    const consoleType = console + "History"
    if (consoleType === "ps4History") {
      for (const property in openedGame[consoleType]) {
        list.push(
          <View key={property} style={styles.rowContent}>
            <Text style={styles.textValue}>
              {openedGame.ps4History[property].name}
            </Text>
            <Text style={styles.textValue}>
              {openedGame.ps4History[property].date}
            </Text>
          </View>
        )
      }
    } else {
      for (const property in openedGame[consoleType]) {
        list.push(
          <View key={property} style={styles.rowContent}>
            <Text style={styles.textValue}>
              {openedGame.ps5History[property].name}
            </Text>
            <Text style={styles.textValue}>
              {openedGame.ps5History[property].date}
            </Text>
          </View>
        )
      }
    }
    return list
  }
  return (
    <View style={styles.screen}>
      <ScrollView style={styles.cardList}>
        <Text style={styles.header}>PS4 POSUDBE</Text>
        {renderList("ps4")}
      </ScrollView>
      <ScrollView style={styles.cardList}>
        <Text style={styles.header}>PS5 POSUDBE</Text>
        {renderList("ps5")}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  cardList: {
    marginHorizontal: "5%",
    marginVertical: "2.5%",
    height: "40%",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.primary,
    fontWeight: "bold",
  },
  rowContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent,
  },
  textValue: {
    fontSize: 15,
    color: Colors.primary,
  },
})

export default RentHistoryScreen
