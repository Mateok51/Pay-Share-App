import React from "react"
import { Platform } from "react-native"
//Importing React Navigation 4 stack creator
import { createStackNavigator } from "react-navigation-stack"
//Importing the android material bottom navigator and ios bottom navigator
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"
import { createBottomTabNavigator } from "react-navigation-tabs"
//Importing the create app container
import { createAppContainer, createSwitchNavigator } from "react-navigation"
//Importing the icons for the bottom bar
import { Ionicons } from "@expo/vector-icons"

import Colors from "../constants/Colors"

//Importing new screens
import ItemListScreen from "../screens/items_screens/ItemListScreen"
import ItemManagamentScreen from "../screens/items_screens/ItemManagamentScreen"
import ItemInfoScreen from "../screens/items_screens/ItemInfoScreen"
import RentHistoryScreen from "../screens/items_screens/RentHistoryScreen"
import SubscriptionOverviewScreen from "../screens/subscription_screens/SubscriptionOverviewScreen"
import PurchaseHistoryScreen from "../screens/subscription_screens/PurchaseHistoryScreen"
import UserManagamentScreen from "../screens/subscription_screens/UserManagamentScreen"
import PaymentManagamentScreen from "../screens/subscription_screens/PaymentManagamentScreen"
import AuthScreen from "../screens/startup_screens/AuthScreen"
import LaunchScreen from "../screens/startup_screens/LaunchScreen"

//Default settings for all stack navigators
const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "white",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
}

const ItemsStackNavigator = createStackNavigator(
  {
    ItemList: {
      screen: ItemListScreen,
      navigationOptions: {
        title: "Item List",
      },
    },
    ItemInfo: {
      screen: ItemInfoScreen,
      navigationOptions: {
        title: "Item Details",
      },
    },
    ItemManagament: {
      screen: ItemManagamentScreen,
      navigationOptions: {
        title: "Item Management",
      },
    },
    RentHistory: {
      screen: RentHistoryScreen,
      navigationOptions: {
        title: "Rent History",
      },
    },
  },
  {
    defaultNavigationOptions: { ...defaultStackNavOptions },
  }
)

const SubscriptionStackNavigator = createStackNavigator(
  {
    SubscriptionOverview: {
      screen: SubscriptionOverviewScreen,
      navigationOptions: {
        title: "Subscription",
      },
    },
    PurchaseHistory: {
      screen: PurchaseHistoryScreen,
      navigationOptions: {
        title: "Bought Items",
      },
    },
    ItemInfo: {
      screen: ItemInfoScreen,
      navigationOptions: {
        title: "Item Details",
      },
    },
    ItemManagament: {
      screen: ItemManagamentScreen,
      navigationOptions: {
        title: "Item Management",
      },
    },
    RentHistory: {
      screen: RentHistoryScreen,
      navigationOptions: {
        title: "Rent history",
      },
    },
    UserManagement: {
      screen: UserManagamentScreen,
      navigationOptions: {
        title: "User Management",
      },
    },
    PaymentManagament: {
      screen: PaymentManagamentScreen,
      navigationOptions: {
        title: "Year payments",
      },
    },
  },
  {
    defaultNavigationOptions: { ...defaultStackNavOptions },
  }
)

const bottomTabConfig = {
  ItemSection: {
    screen: ItemsStackNavigator,
    navigationOptions: {
      title: "Item List",
      tabBarIcon: (tabInfo) => {
        return (
          <Ionicons
            name='logo-game-controller-b'
            size={25}
            color={tabInfo.tintColor}
          />
        )
      },
    },
  },
  SubscriptionSection: {
    screen: SubscriptionStackNavigator,
    navigationOptions: {
      title: "Subscription",
      tabBarIcon: (tabInfo) => {
        return <Ionicons name='md-card' size={25} color={tabInfo.tintColor} />
      },
    },
  },
}

const BottomTabNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(bottomTabConfig, {
        activeColor: "white",
        barStyle: {
          backgroundColor: Colors.primary,
        },
      })
    : createBottomTabNavigator(bottomTabConfig, {
        tabBarOptions: {
          activeTintColor: "white",
        },
      })

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: { ...defaultStackNavOptions },
  }
)

const MainNavigator = createSwitchNavigator({
  Startup: LaunchScreen,
  Auth: AuthNavigator,
  BottomNav: BottomTabNavigator,
})

export default createAppContainer(MainNavigator)
