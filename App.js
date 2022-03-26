import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

export default function App() {
  const [location, onChangeLocation] = useState("current location");
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const refresh = (e) => setReload(reload + 1);

  useEffect(() => {
    setLoading(true);
    fetch(
      "http://api.openweathermap.org/data/2.5/onecall?lat=22.5726723&lon=88.3638815&units=metric&appid=ddb87a4d1072c60b96416be9283aa04e"
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
      });
  }, [reload]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textBox}
        value={location}
        onChangeText={onChangeLocation}
      />

      {weatherData && (
        <View style={styles.weatherContainer}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 15,
                color: "#3c3c3c",
              }}
            >
              {dayjs().format("LL")}
            </Text>
            <Text style={{ fontSize: 20, color: "white" }}>
              <Text>Day {Math.round(weatherData.daily[0].temp.day)}°|</Text>
              <Text>Night {Math.round(weatherData.daily[0].temp.night)}°</Text>
            </Text>
            <Text style={{ lineHeight: 70, color: "white" }}>
              <Text
                style={{
                  fontSize: 64,
                  fontWeight: "bold",
                }}
              >
                {Math.round(weatherData.current.temp)}°
              </Text>
              <Text style={{ fontSize: 36 }}>C</Text>
            </Text>
            <Text style={{ fontSize: 16, color: "white" }}>
              Feels like {Math.round(weatherData.current.feels_like)}°
            </Text>
          </View>
          <Image
            style={{ flex: 1 }}
            source={{
              uri: "https://i.imgur.com/SrQAYJe.png",
              width: 180,
              height: 180,
            }}
          />
        </View>
      )}
      {weatherData && (
        <View
          style={{
            width: "75%",
            top: 150,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={styles.info}>Cloud Cover:</Text>
            <Text style={styles.info}>Humidity:</Text>
            <Text style={styles.info}>Pressure:</Text>
            <Text style={styles.info}>Dew point:</Text>
            <Text style={styles.info}>Precipitation:</Text>
          </View>
          <View>
            <Text style={styles.info}>{weatherData.current.clouds}%</Text>
            <Text style={styles.info}>{weatherData.current.humidity}%</Text>
            <Text style={styles.info}>{weatherData.current.pressure}hPa</Text>
            <Text style={styles.info}>
              {Math.round(weatherData.current.dew_point)}°
            </Text>
            <Text style={styles.info}>
              {weatherData.minutely.reduce(
                (sum, { precipitation }) => sum + precipitation,
                0
              ) / weatherData.minutely.length}
              mm
            </Text>
          </View>
        </View>
      )}
      {weatherData && (
        <View
          style={{
            width: "90%",
            top: 200,
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <View>
            <Image
              style={{ width: 96, height: 96 }}
              source={require("./assets/sunrise.png")}
            />
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                fontWeight: "bold",
                color: "#3c3c3c",
              }}
            >
              {dayjs.unix(weatherData.current.sunrise).format("LT")}
            </Text>
          </View>
          <View>
            <Image
              style={{ width: 96, height: 96 }}
              source={require("./assets/sunset.png")}
            />
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                fontWeight: "bold",
                color: "#3c3c3c",
              }}
            >
              {dayjs.unix(weatherData.current.sunset).format("LT")}
            </Text>
          </View>
        </View>
      )}
      <TouchableHighlight
        style={{ top: 250, borderRadius: 4 }}
        onPress={refresh}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: "purple",
            flexDirection: "row",
            borderRadius: 4,
          }}
        >
          <Text style={{ color: "white" }}>REFRESH</Text>
          {loading && <ActivityIndicator color="#fff" />}
        </View>
      </TouchableHighlight>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "dodgerblue",
    alignItems: "center",
  },
  textBox: {
    width: "90%",
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#3c3c3c",
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    borderRadius: 4,
    top: 60,
  },
  weatherContainer: {
    top: 100,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    fontSize: 20,
    color: "white",
  },
});
