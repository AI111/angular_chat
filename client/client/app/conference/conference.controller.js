'use strict';

(function() {

  class ConferenceController {

    constructor($sce, VideoConferance, $location, $routeParams, $scope, VideoStream,$log) {
      this.$sce=$sce;
      this.$log=$log;
      this.VideoStream=VideoStream;
      this.VideoConferance=VideoConferance;
      this.$location=$location;
      this.$routeParams=$routeParams;
      this.$scope=$scope;
      this.stream;
      this.error;
      this.peers = [];
    }

    $onInit() {
      this.checkSupport();
      this.init();
    }

    checkSupport(){
      if (!window.RTCPeerConnection || !navigator.mediaDevices.getUserMedia) {
        this.error = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
      }
    }
    init(){
      this.VideoStream.get()
      .then((s) =>{
        this.stream = s;
        this.VideoConferance.init(this.stream);
        this.stream = URL.createObjectURL(this.stream);
        if (!this.$routeParams.roomId) {
          this.VideoConferance.createRoom()
          .then((roomId)=> {
            this.$log.debug('init createRoom',roomId);
            this.$location.path('/conference/' + roomId);
          });
        } else {
          this.$log.debug('joinRoom',this.$routeParams.roomId);
          this.VideoConferance.joinRoom(this.$routeParams.roomId);
        }
      }, (e)=> {
        this.$log.debug('get stream error',e);
        this.error = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
      });

      this.VideoConferance.on('peer.stream',  (peer)=> {
        console.log('Client connected, adding new stream');
        this.peers.push({
          id: peer.id,
          stream: URL.createObjectURL(peer.stream)
        });
      });
      this.VideoConferance.on('peer.disconnected',  (peer) =>{
        console.log('Client disconnected, removing stream');
        this.peers = this.peers.filter( (p)=> {
          return p.id !== peer.id;
        });
      });
    }
    getLocalVideo(){
      return  this.$sce.trustAsResourceUrl(this.stream);
    }
  }

angular.module('angularChatApp')
.component('conference', {
  templateUrl: 'app/conference/conference.html',
  controller: ConferenceController
});
})();
