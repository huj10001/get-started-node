var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var mydb;
var mydb_kilby;
var kilby_data = [];

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
app.post("/api/visitorsss", function (request, response) {
  var userName = request.body.name;
  if(!mydb) {
    console.log("No database.");
    response.send("Hello " + userName + "!");
    return;
  }
  // insert the username as a document
  // mydb.insert({ "name" : userName }, function(err, body, header) {
  //   if (err) {
  //     return console.log('[mydb.insert] ', err.message);
  //   }
  //   response.send("Hello " + userName + "! I added you to the database.");
  // });
});

/**
 * Endpoint to get a JSON array of all the visitors in the database
 * REST API example:
 * <code>
 * GET http://localhost:3000/api/visitors
 * </code>
 *
 * Response:
 * [ "Bob", "Jane" ]
 * @return An array of all the visitor names
 */
app.get("/api/visitorsss", function (request, response) {
  // var names = [];
  if(!mydb_kilby) {
    response.json(kilby_data);
    return;
  }

  mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
      // body.rows.forEach(function(row) {
        // if(row.doc.name)
          // names.push(row.doc.name);
          // json = [];
          // names.push(kilby_data);
      // });
      response.json(kilby_data);
    }
  });
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
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);


/* insert */
if (appEnv.services['cloudantNoSQLDB']) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  // Initialize database with credentials
  var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);

  //database name
  var dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);
}
/*  ******/



/* read */
if (appEnv.services['cloudantNoSQLDB']) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  // Initialize database with credentials
  var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);

  //database name
  var dbName_kilby = 'kilby_network_07_13_07_17_nobeacon_update_801_csv';

  cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});
  mydb_kilby = cloudant.db.use(dbName_kilby);
  // console.log('data fetch start');
  // setTimeout(query1, 1000);
  query1();
  setTimeout(query2, 3000);
  setTimeout(query3, 6000);
  setTimeout(query4, 9000);
  // console.log('data fetch complete');
  // fetchData('1');
  // fetchData('3');
  // fetchData('4');
  // fetchData('5');
  // fetchData('6');
  // fetchData('7');
  // fetchData('8');
  // fetchData('9');
  // fetchData('10');
  // fetchData('11');
  // fetchData('12');
  // fetchData('13');
  // fetchData('14');
  // fetchData('15');
  // fetchData('16');
  // fetchData('17');
  // fetchData('18');
  // fetchData('19');
  // fetchData('20');


  
//   mydb_kilby.find({selector:{id:'3'}}, function(er, result) {
//   if (er) {
//     throw er;
//   }

//   console.log('Found %d documents with id 3', result.docs.length);
//   // for (var i = 0; i < result.docs.length; i++) {
//     var kilby_data_temp = [];
//     for (var i = 0; i < result.docs.length; i++) {
//     // console.log('  app per: %s', result.docs[i].app_per);
    
//     kilby_data_temp.push([result.docs[i].ts, result.docs[i].app_per]);
//     kilby_data[3] = kilby_data_temp;
//     // console.log('  time: %s, per: %s', result.docs[i].ts, result.docs[i].app_per);
//     console.log(kilby_data[i]);
//   }
//   // console.log("all settttt");
//   // var ts = require("timeseries-analysis");
//   // var t     = new ts.main(ts.adapter.fromArray(kilby_data));
//   // console.log(t);
//   // var forecastDatapoint = 11; 
// // var coeffs = t.ARMaxEntropy({
// //     data: t.data.slice(0,10)
// // });
// // console.log(coeffs);
// // var forecast  = 0;  
// // for (var i=0;i<coeffs.length;i++) { 
// //     forecast -= t.data[10-i][1]*coeffs[i];
// // }
// // console.log("forecast",forecast);
// });

}

function fetchData(node_id){
  mydb_kilby.find({selector:{id:node_id}}, function(er, result){
    if(er){
      throw er;
    }
    console.log('Found %d documents with id %s', result.docs.length, node_id);
    var kilby_data_temp = [];
    // var per = 'app_per';
    for (var i=0;i<result.docs.length;i++){
      kilby_data_temp.push([result.docs[i].ts, result.docs[i].app_per]);
      kilby_data[parseInt(node_id)] = kilby_data_temp;
    }
    // var output = result.docs.length;
    // return output;
  });
}

function query1(){
  fetchData('1');
  fetchData('3');
  fetchData('4');
  fetchData('5');
  fetchData('6');
  fetchData('7');
}
function query2(){
  fetchData('8');
  fetchData('9');
  fetchData('10');
  fetchData('11');
  fetchData('12');
  fetchData('13');
}
function query3(){
  fetchData('14');
  fetchData('15');
  fetchData('16');
  fetchData('17');
  fetchData('18');
}
function query4(){
  fetchData('19');
  fetchData('20');
}

/******** forecasting ******/
// var ts = require("timeseries-analysis");
// var t       = new ts.main(ts.adapter.sin({cycles:4}));
// console.log(t);
// var t     = new ts.main(ts.adapter.fromArray(kilby_data));
// console.log(t);
// var forecastDatapoint = 11; 
// var coeffs = t.ARMaxEntropy({
//     data: t.data.slice(0,10)
// });
// console.log(coeffs);
// var forecast  = 0;  
// for (var i=0;i<coeffs.length;i++) { 
//     forecast -= t.data[10-i][1]*coeffs[i];
// }
// console.log("forecast",forecast);
///////////////////////////////////
// function generateRandom(){
//     return Math.random() * (0.06 - 0.00) + 0.00;
//   }
//   var data = [generateRandom(),generateRandom(),generateRandom(),generateRandom(),generateRandom(),generateRandom(),generateRandom(),generateRandom(),generateRandom(),generateRandom()];
// var timeseries = require("timeseries-analysis");
//         var t     = new timeseries.main(timeseries.adapter.fromArray(data));
//         t.ma().lwma();
//         var processed = t.ma().output();
//         var chart_url = t.ma({period: 14}).chart();
//         var min = t.min();
//         var max = t.max(); 
//         var mean = t.mean();
//         var stdev = t.stdev();
//         var forecastDatapoint   = 7;   
//         var coeffs = t.ARMaxEntropy({
//             data:   t.data.slice(0,6)
//         });
//         console.log(coeffs);
//         var forecast    = 0;    // Init the value at 0.
//         for (var i=0;i<coeffs.length;i++) { // Loop through the coefficients
//             forecast -= t.data[6-i]*coeffs[i];
//         }
//         console.log("forecast",forecast);
/********/

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));



var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
