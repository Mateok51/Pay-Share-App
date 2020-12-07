import {
  FETCH_ITEM_LIST,
  CREATE_ITEM,
  UPDATE_ITEM_DATA,
  DELETE_ITEM,
} from "../actions/items"
import ItemModel from "../../models/itemModel"

const initialState = {
  availableItemsList: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ITEM_LIST:
      return { ...state, availableItemsList: action.itemList }
    case CREATE_ITEM:
      const newItem = new ItemModel(
        action.itemData.id,
        action.itemData.name,
        action.itemData.ps4,
        action.itemData.ps5,
        action.itemData.owner,
        action.itemData.background_image,
        action.itemData.reservations,
        action.itemData.price
      )
      return {
        ...state,
        availableItemsList: state.availableItemsList.concat(newItem),
      }
    case UPDATE_ITEM_DATA:
      const itemIndex = state.availableItemsList.findIndex(
        (item) => item.id === action.itemId
      )

      const updatedItem = new ItemModel(
        action.itemId,
        action.itemData.name,
        action.itemData.ps4,
        action.itemData.ps5,
        action.itemData.owner,
        action.itemData.background_image,
        action.itemData.reservations,
        action.itemData.price
      )
      const updatedAvailableItemList = [...state.availableItemsList]
      updatedAvailableItemList[itemIndex] = updatedItem
      return {
        ...state,
        availableItemsList: updatedAvailableItemList,
      }
    case DELETE_ITEM:
      return {
        ...state,
        availableItemsList: state.availableItemsList.filter(
          (item) => item.id !== action.id
        ),
      }
  }
  return state
}
