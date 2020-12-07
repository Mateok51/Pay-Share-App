import React, { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { FlatList } from "react-native-gesture-handler"
import { HeaderButtons, Item } from "react-navigation-header-buttons"

import TextInputComponent from "../../components/TextInputComponent"
import HeaderButton from "../../components/HeaderButton"
import Card from "../../components/Card"
import Colors from "../../constants/Colors"

import * as itemsActions from "../../store/actions/items"

const ItemListScreen = (props) => {
  //State for user input
  const [searchItemName, setSearchItemName] = useState("")
  const [filteredItems, setFilteredItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  //Function that makes the app fetch data from the servers
  const loadingData = useCallback(async () => {
    setIsLoading(true)
    await dispatch(itemsActions.fetchItemList())
    setIsLoading(false)
  }, [dispatch, setIsLoading])

  //Call the function that fetches the data from the servers
  useEffect(() => {
    loadingData()
  }, [loadingData])

  //Fetching the data from the internal store
  const itemsList = useSelector((state) => state.items.availableItemsList)

  //Filtering data if the user inputs something
  useEffect(() => {
    setFilteredItems(itemsList)
    if (searchItemName.length > 0) {
      setFilteredItems(
        itemsList.filter((item) =>
          item.name.toLowerCase().includes(searchItemName.toLowerCase())
        )
      )
    }
  }, [itemsList, searchItemName])

  return (
    <View style={styles.screen}>
      <TextInputComponent
        placeholderText='Searchbox'
        onChangeTextValue={(text) => setSearchItemName(text)}
        textValue={searchItemName}
      />
      <Text style={styles.headerName}>Item List:</Text>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredItems.sort(function (a, b) {
            var textA = a.name.toUpperCase()
            var textB = b.name.toUpperCase()
            return textA < textB ? -1 : textA > textB ? 1 : 0
          })}
          renderItem={(itemData) => {
            return (
              <Card
                showDetails={() => {
                  props.navigation.navigate({
                    routeName: "ItemInfo",
                    params: {
                      itemId: itemData.item.id,
                    },
                  })
                }}
                imageUrl={itemData.item.background_image}
                ps4={itemData.item.ps4}
                ps5={itemData.item.ps5}
                name={itemData.item.name}
              />
            )
          }}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  )
}

ItemListScreen.navigationOptions = (navdata) => {
  return {
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Add new'
          iconName={Platform.OS === "android" ? "ios-add" : "ios-add"}
          onPress={() => {
            navdata.navigation.navigate({
              routeName: "ItemManagament",
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
    marginHorizontal: "5%",
    marginVertical: 5,
  },
  headerName: {
    fontSize: 25,
    color: Colors.primary,
    marginTop: 5,
    marginBottom: 5,
  },
})

export default ItemListScreen
