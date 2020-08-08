import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import ListScreen from "./ListScreen";
import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYPXtag9VIkDMOlE1wSK7KbTXu3XTHnP4",
  authDomain: "spice-drwrs.firebaseapp.com",
  databaseURL: "https://spice-drwrs.firebaseio.com",
  projectId: "spice-drwrs",
  storageBucket: "spice-drwrs.appspot.com",
  // messagingSenderId: "sender-id",
  appId: "1:94864194005:android:cc210ac8b57e5248c4e55c",
  // measurementId: "G-measurement-id",
};

firebase.initializeApp(firebaseConfig);

const Root = () => {
  return (
    <PaperProvider>
      <ListScreen />
    </PaperProvider>
  );
};

export default Root;
