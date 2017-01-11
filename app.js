var exec = require('child_process').exec,
    waterfall = require('async-waterfall')
//var mac = '8f:3f:20:33:54:44'
//var iface = 'eth0'
//var dash_button = require('node-dash-button')
//var dash = dash_button(mac, iface, null, 'all')
var errors = [],
    ip = '192.168.0.102',
    result = ''

function killServer(callBack){
  var kill = exec('adb kill-server');
      kill.stdout.on('data', function(data) {
          result+='Kill server result \n'
          result += data
      })
      kill.on('close', function() {
        if(result==''){
          result+='Kill server done \n'
        }
        callBack(null)
      })
}

function tcpip(callBack){
  var tcpip = exec('adb tcpip 5555')
      tcpip.stdout.on('data', function(data) {
          result+='tcpip result \n'
          result += data
      })
      tcpip.stdout.on('close',function(data){
        callBack(null)
      })
}

function connect(callBack){
  var connectIP = exec('adb connect '+ip+':5555')
      connectIP.stdout.on('data', function(data) {
        result+='connect result \n'
          result += data
      })
      connectIP.stdout.on('close',function(data){
        callBack(null)
      })
}

function sendKey85(callBack){
  setTimeout(function(){
    var sendKeys = exec('adb shell input keyevent 85')
        sendKeys.stdout.on('close',function(data){
          callBack(null,result)
        })
  },2000)
}

function controller(){
  var devices = exec('adb devices')
      devices.stdout.on('data',function(data){
        if(data.search(ip)==-1){
          waterfall([killServer,tcpip,connect,sendKey85],function(err,result){
            console.log(result)
          })
        }else{
          var sendKeys = exec('adb shell input keyevent 85')
          sendKeys.stdout.on('close',function(data){
            console.log('already connected sendKeys done')
          })
        }
      })
}
controller()
//dash.on("detected", function (){
//    controller()
//});
