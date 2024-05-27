import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,  Button, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { useEffect, useState } from "react"
import Timer from './src/components/Timer';
import Header from './src/components/Headers';
import { Audio } from "expo-av"

const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"]

export default function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if(isActive){
      // Si esta activo correr el timer
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    }else{
      // clear interval
      clearInterval(interval);
    }
    
    if(time === 0){
      setIsActive(false);
      setIsWorking((prev) => !prev);
      setTime(isWorking ? 300 : 1500);
    }

    return () => clearInterval(interval);
  }, [isActive, time])

  function handleStartStop() {
    playSound();
    setIsActive(!isActive);
  }

  async function playSound(){
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/clickSound.mp3")
    )

    await sound.playAsync();
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors[currentTime]}]}>
      <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: Platform.OS === "android" && 30}}>
        <Text style={styles.text}>Pomodoro</Text>
        <Header 
          currentTime={currentTime}
          SetCurrentTime={setCurrentTime}
          setTime={setTime}
        />
        <Timer time={time}/>
        <TouchableOpacity onPress={handleStartStop} style={styles.button}>
          <Text style={{color: "white", fontWeight: "bold"}}>{isActive ? "STOP" : "START"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    fontSize: 32, 
    fontWeight: "bold",
    paddingTop: 25
  },
  button: {
    backgroundColor: "#333333",
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
    alignItems: "center"
  }
});
