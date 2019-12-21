import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import PushNotification from 'react-native-push-notification';
import PushController from './PushController'

var firebaseConfig = {
  apiKey: "AIzaSyCq89rpk8CsXk_eAy_-WR7Dyo7kai4SdfA",
  authDomain: "si-monster.firebaseapp.com",
  databaseURL: "https://si-monster.firebaseio.com",
  projectId: "si-monster",
  storageBucket: "si-monster.appspot.com",
  messagingSenderId: "902434644807",
  appId: "1:902434644807:web:06b2c690c0cab9426ba262",
  measurementId: "G-CLTV9E3320"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData1:[],
      chartData2:[],
      color1:'#FFFFFF',
      color2:'#FFFFFF'
    }
  }

  componentDidMount() {
    this.getData();
  }

  myFunct(value, index, array){
    if(value['time'] > (Date.now() - 86400000)){
      var d = new Date(value['time'])
      value['time'] = d.getHours().toString() + ":" + d.getMinutes().toString()
      return value
    }
  }

  getColor(data){
    if(data.slice(-1)[0]['state'] === 0){
      return '#75F735'
    }else if(data.slice(-1)[0]['state'] === 1){
      return '#F7EB35'
    }else if(data.slice(-1)[0]['state'] === 2){
      return '#F74F35'
    }else{
      return '#000000'
    }
  }

  getData() {
    const rootRef = firebase.database().ref();
    // const rootRef = firebase.database();
    rootRef.on('value', snap => {
      var list1 = Object.values(snap.val()['sm00']['ts'])
      // var list2 = Object.values(snap.val()['tong 2'])
      list1.sort((a, b) => (a.time > b.time) ? 1 : -1 )
      var list2 = list1.filter(this.myFunct)
      // console.log("Data: ", list2)
      // console.log("Last state: ", list2.slice(-1)[0]['state'])
      this.setState({ 
        chartData1: list2,
        color1:this.getColor(list2)
        // chartData2: list2.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1 )
      }, () => {
        console.log("getData success")
      });
    });
  }

  _handleChoice(theChosenOne) {
    this.getData(theChosenOne);
  }

  sendNotification() {
    PushNotification.localNotification({
      message: 'state 2 capacity',
      importance: "high",
      priority: "high",
      vibrate: true,
    });
  }

  _onPressButton(){
    // alert('you tapped the button')
    this.sendNotification
  }

  render() {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.welcome}>SiMonster-App</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.but}>
            <TouchableHighlight onPress={this._onPressButton} underlayColor="white">
              <View style={styles.button,{backgroundColor:this.state.color1}}>
                <Text style={styles.buttonText}>SiMonster 1</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={this._onPressButton} underlayColor="white">
              <View style={styles.button,{backgroundColor:this.state.color2}}>
                <Text style={styles.buttonText}>SiMonster 2</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
        {/* <PushController /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#dadde3',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color:'#ffffff'
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#074387',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    // backgroundColor: '#2196F3'
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'black'
  },
  but: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#000000',
  }
});
