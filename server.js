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
  var dbName_kilby = 'kilby_test';

  cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '));

});

  mydb_kilby = cloudant.db.use(dbName_kilby);


  var num_doc = 0;
  var last_ts = null;
  cloudant.db.get('kilby_test', function(err, data) {
    console.log('Num of doc: %d', data.doc_count);
    num_doc = num_doc<data.doc_count ? data.doc_count : num_doc;
    // console.log('doc at line 16636 is: %s', data[16636]);
  });
  // console.log('data fetch start');
  // setTimeout(query1, 1000);
  // var array1 = [1,2,3];
  // var array2 = [0,4,5];
  // console.log('similarity is: ' + checkSimilarity(array1, array2));
/* first data fetch, 0 sec delay */
  query1();
  setTimeout(query2, 3000);
  setTimeout(query3, 6000);
  setTimeout(query4, 9000);
  setTimeout(function(){
    console.log('final ts is %s', ts_temp);
    last_ts = ts_temp;
    // for(var i=4;i<21;i++){
    //   console.log('similarity between %s and %s is: %s', 3, i, (checkSimilarity(3, i)*100).toFixed(2) + '%');
    // }
    for(var i=3;i<21;i++){
      console.log(i + ':');
      var curr_dict = checkSimilarity(i);
      Object.keys(curr_dict).forEach(function(currentKey) {
      console.log(curr_dict[currentKey]);
      });
    }
  },12000);


/* recursive data fetch, 3 sec delay from last fetch */
  setInterval(function(){
  query1();
  setTimeout(query2, 3000);
  setTimeout(query3, 6000);
  setTimeout(query4, 9000);
  setTimeout(function(){
    console.log('final ts is %s', ts_temp);
    last_ts = ts_temp;
  },12000);
},15000);

  // console.log('last ts is %s', last_ts);

  // setTimeout(setInterval(function(){
  //   cloudant.db.get('kilby_test', function(err, data) {
  //   console.log('Num of doc: %d', data.doc_count);
  //   // var num_doc = data.doc_count;
  //   if(data.doc_count > num_doc){
  //     query1();
  //     setTimeout(query2, 3000);
  //     setTimeout(query3, 6000);
  //     setTimeout(query4, 9000);
  //   }
  // });
  // }, 3000), 12000);

  // while()
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
  // setTimeout(polynomialRegression, 12000);
  
//   var known_x = [1, 2, 3, 4, 5];
// var known_y = [5.2, 5.4, 5.6, 5.8, 6.0];
// var result = findLineByLeastSquares(known_x, known_y);
// console.log('predicted next PER: '+result[1][0]);

// var lr = linearRegression(known_y, known_x);
// console.log('slope: '+lr.slope);
// console.log(lr.intercept);
// console.log(lr.r2);
// var predict = (known_y.length + 1) / lr.slope;
// console.log('predicted: '+ predict);

  
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

// var last_ts = null;
var ts_temp = 0;
function fetchData(node_id, ts){
  mydb_kilby.find({"selector":{"id":node_id, 
                              "ts":{"$gt":ts}
                            }}, function(er, result){
    if(er){
      throw er;
    }
    console.log('Found %d documents with id %s', result.docs.length, node_id);
    var kilby_data_temp = [];
    // var per = 'app_per';
    var data_x = [];
    var data_y = [];
    if(result.docs.length <= 0){
      // last_ts = null;
      console.log('No new data for node %s', node_id);
    }
    else{
      console.log('New data for node %s', node_id);
    for (var i=0;i<result.docs.length;i++){
      kilby_data_temp.push([result.docs[i].ts, result.docs[i].app_per]); // ["msg/PER"]
      kilby_data[parseInt(node_id)] = kilby_data_temp;

      data_x.push(parseInt(result.docs[i].ts));
      data_y.push(parseFloat(result.docs[i].app_per));
    }
    // if(kilby_data_temp[0]){
    //   console.log(typeof(parseFloat(kilby_data_temp[0][1])));
    // }
    // if(node_id == '3'){
    var predict_result = findLineByLeastSquares(data_x, data_y);
    // var result = linearRegression(data_y, data_x);
    // var result_x = result[0];
    // var result_y = result[1];
    // var size = data_y.length;
    console.log('predicted next PER: '+ predict_result[1][0]);
    ts_temp = result.docs[result.docs.length-1].ts>ts_temp ? result.docs[result.docs.length-1].ts : ts_temp;
    console.log('current ts is %s', ts_temp);
    // setTimeout(fetchData(node_id,last_ts), 15000);
  }
    
  // }

    // var output = result.docs.length;
    // return output;
  });
}

function query1(){
  fetchData('1',last_ts);
  fetchData('3',last_ts);
  fetchData('4',last_ts);
  fetchData('5',last_ts);
  fetchData('6',last_ts);
  fetchData('7',last_ts);
}
function query2(){
  fetchData('8',last_ts);
  fetchData('9',last_ts);
  fetchData('10',last_ts);
  fetchData('11',last_ts);
  fetchData('12',last_ts);
  fetchData('13',last_ts);
}
function query3(){
  fetchData('14',last_ts);
  fetchData('15',last_ts);
  fetchData('16',last_ts);
  fetchData('17',last_ts);
  fetchData('18',last_ts);
}
function query4(){
  fetchData('19',last_ts);
  fetchData('20',last_ts);
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
      // arrayA.filter(function(el){
      //   return arrayB.indexOf(el) >= 0;
      // }).length;
      var matches = 0;
        for (i=0;i<arrayA.length;i++) {
            if (arrayB[i] == arrayA[i])
                matches++;
        }
        var similarity_rate = matches/Math.min(arrayA.length, arrayB.length);
        if(similarity_rate > 0.2){
          similarity_dict.push({
          key: id2,
          value: similarity_rate
        });
        }
        // return similarity_rate;
    }
  }
  return similarity_dict;
}

function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x != null ? values_x.length : 0;

    // if (values_length != values_y.length) {
    //     throw new Error('The parameters values_x and values_y need to have same size!');
    // }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [ [], [] ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;

    /*
     * We will make the x and y result line now
     */
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
