import React, { useEffect } from "react"
import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import { HeaderButtons, Item } from "react-navigation-header-buttons"
import { useSelector } from "react-redux"

import HeaderButton from "../../components/HeaderButton"
import Colors from "../../constants/Colors"

import { Button } from "react-native-paper"

const ItemInfoScreen = (props) => {
  //Fetching the game id and the data from the store for that id
  const openedItemId = props.navigation.getParam("itemId")
  const openedItem = useSelector((state) =>
    state.items.availableItemsList.find((item) => item.id === openedItemId)
  )
  //Sending the id of the open game to the navigation
  useEffect(() => {
    props.navigation.setParams({ itemId: openedItemId })
  }, [openedItemId])

  if (openedItem) {
    return (
      <View style={styles.screen}>
        <Image
          style={styles.mainImg}
          source={{ uri: openedItem.background_image }}
        />
        <ScrollView style={styles.contentContainer}>
          <View>
            <Text style={styles.itemNameStyle}>{openedItem.name}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoName}>Owner</Text>
            <Text style={styles.infoValue}>{openedItem.owner}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoName}>Reservations</Text>
            <Text style={styles.infoValue}>{openedItem.reservations}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoName}>Availability Type 1</Text>
            <Text style={styles.infoValue}>{openedItem.ps4}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoName}>Availability Type 2</Text>
            <Text style={styles.infoValue}>{openedItem.ps5}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoName}>Additional Notes</Text>
            <ScrollView>
              <Text style={styles.infoValue}>{openedItem.note}</Text>
            </ScrollView>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode='contained'
              color={Colors.primary}
              style={styles.button}
              onPress={() => {
                props.navigation.navigate({
                  routeName: "RentHistory",
                  params: {
                    openedItemId: openedItemId,
                  },
                })
              }}>
              RENT HISTORY
            </Button>
          </View>
        </ScrollView>
      </View>
    )
  } else {
    return null
  }
}

ItemInfoScreen.navigationOptions = (navData) => {
  const itemId = navData.navigation.getParam("itemId")
  return {
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Edit'
          iconName='ios-create'
          onPress={() => {
            navData.navigation.navigate("ItemManagament", { itemId: itemId })
          }}
        />
      </HeaderButtons>
    ),
  }
}

const styles = StyleSheet.create({
  mainImg: {
    width: "100%",
    height: "40%",
  },
  contentContainer: {
    padding: 15,
  },
  itemNameStyle: {
    fontSize: 30,
    color: Colors.primary,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent,
    alignItems: "center",
  },
  infoName: {
    fontSize: 20,
    marginVertical: 10,
    color: Colors.primary,
  },
  infoValue: {
    color: Colors.primary,
    textAlign: "right",
  },
  buttonContainer: {
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ItemInfoScreen
