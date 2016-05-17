/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const APP_URL = 'http://sensorweb.io/pm25-app.html';

function checkLocation() {
  // Browser mode doesn't support cordova.plugins.diagnostic
  if (!cordova.plugins.diagnostic) {
    console.error("Platform does not support cordova.plugins.diagnostic");
    window.location = APP_URL;
    return;
  }

  cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
    if(!enabled){
      navigator.notification.confirm(
        'GPS is disabled - would you like to open Settings page to turn it ON?',
        function(result) {
          if(result === 1){ // Yes
            cordova.plugins.diagnostic.switchToLocationSettings();
          }
          window.location = APP_URL;
        },
        'Open Location Settings?',
        ['Yes', 'No']
      );
    } else {
      window.location = APP_URL;
    }
  }, function(error){
    console.error("The following error occurred: "+error);
  });
}

function checkConnection() {
  var networkState = navigator.connection.type;

  return new Promise(function(resolve, reject) {
    if (networkState === 'none') {
      navigator.notification.alert(
        'Please enable the network first',
        reject,
        'Network disabled'
      );
    } else {
      resolve();
    }
  });
}

var app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

      // Exit the app if there's no connection.
      checkConnection().then(
        function() {
          app.receivedEvent('deviceready');
          checkLocation();
        },
        function() {
          navigator.app.exitApp();
        }
      );
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');

      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');

      console.log('Received Event: ' + id);
    }
};

app.initialize();
