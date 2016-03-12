angular.module('myApp.addTab', ['myApp.env'])

.factory('Camera', ['$q', function($q) {
        //   var options = { 
        //     quality : 75, 
        //     destinationType : navigator.camera.DestinationType.DATA_URL, 
        //     sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY, 
        //     allowEdit : true,
        //     encodingType: navigator.camera.EncodingType.JPEG,
        //     targetWidth: 300,
        //     targetHeight: 300,
        //     // popoverOptions: CameraPopoverOptions,
        //     saveToPhotoAlbum: false
        // };

  return {

    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])

.controller('addCtrl', function($scope, $state, Post, Camera) {

  $scope.imageOne;
  $scope.imageTwo;

  $scope.post = {
    title: '',
    description : ''   
  };  
   
  $scope.submitPost = function(form) {
    if(form.$valid) {
      console.log('ok to send', $scope.post);
      Post.addPost($scope.post);
      $state.go('tab.dash');
      $scope.post = {
        title: '',
        description : ''   
      };  
    } else {
      console.log('error form submit');
    }
  }; 

  var options = { 
    quality : 80, 
    // destinationType : navigator.camera.DestinationType.DATA_URL, 
    // sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY, 
    allowEdit : true,
    encodingType: navigator.camera.EncodingType.JPEG,
    targetWidth: 500,
    targetHeight: 500,
    saveToPhotoAlbum: false
  };

  $scope.takePictureCamera = function(imageNumber) {
    options.sourceType = navigator.camera.PictureSourceType.CAMERA;

    Camera.getPicture(options).then(function(imageURI) {
      console.log(imageURI);
      // $scope.imgURI = "data:image/jpeg;base64," + imageURI;
      // $scope.imgURI = imageURI;
      // $scope.$apply();
      angular.element('.picture-container.' + imageNumber).css('background-image', 'url('+imageURI+')' );

    }, function(err) {
      console.err('error in take picture', err);
    });
  };

  $scope.takePictureLibrary = function(imageNumber) {
    options.sourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY;

    Camera.getPicture(options).then(function(imageURI) {
      console.log(imageURI);
      // $scope.imgURI = "data:image/jpeg;base64," + imageURI;
      // $scope.imgURI = imageURI;
      angular.element('.picture-container.' + imageNumber).css('background-image', 'url('+imageURI+')' );
      // $scope.$apply()

    }, function(err) {
      console.err('error in take picture', err);
    });
  };

});