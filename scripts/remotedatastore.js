// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA9N8F7kOiIf8umGCGYYbUjJisshzrLGYk",
  authDomain: "coffee-run-24126.firebaseapp.com",
  databaseURL: "https://coffee-run-24126.firebaseio.com",
  projectId: "coffee-run-24126",
  storageBucket: "coffee-run-24126.appspot.com",
  messagingSenderId: "737065798511",
  appId: "1:737065798511:web:7934de28cff9562db4769a",
  measurementId: "G-LR3Z4C174M",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var orders = firebase.database().ref("orders");

(function (window) {
  "use strict";
  var App = window.App || {};
  var $ = window.jQuery;

  function RemoteDataStore(url) {
    if (!url) {
      throw new Error("No remote URL supplied.");
    }

    this.serverUrl = url;
  }

  RemoteDataStore.prototype.add = function (key, val) {
    $.post(this.serverUrl, val, function (serverResponse) {
      var values = Object.values(serverResponse);
      var newOrders = orders.child(values[6]); // use the id as the document id for the child of "orders"
      newOrders.set({
        strength: values[1],
        flavor: values[2],
        size: values[3],
        emailAddress: values[4],
        coffee: values[5],
      });
      console.log(serverResponse);
    });
  };

  RemoteDataStore.prototype.getAll = function (cb) {
    $.get(this.serverUrl, function (serverResponse) {
      console.log(serverResponse);
      cb(serverResponse);
    });
  };

  RemoteDataStore.prototype.get = function (key, cb) {
    $.get(this.serverUrl + "/" + key, function (serverResponse) {
      console.log(serverResponse);
      cb(serverResponse);
    });
  };

  RemoteDataStore.prototype.remove = function (key) {
    orders
      .child("users")
      .orderByChild("email")
      .equalTo(key)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var email = childSnapshot.val().email;
          console.log(email);
          var uid = childSnapshot.val().uid;
          console.log(uid);
        });
      });
    $.ajax(this.serverUrl + "/" + key, {
      type: "DELETE",
    });
  };
  App.RemoteDataStore = RemoteDataStore;
  window.App = App;
})(window);
