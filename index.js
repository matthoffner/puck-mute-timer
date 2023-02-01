var controls = require("ble_hid_controls");
NRF.setServices(undefined, { hid : controls.report });

var clickTimer = null;
var resetTimer = null;
var clickCount = 0;
var activeLight = null;

function setLight(light,v) {
    NRF.setAdvertising({
        0x180F : [v]
    },{interval:200});
    clickCount = 0;
    if (activeLight !== null) {
        activeLight.reset();
    }
    light.set();
    activeLight = light;
    if (resetTimer !== null) {
        clearTimeout(resetTimer);
        resetTimer = null;
    }
    resetTimer = setTimeout(function() {
        resetTimer = null;
        activeLight.reset();
        NRF.setAdvertising({
            0x180F : [0]
        },{interval:200});
        resetTime = setTimeout(function() {
            NRF.setAdvertising({});
        },1000);
    },3000);
}

setWatch(function(e) {
  if (clickTimer !== null) {
        clearTimeout(clickTimer);
        clickTimer = null;
    }
    clickCount+=1;
    clickTimer = setTimeout(function () {
        clickTimer = null;
        if(clickCount == 1){
            setLight(LED2,10);
            controls.mute();
            return;
        }else if(clickCount == 2){
            setLight(LED1,20);
            muteLength = 60000;
            console.log('unmuting in 60 seconds');
        }else if(clickCount >= 3){
            setLight(LED3,30);
            muteLength = 120000;
            console.log('unmuting in 120 seconds');  
        }
        controls.mute();
        setTimeout(function() {
          setLight(LED2,30);
          controls.mute();
        }, muteLength);
        setTimeout(function() {
          console.log('50% complete');
          setLight(LED1,10);
        }, muteLength / 2);
    }, 400);
}, BTN, { edge:"falling",repeat:true,debounce:50});
