import {
  CREATE_USER,
  FETCH_USER_LIST,
  ADD_PAYMENT_YEAR,
  DELETE_USER,
} from "../actions/user"
import UserItem from "../../models/user"

const initialState = {
  userList: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_LIST:
      return { ...state, userList: action.userList }
    case CREATE_USER:
      const newUser = new UserItem(action.gameData.id, action.gameData.name)
      return {
        ...state,
        userList: state.userList.concat(newUser),
      }
    case ADD_PAYMENT_YEAR:
      const paymentArray = action.paymentArray

      const paymentYear = action.paymentYear

      const userId = action.userId

      const userIndex = state.userList.findIndex((user) => user.id === userId)

      const updatedUser = {
        id: state.userList[userIndex].id,
        name: state.userList[userIndex].name,
        payments: {
          ...state.userList[userIndex].payments,
          [paymentYear]: paymentArray,
        },
      }

      const updatedUserList = [...state.userList]
      updatedUserList[userIndex] = updatedUser
      return {
        ...state,
        userList: updatedUserList,
      }
    case DELETE_USER:
      return {
        ...state,
        userList: state.userList.filter((user) => user.id !== action.id),
      }
  }
  return state
}
