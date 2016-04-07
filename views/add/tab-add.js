angular.module('AskUs.addTab', [])

.controller('addCtrl', 
  ['$scope', '$state', 'Post', 'Camera', '$ionicModal', 's3Uploader', '$http', '$rootScope', '$timeout', 'S3_CDN_URL',
  function($scope, $state, Post, Camera, $ionicModal, s3Uploader, $http, $rootScope, $timeout, S3_CDN_URL) {

  $scope.imageOne;
  $scope.imageTwo;

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
    // Check if the form is fully filled
    if(form.$valid && $scope.imageOne && $scope.imageTwo) {
      // Show loading picture and sending form modal
      $scope.openModal();
      // Generate the name and path for the picture before storing in the DB
      var fileOneName = fileNameGenerator();
      var fileTwoName = fileNameGenerator();
      $scope.post.pictureA = S3_CDN_URL + fileOneName;
      $scope.post.pictureB = S3_CDN_URL + fileTwoName;

      s3Uploader.upload($scope.imageOne, fileOneName).then(function() {
        s3Uploader.upload($scope.imageTwo, fileTwoName).then(function() {
          Post.addPost($scope.post).then(function(){
            $scope.closeModal();
            // Redirect to the dash page
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
      // Show the form empty fields error
      $scope.openErrorFormModal();
      console.log('Form submit error');
    }
  }; 

  // Picture saving options
  if (window.cordova) {
    var options = { 
      quality : 90, 
      allowEdit : false, // set to true to allow editing -*** BUG IOS on Camera pictures croping, not on Library pictures
      encodingType: navigator.camera.EncodingType.JPEG,
      targetWidth: 600,
      targetHeight: 600,
      saveToPhotoAlbum: false
    };
  }

  // Native camera access methods
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

  // Library access methods
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

  // Upload modal animation
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

  $ionicModal.fromTemplateUrl('error-form.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.errorFormModal = modal;
  });

  $scope.openErrorFormModal = function() {
    $scope.errorFormModal.show();
  };

  $scope.closeErrorFormModal = function() {
    $scope.errorFormModal.hide();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.uploadModal.remove();
  });

}]);