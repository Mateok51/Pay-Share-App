import React from "react"
import {
  TouchableNativeFeedback,
  View,
  ImageBackground,
  Text,
  StyleSheet,
} from "react-native"

const Card = (props) => {
  return (
    <TouchableNativeFeedback onPress={props.showDetails}>
      <View style={styles.cardContainer}>
        <ImageBackground
          style={styles.bgImage}
          source={{ uri: props.imageUrl }}>
          <View style={styles.availabilityContainer}>
            <View
              style={
                props.ps4 === "Available"
                  ? { ...styles.availableText, ...styles.availabilityText }
                  : { ...styles.notAvailableText, ...styles.availabilityText }
              }>
              <Text style={styles.availableString}>PHYSICAL</Text>
            </View>
            <View
              style={
                props.ps5 === "Available"
                  ? { ...styles.availableText, ...styles.availabilityText }
                  : { ...styles.notAvailableText, ...styles.availabilityText }
              }>
              <Text style={styles.availableString}>DIGITAL</Text>
            </View>
          </View>
        </ImageBackground>
        <Text style={styles.titleName}>{props.name}</Text>
      </View>
    </TouchableNativeFeedback>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#4059ad",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 6,
    marginVertical: 10,
  },
  bgImage: {
    height: 200,
    width: "100%",
  },
  availabilityContainer: {
    flexDirection: "row",
    marginHorizontal: 5,
  },
  availabilityText: {
    width: "30%",
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    opacity: 0.8,
  },
  notAvailableText: {
    backgroundColor: "red",
  },
  availableText: {
    backgroundColor: "green",
  },
  availableString: {
    color: "white",
    width: 67,
  },
  titleName: {
    fontSize: 22,
    color: "white",
    paddingVertical: 1,
  },
})

export default Card
