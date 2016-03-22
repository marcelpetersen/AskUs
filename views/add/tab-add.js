angular.module('myApp.addTab', [])

.controller('addCtrl', 
  ['$scope', '$state', 'Post', 'Camera', '$ionicModal', 's3Uploader', '$http', '$rootScope', '$timeout', 'S3_CDN_URL',
  function($scope, $state, Post, Camera, $ionicModal, s3Uploader, $http, $rootScope, $timeout, S3_CDN_URL) {

  $scope.imageOne;
  $scope.imageTwo;

  // $timeout(function() {$scope.openModal();}, 1000);

  $scope.post = {
    category: 'general',
    title: '',
    description : ''   
  };  

   // Generate a random name with random characters
  var fileNameGenerator = function() {
    return Math.random().toString(36).substr(2, 15) + '.jpg';
  }
   
  $scope.submitPost = function(form) {
    console.log($scope.post)
    $scope.openModal();
    if(form.$valid) {

      var fileOneName = fileNameGenerator();
      var fileTwoName = fileNameGenerator();

      $scope.post.pictureA = S3_CDN_URL + fileOneName;
      $scope.post.pictureB = S3_CDN_URL + fileTwoName;

      s3Uploader.upload($scope.imageOne, fileOneName).then(function() {
        s3Uploader.upload($scope.imageTwo, fileTwoName).then(function() {
          Post.addPost($scope.post).then(function(){
            $scope.closeModal();
            $timeout(function(){$rootScope.$emit('dashRefresh');}, 200)
            $state.go('tab.dash');
          }, function() {
            $scope.closeModal();
            console.log("Saving post failed");
            // Show global error modal
            $scope.openErrorModal();
          });
        }, function() {
          $scope.closeModal();
          console.log("Upload Picture 2 failed");
          // Show global error modal
          $scope.openErrorModal();
        });
      }, function() {
        $scope.closeModal();
        console.log("Upload Picture 1 failed")
        // Show global error modal
        $scope.openErrorModal();
      });

    } else {
      $scope.closeModal();
      console.log('Form submit error');
      // Show global error modal
      $scope.openErrorModal();
    }
  }; 

  var options = { 
    quality : 90, 
    allowEdit : false, // set to true to allow editing -*** BUG IOS on Camera pictures croping, not on Library pictures
    encodingType: navigator.camera.EncodingType.JPEG,
    targetWidth: 600,
    targetHeight: 600,
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
      // Show global error modal
      $scope.openErrorModal();
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
      // Show global error modal
      $scope.openErrorModal();
    });
  };

  // upload modal animation

  $ionicModal.fromTemplateUrl('picture-upload.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.uploadModal = modal;
  });

  $scope.openModal = function() {
    $scope.uploadModal.show();
    angular.element('.picture-upload-modal .loading-icon').addClass('spin');
  };

  $scope.closeModal = function() {
    angular.element('.picture-upload-modal .loading-icon').removeClass('spin');
    $scope.uploadModal.hide();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.uploadModal.remove();
  });

}]);