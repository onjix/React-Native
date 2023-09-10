import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "fb21ab1f6cccc48a029576d8e469a260";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("00:00:00")) {
          return weather;
        }
      })
    );
  }
  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "teal" }}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      {/* pagingEnabled: slides strong  */}
      {/* horizontal: 세로 -> 가로  */}
      <ScrollView
        pagingEnabled //slides strong
        horizontal //세로 -> 가로
        showsHorizontalScrollIndicator={false} //bottom slidebar remove
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{ marginTop: 10 }} />
          </View>
        ) : (
          days.map((day, index) =>
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              {/* <Text style={styles.description}>{day.weather[0].main}</Text> */}
            </View>)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "teal",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 130,
    marginTop: 40,
  },
  description: {
    fontSize: 60,
    marginTop: -10,
  },
  tinyText: {
    fontSize:20,
  },
})