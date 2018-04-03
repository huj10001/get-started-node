var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/* allocate data memory */
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

var kilby_all= [];
var myurl = "https://89c13691-0906-4a2b-98ef-801692e3590a-bluemix:4e714e8e0d041063bd2a4e439f057e60c034dd4afdee04224e3e6f4f8441bf55@89c13691-0906-4a2b-98ef-801692e3590a-bluemix.cloudant.com";
var ibmdb_url = "DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4";


/* fetch periodic sensor data */
app.post("/api/sensor", function (request, response) {
  var start_time = request.body.startTime;
  var end_time = request.body.endTime;
  var marker_id = request.body.markerId;
  //console.log('start:'+start_time+' end:'+end_time+' id:'+marker_id);
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
    conn.query(
      'select * from BLUADMIN.NW_DATA_SET_PER_02202018_WHOLEWEEK where SENSOR_ID=? and TIMESTAMP>=? and TIMESTAMP<=?'
      ,[marker_id, start_time, end_time], function (err, data) {
        if (err) {
          return console.log(err.message);
        }
        //console.log('Found %d resulted data with id %s', data.length, marker_id);
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
});

/* fetch gateway name */
app.get("/api/gateway", function (request, response) {
  response.json(gateway_data);
  return;
});

/* fetch topology */
app.get("/api/topology", function (request, response) {
  response.json(topology_data);
  return;
});

/* fetch latency */
app.get("/api/networkstat", function (request, response) {
  response.json(network_stat_data);
  return;
});

/* fetch app_per and mac_per */
app.get("/api/networkstatplus", function (request, response) {
  response.json(network_stat_data_plus);
  return;
});

/* fetch sampling sensor data */
app.get("/api/sensor", function (request, response) {
  response.json(sensor_data);
  return;
});


var Cloudant = require('cloudant');
var gateway_list = ['TEST1', 'TEST_SG', 'UCONN_GW', 'i3-kilby', 'i3-kilby-sg', 'range_test'];

/* query gateway names */
ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
  if(err) return console.log(err);
  conn.query('select distinct GATEWAY_NAME from BLUADMIN.TOPOLOGY_DATA', function (err, data) {
    //console.log('gateway:', data);
    for(var i=0;i<data.length;i++){
      gateway_data.push(data[i]);
    }
  });
});

/* query topology data */

ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
  if(err) return console.log(err);
  for(var j=0;j<gateway_list.length;j++){
    var gateway_current = gateway_list[j];
    conn.query(
      "select t.SENSOR_ID, t.GPS_LAT, t.GPS_LONG, t.PARENT, t.GATEWAY_NAME from BLUADMIN.TOPOLOGY_DATA t inner join (select SENSOR_ID, max(TIMESTAMP) as MaxTime from BLUADMIN.TOPOLOGY_DATA where GATEWAY_NAME = ? and TIMESTAMP >= (select max(TIMESTAMP) from BLUADMIN.TOPOLOGY_DATA where SENSOR_ID = 1 and GATEWAY_NAME = ? ) group by SENSOR_ID) tm on t.SENSOR_ID = tm.SENSOR_ID and t.TIMESTAMP = tm.MaxTime"
      , [gateway_current, gateway_current],function (err, data) {
        if(data.length > 0){
          console.log('topology data:', data);
          for(var i=0;i<data.length;i++)
          {
            /* this part is to filter out those nodes whose parents are not in the array*/
            //node 1 doesn't have parent
            if(data[i]['SENSOR_ID'] != 1){
              //check if the node's parent is in the array
              for(var j=0;j<data.length;j++){
                if(data[j]['SENSOR_ID'] == data[i]['PARENT']){
                  topology_data.push(data[i]);    //find the parent, break out
                  break;
                }
              }
            }
            else{
              topology_data.push(data[i]);    //push node 1 directly
            }           
            //topology_data.push(data[i]);  
          }
        }
      });
  }
});


/* query network stat: latency, app_per and mac_per */
ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
  if(err) return console.log(err);
  conn.query('select SENSOR_ID,AVG(RTT) from BLUADMIN.NW_DATA_SET_LATENCY group by SENSOR_ID', function (err, data) {
    //console.log('network stat data:', data);
    for(var i=0;i<data.length;i++){
      var sid = data[i]['SENSOR_ID'];
      network_stat_data[sid] = data[i];
    }
  });

  conn.query('select SENSOR_ID,AVG(MAC_TX_TOTAL), AVG(MAC_TX_FAIL), AVG(APP_PER_SENT), AVG(APP_PER_LOST) from BLUADMIN.NW_DATA_SET_PER_02202018_WHOLEWEEK group by SENSOR_ID', function (err, data) {
    //console.log('network stat data plus:', data);
    for(var i=0;i<data.length;i++){
      var sid = data[i]['SENSOR_ID'];
      network_stat_data_plus[sid] = data[i];
    }
  });
});


var num_of_rows = 0;
query1();

/* query sensor data by node id */
function fetchData(node_id, offset_start, offset_end){
  var sensor_id = parseInt(node_id);
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
    if(err) return console.log(err);
    conn.query(
      'select * from BLUADMIN.NW_DATA_SET_PER_02202018_WHOLEWEEK where SENSOR_ID=? order by TIMESTAMP desc fetch first 10 rows only'
      ,[sensor_id], function (err, data) {
        //console.log('Found %d new data with id %s', data.length, node_id);
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
          //console.log(sensor_data[parseInt(node_id)]);
        }
      });
  });
}

/* pre-check num of sensors */
function loadNumSensor(){
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function(err, conn) {
    if(err) return console.log(err);
    conn.query('select MAX(SENSOR_ID) from BLUADMIN.TOPOLOGY_DATA', function (err, data) {
      //console.log('Num of sensors: '+data[0]['1']);
      num_of_sensor = data[0]['1']+1;
    })
  });
}

/* query all sensor data */
function query1(){
  ibmdb.open("DATABASE=BLUDB;HOSTNAME=dashdb-txn-flex-yp-dal10-21.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bluadmin;PWD=MTAwMGZhZmMxYTc4;", function (err,conn) {
    if(err) return console.log(err);
    conn.query('select count(*) from BLUADMIN.NW_DATA_SET_PER', function (err, data) {
      //console.log('Num of rows: '+data[0]['1']);
      if(data[0]['1'] > num_of_rows){
        var offset_start = num_of_rows;
        var offset_end = data[0]['1'] - num_of_rows;
        //console.log('start offset: '+offset_start+', end offset: '+offset_end);
        conn.query('select distinct SENSOR_ID from BLUADMIN.NW_DATA_SET_PER', function (err, data) {
          for(var i=0;i<data.length;i++){
            fetchData(data[i]['SENSOR_ID'].toString(), offset_start, offset_end);
          }
        });
        num_of_rows = data[0]['1'];
      }else{
        //console.log('No new data.');
      }
    });
  });
}

app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 3000
app.listen(port, function() {
  //console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
