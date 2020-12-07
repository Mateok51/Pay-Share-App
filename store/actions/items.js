import ItemModel from "../../models/itemModel"
export const FETCH_ITEM_LIST = "FETCH_ITEM_LIST"
export const CREATE_ITEM = "CREATE_ITEM"
export const UPDATE_ITEM_DATA = "UPDATE_ITEM_DATA"
export const DELETE_ITEM = "DELETE_ITEM"
export const ADD_HISTORY = "ADD_HISTORY"

export const fetchItemList = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/items.json?auth=${token}`
    )
    const resData = await response.json()
    const loadedItemList = []
    for (const key in resData) {
      loadedItemList.push(
        new ItemModel(
          key,
          resData[key].name,
          resData[key].ps4,
          resData[key].ps5,
          resData[key].owner,
          resData[key].background_image,
          resData[key].reservations,
          resData[key].price,
          resData[key].ps4history,
          resData[key].ps5history,
          resData[key].note
        )
      )
    }
    dispatch({ type: FETCH_ITEM_LIST, itemList: loadedItemList })
  }
}

export const createItem = (
  name,
  ps4,
  ps5,
  background_image,
  owner,
  reservations,
  price,
  note
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/items.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          ps4,
          ps5,
          owner,
          background_image,
          reservations,
          price,
          note,
        }),
      }
    )

    if (!response.ok) {
      const errorResData = await response.json()
      const errorId = errorResData.error
      if (errorId === "Permission denied") {
        throw new Error(
          "You do not have the level of access necessary to perform the operation you requested. "
        )
      }
      throw new Error("Something went wrong")
    }
    const resData = await response.json()

    dispatch({
      type: CREATE_ITEM,
      itemData: {
        id: resData.name,
        name,
        ps4,
        ps5,
        owner,
        background_image,
        reservations,
        price,
        note,
      },
    })
  }
}

export const updateItemData = (
  id,
  name,
  ps4,
  ps5,
  background_image,
  owner,
  reservations,
  price,
  note
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/items/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          ps4,
          ps5,
          background_image,
          owner,
          reservations,
          price,
          note,
        }),
      }
    )
    if (!response.ok) {
      const errorResData = await response.json()
      const errorId = errorResData.error
      if (errorId === "Permission denied") {
        throw new Error(
          "You do not have the level of access necessary to perform the operation you requested. "
        )
      }
      throw new Error("Something went wrong")
    }
    dispatch({
      type: UPDATE_ITEM_DATA,
      itemId: id,
      itemData: {
        name,
        ps4,
        ps5,
        owner,
        background_image,
        reservations,
        price,
        note,
      },
    })
  }
}

export const deleteItem = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/items/${id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    )
    if (!response.ok) {
      const errorResData = await response.json()
      const errorId = errorResData.error
      if (errorId === "Permission denied") {
        throw new Error(
          "You do not have the level of access necessary to perform the operation you requested. "
        )
      }
      throw new Error("Something went wrong")
    }
    dispatch({ type: DELETE_ITEM, id: id })
  }
}

export const addToRentHistory = (gameId, console, date, name) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/items/${gameId}/${console}history.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          date,
        }),
      }
    )
  }
}
