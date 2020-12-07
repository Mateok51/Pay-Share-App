import React from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableNativeFeedback,
} from "react-native"
import { useSelector } from "react-redux"

import Colors from "../../constants/Colors"

const PurchaseHistoryScreen = (props) => {
  //Calling the data from the store using the useSelector
  const purchasedItemsList = useSelector((state) =>
    state.items.availableItemsList.filter((item) => item.price)
  )

  return (
    <View style={styles.screen}>
      <FlatList
        data={purchasedItemsList}
        renderItem={(itemData) => (
          <TouchableNativeFeedback
            onPress={() => {
              props.navigation.navigate({
                routeName: "ItemInfo",
                params: {
                  itemId: itemData.item.id,
                },
              })
            }}>
            <View style={styles.itemRow}>
              <Text style={styles.textCustom}>{itemData.item.name}</Text>
              <Text style={styles.textCustom}>{itemData.item.price}kn</Text>
            </View>
          </TouchableNativeFeedback>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    borderBottomColor: Colors.accent,
    borderBottomWidth: 1,
  },
  textCustom: {
    fontSize: 20,
    color: Colors.primary,
  },
})

export default PurchaseHistoryScreen
