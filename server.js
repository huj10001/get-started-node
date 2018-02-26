var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


var ibmdb = require('ibm_db');
var mydb;
var mydb_kilby;
var kilby_data = [];
var sensor_data = [];
var topology_data = [];
var network_stat_data = [];
var network_stat_data_plus = [];
var gateway_data = [];
var num_of_sensor = 0;
loadNumSensor();
// for(var j=0;j<50;j++){
//   kilby_data[j] = [];
//   sensor_data[j] = [];
//   topology_data[j] = [];
// }
var kilby_all= [];
var myurl = "https://89c13691-0906-4a2b-98ef-801692e3590a-bluemix:4e714e8e0d041063bd2a4e439f057e60c034dd4afdee04224e3e6f4f8441bf55@89c13691-0906-4a2b-98ef-801692e3590a-bluemix.cloudant.com";
var ibmdb_url = "DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4";


// if (typeof localStorage === "undefined" || localStorage === null) {
//   var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./scratch');
// }

// localStorage.setItem('test', 100);
// console.log("local storage : "+localStorage);
// console.log("test : "+localStorage.getItem('test'));
// localStorage.setItem("test",test);
// console.log(localStorage.getItem("test"));
// localStorage.setItem('favoriteflavor','vanilla');  

// var GoogleMapsAPI = require('googlemaps');
// var gmAPI = new GoogleMapsAPI();
// var params = {
//   center: '444 W Main St Lock Haven PA',
//   zoom: 15,
//   size: '500x400',
//   maptype: 'roadmap',
//   markers: [
//     {
//       location: '300 W Main St Lock Haven, PA',
//       label   : 'A',
//       color   : 'green',
//       shadow  : true
//     },
//     {
//       location: '444 W Main St Lock Haven, PA',
//       icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
//     }
//   ],
//   style: [
//     {
//       feature: 'road',
//       element: 'all',
//       rules: {
//         hue: '0x00ff00'
//       }
//     }
//   ],
//   path: [
//     {
//       color: '0x0000ff',
//       weight: '5',
//       points: [
//         '41.139817,-77.454439',
//         '41.138621,-77.451596'
//       ]
//     }
//   ]
// };
// gmAPI.staticMap(params); // return static map URL 
// gmAPI.staticMap(params, function(err, binaryImage) {
//   // fetch asynchronously the binary image 
// });

/* Endpoint to greet and add a new visitor to database.
* Send a POST request to localhost:3000/api/visitors with body
* {
* 	"name": "Bob"
* }
*/
app.post("/api/sensor", function (request, response) {
  var start_time = request.body.startTime;
  var end_time = request.body.endTime;
  var marker_id = request.body.markerId;
  console.log('start:'+start_time+' end:'+end_time+' id:'+marker_id);
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
    conn.query(
      'select * from BLUADMIN.NW_DATA_SET_PER_02202018_WHOLEWEEK where SENSOR_ID=? and TIMESTAMP>=? and TIMESTAMP<=?'
      ,[marker_id, start_time, end_time], function (err, data) {
        if (err) {
          return console.log(err.message);
        }
        console.log('Found %d resulted data with id %s', data.length, marker_id);
        if(data.length>0){
          sensor_data[parseInt(marker_id)] = [];
          for(var i=0;i<data.length;i++){
            sensor_data[parseInt(marker_id)].push(data[i]);
          }
          response.send('done');
          return;
        }
      });
  });
  // request.body._id = request.body._id.toString();
  // insertObj = request.body;
  // if(!mydb_kilby) {
  //   console.log("No database.");
  //   // response.send("Hello " + userName + "!");
  //   return;
  // }
  // // insert the username as a document
  // console.log("receive new data: " + JSON.stringify(insertObj));
  // mydb_kilby.insert(
  //   insertObj, 
  //   function(err, body, header) {
  //     if (err) {
  //       return console.log('[mydb.insert] ', err.message);
  //     }
  //     console.log("insert new data: " + JSON.stringify(insertObj));
  //   // response.send("Hello " + userName + "! I added you to the database.");
  // });
  // console.log("new data!!" + JSON.stringify(request.body));
});

app.get("/api/gateway", function (request, response) {
  response.json(gateway_data);
  return;
});

app.get("/api/topology", function (request, response) {
  response.json(topology_data);
  return;
});

app.get("/api/networkstat", function (request, response) {
  response.json(network_stat_data);
  return;
});

app.get("/api/networkstatplus", function (request, response) {
  response.json(network_stat_data_plus);
  return;
});

app.get("/api/sensor", function (request, response) {
  response.json(sensor_data);
  return;
});

// var googleMapsClient = require('@google/maps').createClient({
//   key:  'AIzaSyAjPWQR-VcoynKYktMgVVPHHvWUM-8ZhGs'
// });
// // Geocode an address.
// googleMapsClient.geocode({
//   address: '1600 Amphitheatre Parkway, Mountain View, CA'
// }, function(err, response) {
//   if (!err) {
//     console.log(response.json.results);
//   }
// });

// load local VCAP configuration  and service credentials
// var vcapLocal;
// try {
//   vcapLocal = require('./vcap-local.json');
//   console.log("Loaded local VCAP", vcapLocal);
// } catch (e) { }

// const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

// const appEnv = cfenv.getAppEnv(appEnvOpts);


// /* insert */
// if (appEnv.services['DB2']) {
//   // Load the Cloudant library.
//   var Cloudant = require('cloudant');

//   // Initialize database with credentials
//   var cloudant = Cloudant(appEnv.services['DB2'][0].credentials);
//   // cloudant = Cloudant({url: myurl, plugin:'retry', retryAttempts:5, retryTimeout:10000 });

//   //database name
//   var dbName = 'mydb';

//   // Create a new "mydb" database.
//   cloudant.db.create(dbName, function(err, data) {
//     if(!err) //err if database doesn't already exists
//       console.log("Created database: " + dbName);
//   });

//   // Specify the database we are going to use (mydb)...
//   mydb = cloudant.db.use(dbName);
// }
/*  ******/



/* read */
// if (appEnv.services['DB2']) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  /* db2 gateway */
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
    if(err) return console.log(err);
    conn.query('select distinct GATEWAY_NAME from BLUADMIN.TOPOLOGY_DATA', function (err, data) {
      console.log('gateway:', data);
      for(var i=0;i<data.length;i++){
        gateway_data.push(data[i]);
      }
    });
  });

  /* db2 topology */
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
    if(err) return console.log(err);
    conn.query('select t.SENSOR_ID, t.GPS_LAT, t.GPS_LONG, t.PARENT, t.GATEWAY_NAME from BLUADMIN.TOPOLOGY_DATA t inner join (select SENSOR_ID, max(TIMESTAMP) as MaxTime from BLUADMIN.TOPOLOGY_DATA group by SENSOR_ID) tm on t.SENSOR_ID = tm.SENSOR_ID and t.TIMESTAMP = tm.MaxTime', function (err, data) {
      console.log('topology data:', data);
      for(var i=0;i<data.length;i++){
        var sid = data[i]['SENSOR_ID'];
        topology_data[sid] = data[i];
      }
    });
  });


  /* db2 network stat */
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
    if(err) return console.log(err);
    // conn.query('select SENSOR_ID,AVG(NUM_PARENT_CHANGE),AVG(NUM_SYNC_LOST),AVG(AVG_DRFIT),AVG(NUM_MAC_OUT_OF_BUFFER) from BLUADMIN.NW_DATA_SET_NW_INFO group by SENSOR_ID', function (err, data) {
      conn.query('select SENSOR_ID,AVG(RTT) from BLUADMIN.NW_DATA_SET_LATENCY group by SENSOR_ID', function (err, data) {
        console.log('network stat data:', data);
        for(var i=0;i<data.length;i++){
          var sid = data[i]['SENSOR_ID'];
          network_stat_data[sid] = data[i];
        }
      });

      conn.query('select SENSOR_ID,AVG(MAC_TX_TOTAL), AVG(MAC_TX_FAIL), AVG(APP_PER_SENT), AVG(APP_PER_LOST) from BLUADMIN.NW_DATA_SET_PER_02202018_WHOLEWEEK group by SENSOR_ID', function (err, data) {
        console.log('network stat data plus:', data);
        for(var i=0;i<data.length;i++){
          var sid = data[i]['SENSOR_ID'];
          network_stat_data_plus[sid] = data[i];
        }
      });
    });


var num_of_rows = 0;
query1();

function fetchData(node_id, offset_start, offset_end){
  var sensor_id = parseInt(node_id);
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
    if(err) return console.log(err);
    conn.query(
      'select * from BLUADMIN.NW_DATA_SET_PER_02202018_WHOLEWEEK where SENSOR_ID=? order by TIMESTAMP desc fetch first 10 rows only'
      ,[sensor_id], function (err, data) {
        console.log('Found %d new data with id %s', data.length, node_id);
        if(data.length>0){
          for(var i=0;i<data.length;i++){
            if(sensor_data[parseInt(node_id)] == null){
              sensor_data[parseInt(node_id)] = [];
              sensor_data[parseInt(node_id)].push(data[i]);
            }
            else{
              sensor_data[parseInt(node_id)].push(data[i]);
            }  
          }
          console.log(sensor_data[parseInt(node_id)]);
        }
      });
  });
}


function convertTime(timestamp_string){
  var timestamp = parseInt(timestamp_string);
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var formattedTime = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
}

function loadNumSensor(){
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function(err, conn) {
    if(err) return console.log(err);
    conn.query('select MAX(SENSOR_ID) from BLUADMIN.TOPOLOGY_DATA', function (err, data) {
      console.log('Num of sensors: '+data[0]['1']);
      num_of_sensor = data[0]['1']+1;
    })
  });
}

function query1(){
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
    if(err) return console.log(err);
    conn.query('select count(*) from BLUADMIN.NW_DATA_SET_PER', function (err, data) {
      console.log('Num of rows: '+data[0]['1']);
      if(data[0]['1'] > num_of_rows){
        var offset_start = num_of_rows;
        var offset_end = data[0]['1'] - num_of_rows;
        console.log('start offset: '+offset_start+', end offset: '+offset_end);
        conn.query('select distinct SENSOR_ID from BLUADMIN.NW_DATA_SET_PER', function (err, data) {
          for(var i=0;i<data.length;i++){
            fetchData(data[i]['SENSOR_ID'].toString(), offset_start, offset_end);
          }
        });
        num_of_rows = data[0]['1'];
      }else{
        console.log('No new data.');
      }
    });
  });
}

function checkSimilarity(id1){
  var similarity_dict = [];
  var sorted = [];
  for(var id2 = 3;id2<21;id2++){
    if(kilby_data[id1] && kilby_data[id2] && id2!=id1){
      var arrayA = [];
      var arrayB = [];
      for(var i=0;i<kilby_data[id1].length;i++){
        arrayA[i] = kilby_data[id1][i][1];
      }
      for(var j=0;j<kilby_data[id2].length;j++){
        arrayB[j] = kilby_data[id2][j][1];
      }

      var matches = 0;
      for (i=0;i<arrayA.length;i++) {
        if (Math.abs(arrayA[i]-arrayB[i])/arrayB[i] < 0.2)
          matches++;
      }
      var similarity_rate = matches/Math.min(arrayA.length, arrayB.length);
      if(similarity_rate > 0.2){
        similarity_dict.push([id2, similarity_rate]);
      }

    }
  }
  return similarity_dict;
}

function compare_rate(a,b){
  return a[1] - b[1];
}

function findLineByLeastSquares(values_x, values_y) {
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var count = 0;
  var x = 0;
  var y = 0;
  var values_length = values_x != null ? values_x.length : 0;

  if (values_length === 0) {
    return [ [], [] ];
  }

  for (var v = 0; v < values_length; v++) {
    x = values_x[v];
    y = values_y[v];
    sum_x += x;
    sum_y += y;
    sum_xx += x*x;
    sum_xy += x*y;
    count++;
  }

  var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
  var b = (sum_y/count) - (m*sum_x)/count;
  var result_values_x = [];
  var result_values_y = [];

  for (var v = 0; v < values_length; v++) {
    x = values_x[v];
    y = x * m + b;
    result_values_x.push(x);
    result_values_y.push(y);
  }

  return [result_values_x, result_values_y];
}

function linearRegression(y,x){
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;
  
  for (var i = 0; i < y.length; i++) {

    sum_x += x[i];
    sum_y += y[i];
    sum_xy += (x[i]*y[i]);
    sum_xx += (x[i]*x[i]);
    sum_yy += (y[i]*y[i]);
  } 
  
  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
  lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
  
  return lr;
}

function polynomialRegression(){
  var data = kilby_data[15];
  var regression = require("regression");
  const result = regression.polynomial(data, { order: 8 });
  var last = data.length-1;
  var last_time = parseInt(data[last][0]);
  console.log("current: " + data[last]);
  console.log("next: "+ result.predict(last_time+1));
}

app.use(express.static(__dirname + '/views'));



var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
