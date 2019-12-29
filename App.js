import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Modal } from 'react-native';
import firebase from 'firebase';

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
      color0:'#FFFFFF',
      color1:'#FFFFFF',
      modal1Visible:false,
      modal2Visible:false
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
    
  }
  getColor(data){
    if(data.slice(-1)[0]['state'] === 0){
      return '#75F735'
    }else if(data.slice(-1)[0]['state'] === 1){
      return '#F7EB35'
    }else if(data.slice(-1)[0]['state'] === 2){
      return '#F74F35'
    }else{
      return '#ffffff'
    }
}

  getData() {
    const rootRef = firebase.database().ref();
    // const rootRef = firebase.database();
    rootRef.on('value', snap => {
      if(snap.val()['sm00']['state'] === 2){
        this.setModal1Visible(true);
      }
      if(snap.val()['sm01']['state'] === 2){
        this.setModal2Visible(true);
      }
      var list1 = Object.values(snap.val()['sm00']['ts'])
      var list2 = Object.values(snap.val()['sm01']['ts'])
      // console.log("Data: ", list1)
      list1.sort((a, b) => (a.time > b.time) ? 1 : -1 )
      list2.sort((a, b) => (a.time > b.time) ? 1 : -1 )
      // console.log("Last state: ", list1)
      list1 = list1.filter(this.myFunct)
      list2 = list2.filter(this.myFunct)
      
      if(typeof list1 != "undefined" && list1 != null && list1.length != null
      && list1.length > 0){
        this.setState({ 
          chartData1: list1,
          color0:this.getColor(list1),
        }, () => {
          console.log("getData1 success")
        });
      }else{
        console.log("SiMonster 1 no data")
      }

      if(typeof list2 != "undefined" && list2 != null && list2.length != null
      && list2.length > 0){
        this.setState({ 
          chartData2: list2,
          color1:this.getColor(list2),
        }, () => {
          console.log("getData2 success")
        });
      }else{
        console.log("SiMonster 2 no data")
      }
    });
  }

  _handleChoice(theChosenOne) {
    this.getData(theChosenOne);
  }

  _onPressButton(){
    alert('you tapped the button')
  }

  setModal1Visible(visible) {
    this.setState({modal1Visible: visible});
  }

  setModal2Visible(visible) {
    this.setState({modal2Visible: visible});
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
              <View style={styles.button,{backgroundColor:this.state.color0}}>
                <Text style={styles.buttonText}>SiMonster 0</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={this._onPressButton} underlayColor="white">
              <View style={styles.button,{backgroundColor:this.state.color1}}>
                <Text style={styles.buttonText}>SiMonster 1</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal1Visible}
          onRequestClose={() => {
            this.setModal1Visible(!this.state.modal1Visible);
          }}>
          <View style={styles.screen}>
            <View style={styles.mod}>
              <Text style={styles.modalText}>SiMonster 1 Full!</Text>
              <TouchableHighlight
                onPress={() => {
                  this.setModal1Visible(!this.state.modal1Visible);
                }}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal2Visible}
          onRequestClose={() => {
            this.setModal2Visible(!this.state.modal2Visible);
          }}>
          <View style={styles.screen}>
            <View style={styles.mod}>
              <Text style={styles.modalText}>SiMonster 2 Full!</Text>
              <TouchableHighlight
                onPress={() => {
                  this.setModal2Visible(!this.state.modal2Visible);
                }}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

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
  mod: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor:'#fc0000',
  },
  modalText: {
    fontSize: 72,
    textAlign: 'center',
    margin: 10,
    color:'#000000'
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
