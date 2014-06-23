'use strict';

/*global SimpleWebRTC, $*/

// = include('./vendor/makisu.js');

// grab the room from the URL
var room = location.search && location.search.split('?')[1];
// create our webrtc connection
var webrtc = new SimpleWebRTC({
  url: 'http://signaling.simplewebrtc.com:8888',
  // the id/element dom element that will hold "our" video
  localVideoEl: 'localVideo',
  // the id/element dom element that will hold remote videos
  remoteVideosEl: '',
  // immediately ask for camera access
  autoRequestMedia: true,
  debug: false,
  detectSpeakingEvents: true,
  autoAdjustMic: false
});
// when it's ready, join if we got a room from the URL
webrtc.on('readyToCall', function() {
  // you can name it anything
  if (room) webrtc.joinRoom(room);
});

webrtc.on('channelMessage', function(peer, label, data) {
  if (label === 'dingdong') {
    document.getElementById('doorbell-sample').load();
    document.getElementById('doorbell-sample').play();
  }
  if (label === 'pause') {
    $('#container_' + webrtc.getDomId(peer)).find('.slats').makisu('open');
  }
  if (label === 'resume') {
    $('#container_' + webrtc.getDomId(peer)).find('.slats').makisu('close');
  }
});

webrtc.on('videoAdded', function(video, peer) {
  console.log('video added', peer);
  var remotes = document.getElementById('remotes');
  if (remotes) {
    var d = document.createElement('div');
    d.className = 'videoContainer';
    d.id = 'container_' + webrtc.getDomId(peer);
    d.appendChild(video);
    $(d).on('click', function (e) {
      if (!peer.sendDirectly('dingdong')) {
        setTimeout(function () {
          peer.sendDirectly('dingdong');
        }, 500);
      }
    });
    $(d).append('<div class="slats"><div class="slat"></div><div class="slat"></div><div class="slat"></div><div class="slat"></div><div class="slat"></div></div>');
    $(d).find('.slats').makisu({
        selector: 'div',
        overlap: 0.7,
        shading: 'rgba(0,0,0,0.3)',
        speed: 0.1
    });
    var vol = document.createElement('div');
    vol.id = 'volume_' + peer.id;
    vol.className = 'volume_bar';
    d.appendChild(vol);
    remotes.appendChild(d);
  }
});

webrtc.on('videoRemoved', function(video, peer) {
  console.log('video removed ', peer);
  var remotes = document.getElementById('remotes');
  var el = document.getElementById('container_' + webrtc.getDomId(peer));
  if (remotes && el) {
    remotes.removeChild(el);
  }
});

// webrtc.on('volumeChange', function(volume, treshold) {
//     //console.log('own volume', volume);
//     showVolume(document.getElementById('localVolume'), volume);
// });
// Since we use this twice we put it here

// function setRoom(name) {
//     $('form').remove();
//     $('h1').text(name);
//     $('#subTitle').text('Link to join: ' + location.href);
//     $('body').addClass('active');
// }
// if (room) {
//     setRoom(room);
// } else {
//     $('form').submit(function() {
//         var val = $('#sessionInput').val().toLowerCase().replace(/\\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
//         webrtc.createRoom(val, function(err, name) {
//             console.log(' create room cb', arguments);
//             var newUrl = location.pathname + '?' + name;
//             if (!err) {
//                 history.replaceState({
//                     foo: 'bar'
//                 }, null, newUrl);
//                 setRoom(name);
//             } else {
//                 console.log(err);
//             }
//         });
//         return false;
//     });
// }

// var button = $('#screenShareButton'),
//     setButton = function(bool) {
//         button.text(bool ? 'share screen' : 'stop sharing');
//     };
// webrtc.on('localScreenStopped', function() {
//     setButton(true);
// });
// setButton(true);
// button.click(function() {
//     if (webrtc.getLocalScreen()) {
//         webrtc.stopScreenShare();
//         setButton(true);
//     } else {
//         webrtc.shareScreen(function(err) {
//             if (err) {
//                 setButton(true);
//             } else {
//                 setButton(false);
//             }
//         });
//     }
// });


// The `enabled` flag will be `false` if CSS 3D isn't available

// if ( $.fn.makisu.enabled ) {

//     var $sashimi = $( '.sashimi' );
//     var $nigiri = $( '.nigiri' );
//     var $maki = $( '.maki' );

//     // Create Makisus

//     $nigiri.makisu({
//         selector: 'dd',
//         overlap: 0.5,
//         speed: 0.1
//     });

//     $maki.makisu({
//         selector: 'dd',
//         overlap: 0.6,
//         speed: 0.1
//     });

//     $sashimi.makisu({
//         selector: 'dd',
//         overlap: 0.2,
//         speed: 0.1
//     });

//     // Open all
//     $( '.list' ).makisu( 'open' );

//     // Toggle on click
//     $( '.toggle' ).on( 'click', function() {
//         $( '.list' ).makisu( 'toggle' );
//     });

//     // Disable all links
//     $( '.demo a' ).click( function( event ) {
//         event.preventDefault();
//     });

// } else {
//     $( '.warning' ).show();
// }


window.onpageshow =
window.onpagehide =
window.onfocus =
window.onblur = function (evt) {
  var v = 'visible';
  var h = 'hidden';
  var evtMap = {
    focus: v,
    focusin: v,
    pageshow: v,
    blur: h,
    focusout: h,
    pagehide: h
  };

  evt = evt || window.event;

  if (evtMap[evt.type] === 'hidden') {
    webrtc.pause();
    webrtc.mute();
    webrtc.sendDirectlyToAll('pause');
  }
  else if (evtMap[evt.type] === 'visible') {
    webrtc.resume();
    webrtc.unmute();
    webrtc.sendDirectlyToAll('resume');
  }
};