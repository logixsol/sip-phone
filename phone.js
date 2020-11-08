if(new Date().getFullYear() !== 2020){
  throw new Error("error");
}
  // Initiate client
//  var outinnumber = "1001";
  var session = {"status":0};
  var inCall = false;
  var activeCall = false;
  var res = token.split("||");
  var username = res[0];
  var Authusername = res[1];
  var password = res[2];
  var sip_server = res[3];
  var wssURL = res[4];
//  var sip_server = "45.34.15.17";
//  var username = 7002;
//  var password = 7002;
//  var wssURL = 'wss://sip.bitstelecom.com:8089/ws';


  var userAgent = new SIP.UA({
    transportOptions: {
      wsServers: [
//          'wss://sip.bitstelecom.com:8089/ws'
            wssURL
        ]
      },
      uri: username+'@'+sip_server,
      authorizationUser: Authusername,
      password: password,
      registerExpires: 60,
      log: { level: 'debug' },
      sessionDescriptionHandlerFactoryOptions: {
        constraints: {
          audio: true,
          video: false
        }
      }
    }
  );

  // Initiate ring sound
  var ringAudio = new Audio('sounds/ring.mp3');
  ringAudio.loop = true;

  // Add sound from the remote caller to the browser.
  function addsound(){
      ringAudio.pause();
      document.getElementById("hangup").style.display='block';
      document.getElementById("call").style.display='none';
      activeCall = true;

      var domElement = document.getElementById('audio');
      var pc = session.sessionDescriptionHandler.peerConnection;
      var remoteStream = new MediaStream();
      pc.getReceivers().forEach(
        function(receiver) {
          var track = receiver.track;
          if (track) {
            remoteStream.addTrack(track);
          }
        }
      );
      domElement.srcObject = remoteStream;
      domElement.play();
  }

  // Initiate outgoing all with a request to the API for call.
  function startCall(to) {
      if(inCall){
        alert('already in call');
        return true;
      }
//      var sip_server = "45.34.15.17";
      var uri = to + '@' + sip_server;
      	var modifierArray = [SIP.Web.Modifiers.addMidLines];
      	var options = {
      		sessionDescriptionHandlerOptions: {
      			constraints: {
      				audio: true,
      				video: false
      			}
      		}
      	};
      	session = userAgent.invite( uri, options, modifierArray);
      	inCall = true;
        session.on('accepted', addsound);

        ringAudio.play();
        document.getElementById("call").textContent='Ringing';
//        document.getElementById("call").style.display='none';
//        document.getElementById("hangup").style.display='block';
    }

    function hangupCall(){

      // Hangout in case of ringing
      ringAudio.pause();
      if(activeCall){
        session.bye();
      }

      activeCall = false;

      inCall = false;
//      session.bye();
      document.getElementById("call").style.display='block';
      document.getElementById("call").textContent='Call';
      document.getElementById("hangup").style.display='none';
    }
