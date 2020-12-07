export const CREATE_USER = "CREATE_USER"
export const FETCH_USER_LIST = "FETCH_USER_LIST"
export const ADD_PAYMENT_YEAR = "ADD_PAYMENT_YEAR"
export const DELETE_USER = "DELETE_USER"

export const createUser = (name) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/users.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
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
      type: CREATE_USER,
      gameData: {
        id: resData.name,
        name,
      },
    })
  }
}

export const fetchUserList = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/users.json?auth=${token}`
    )
    const resData = await response.json()
    const loadedUserList = []
    for (const key in resData) {
      loadedUserList.push({
        ...resData[key],
        id: key,
      })
    }
    dispatch({ type: FETCH_USER_LIST, userList: loadedUserList })
  }
}

export const createNewPaymentYear = (
  userId,
  paymentYear,
  ajanuaryValue,
  bfebruaryValue,
  cmarchValue,
  daprilValue,
  emayValue,
  fjuneValue,
  gjulyValue,
  haugustValue,
  iseptemberValue,
  joctoberValue,
  knovemberValue,
  ldecemberValue
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/users/${userId}/${paymentYear}.json?auth=${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ajanuaryValue,
          bfebruaryValue,
          cmarchValue,
          daprilValue,
          emayValue,
          fjuneValue,
          gjulyValue,
          haugustValue,
          iseptemberValue,
          joctoberValue,
          knovemberValue,
          ldecemberValue,
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
    const arrayPayments = Object.values(resData)

    dispatch({
      type: ADD_PAYMENT_YEAR,
      paymentArray: arrayPayments,
      paymentYear: paymentYear,
      userId: userId,
    })
  }
}

export const createTotalYearPayment = (userId, paymentYear, total) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/users/${userId}/${paymentYear}Total.json?auth=${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total,
        }),
      }
    )
  }
}

export const deleteUser = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/users/${id}.json?auth=${token}`,
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
    dispatch({ type: DELETE_USER, id: id })
  }
}

export const addBorrowedGame = (userId, gameId, gameName) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/users/${userId}/borrowedGames/${gameId}.json?auth=${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameName,
        }),
      }
    )
  }
}

export const deleteBorrowedGame = (userId, gameId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/users/${userId}/borrowedGames/${gameId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    )
  }
}

export const updateUserName = (id, name) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(
      `https://payshare-a62af-default-rtdb.firebaseio.com/users/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
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
  }
}
