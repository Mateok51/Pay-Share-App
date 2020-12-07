import React from "react"
import { Provider as PaperProvider } from "react-native-paper"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"
//Importing the navigation
import Navigator from "./navigation/Navigator"

import itemsReducer from "./store/reducers/items"
import authReducer from "./store/reducers/auth"
import userReducer from "./store/reducers/user"

const rootReducer = combineReducers({
  items: itemsReducer,
  auth: authReducer,
  users: userReducer,
})
const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Navigator />
      </PaperProvider>
    </Provider>
  )
}
