import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import callGoogleVisionAsync from "./googleCloudVisionHelper";
//import MissingComponent from "./foodanalysis"
import findTrash from "./FindTrash";
import logo from "./assets/icon.png"
import * as Speech from 'expo-speech';
import openai from "./openAI";

//get permission for camera 
export default function App() {
  console.log("ENTERING App.js");
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [photo, setPhoto] = useState();
  const [showRecommendation, setShowrecommendation] = useState();
  //const [photoduplicate, setPhotoduplicate] = useState();
  //const [text, setText] = useState("Please add an image");
  const [scannedvalues, setScannedvalues] = useState("Please add an image");

 //Sets Permission to use camera as granted
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }
//Allows to take a picture
  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    //takes the picture
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    console.log("picture taken");
    const responseData = await callGoogleVisionAsync(newPhoto.base64);
    console.log("Google responseData ==> " , responseData);
    setScannedvalues(responseData);
    setPhoto(newPhoto);
    console.log("Response from Google Completed" );

    //savePhoto();

  };

  let reset = () => {
    //shareAsync(photo.uri).then(() => {
    setPhoto(undefined);
    setShowrecommendation(false);
  };

  if (photo) {
    console.log("====>Inside photo=true method");
    //Share the pic function
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
      //setPhoto(undefined);
      });
    };

    //save the values pulled from Google API
    let values = findTrash(scannedvalues);
    let openAiResponse = openai(values);

    console.log("In App.js -- " + openAiResponse);
    //text to speech of all the things the GOogle API pulls 
    //Speech.speak("There is a");
    //Speech.speak(openAiResponse);
    for (var count = 0; count < values.length; count+=1){
      //Speech.speak(values[count]);
    }
      return (
          //the picture becomes the button to go back to the home page after the first button is clicked
          <TouchableOpacity style = {styles.buttonContainer} activeOpacity = {0.5} onPress={() => reset()}>
          <Image source={{ uri: "data:image/jpg;base64," + photo.base64 }} style = {{width: 420, height: 910}} ></Image>
          </TouchableOpacity>
       
      );
    
    
  }

  console.log("Outside photo=true method");


  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        {/* <<Button title="Take Food Pic" onPress={takePic} />> */}
        <TouchableOpacity style = {styles.buttonContainer} activeOpacity = {0.5} onPress={takePic}>
          <Image source = {logo} style = {{width: 420, height: 910}} ></Image>
        </TouchableOpacity>


      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}





const styles = StyleSheet.create({
  //creates a box used to contain the button
  newbox: {
    borderWidth: 3,
    borderRadius: 10,
    width: 400,
    backgroundColor:"white",
    borderColor: "#60A76D",
    margin: 5,
    flex:1,
   
  },
  
  buttonContainer: {
    backgroundColor: '#fff',
    
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1,
    margin: 20,
    borderWidth: 4,
    borderRadius: 30,
    borderColor: "#60A76D"
  
  },
  
  space: {
    //width: 10, // or whatever size you need
    height: 15,
    //color: "white",
  },
  
});
