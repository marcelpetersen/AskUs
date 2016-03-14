angular.module('myApp.addTab', [])

.controller('addCtrl', ['$scope', '$state', 'Post', 'Camera', 's3Uploader', '$http', '$rootScope', '$timeout', 'S3_CDN_URL', function($scope, $state, Post, Camera, s3Uploader, $http, $rootScope, $timeout, S3_CDN_URL) {

  $scope.imageOne;
  $scope.imageTwo;

  $scope.post = {
    title: '',
    description : ''   
  };  

   // Generate a random name with random characters
  var fileNameGenerator = function() {
    return Math.random().toString(36).substr(2, 15) + '.jpg';
  }
   
  $scope.submitPost = function(form) {
    if(form.$valid) {

      var fileOneName = fileNameGenerator();
      var fileTwoName = fileNameGenerator();

      $scope.post.pictureA = S3_CDN_URL + fileOneName;
      $scope.post.pictureB = S3_CDN_URL + fileTwoName;

      s3Uploader.upload($scope.imageOne, fileOneName).then(function() {
        s3Uploader.upload($scope.imageTwo, fileTwoName).then(function() {
          Post.addPost($scope.post).then(function(){
            $timeout(function(){$rootScope.$emit('dashRefresh');}, 200)
            $state.go('tab.dash');
          }, function() {
            console.log("Saving post failed");
          });
        }, function() {
          console.log("Upload Picture 2 failed");
        });
      }, function() {
        console.log("Upload Picture 1 failed")
      });

    } else {
      console.log('Form submit error');
    }
  }; 

  var options = { 
    quality : 80, 
    allowEdit : false, // set to true to allow editing -*** BUG IOS on Camera pictures croping, not on Library pictures
    encodingType: navigator.camera.EncodingType.JPEG,
    targetWidth: 500,
    targetHeight: 500,
    saveToPhotoAlbum: false
  };

  $scope.takePictureCamera = function(imageNumber) {
    options.sourceType = navigator.camera.PictureSourceType.CAMERA;

    Camera.getPicture(options).then(function(imageURI) {
      if (imageNumber === 'picture-one') {
        $scope.imageOne = imageURI;
      } else {
        $scope.imageTwo = imageURI;
      }

      angular.element('.picture-container.' + imageNumber).css('background-image', 'url('+imageURI+')' );

    }, function(err) {
      console.err('error while taking picture', err);
    });
  };

  $scope.takePictureLibrary = function(imageNumber) {
    options.sourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY;

    Camera.getPicture(options).then(function(imageURI) {
      if (imageNumber === 'picture-one') {
        $scope.imageOne = imageURI;
      } else {
        $scope.imageTwo = imageURI;
      }
      angular.element('.picture-container.' + imageNumber).css('background-image', 'url('+imageURI+')' );

    }, function(err) {
      console.err('error while taking picture', err);
    });
  };

}]);