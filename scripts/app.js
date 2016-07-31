var webComponentsSupported = ('registerElement' in document
    && 'import' in document.createElement('link')
    && 'content' in document.createElement('template'));

if (!webComponentsSupported) {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'bower_components/webcomponentsjs/webcomponents-lite.min.js';
  document.head.appendChild(script);

  window.addEventListener('WebComponentsReady', function(e) {
    console.log('FALLBACK: WebComponentsReady() fired and components ready.');
    appInit();
  });

} else {
  window.Polymer = window.Polymer || {dom: 'shadow'};

  var link = document.querySelector('#bundle');
  var onImportLoaded = function() {
    appInit();
  };

  // 5. Go if the async Import loaded quickly. Otherwise wait for it.
  // crbug.com/504944 - readyState never goes to complete until Chrome 46.
  // crbug.com/505279 - Resource Timing API is not available until Chrome 46.
  if (link.import && link.import.readyState === 'complete') {
    appInit();
  } else {
    link.addEventListener('load', appInit);
  }
}

// Async loading w/bindings for Ginger
var script = document.createElement('script');
script.async = true;
script.src = 'bower_components/three.js/three.min.js';
script.onload = initGinger;
document.head.appendChild(script);

var dslink = new DS.BrowserUserLink({enableAck:true, wsUpdateUri:"wss://rnd.iot-dsa.org/ws"});
dslink.connect();


function initGinger() {
  var ginger = new Ginger();
  ginger.init();

  

  var dataMap ={
    eyeclose:"eyes",
    happy:"expression",
    mouseopen:"jawrange",
    jawtwist:"jawtwist",
    symmetry:"symmetry",
    lipcurl:"lipcurl",
    lipsync:"lipsync",
    face:"sex",
    jawwidth:"jawwidth"
  }      
  //var datanames = "lookx,looky";
  for (var dataname in dataMap) {
    (function (){
      var scopename = dataname;
      dslink.requester.subscribe("/data/ginger/"+scopename, function(v){
        ginger.updateMorph(v.value, dataMap[scopename]);
      });
    })();
  }

  dslink.requester.subscribe("/data/ginger/lookx", function(v){
    ginger.updateLookX(v.value);
  });
  dslink.requester.subscribe("/data/ginger/looky", function(v){
    ginger.updateLookY(v.value);
  });
  dslink.requester.subscribe("/data/ginger/message", function(v){
    document.querySelector(".label").innerText = v.value;
  });
}


function appInit() {  

  var version = '2';


  var overlay = document.querySelectorAll('.full-shadow');
  for (var i = 0; i < overlay.length; i++) {
    overlay[i].addEventListener('click', function(e) {
      var parent = e.target.parentNode;
      parent.classList.add('hidden');
    });
  }


}







