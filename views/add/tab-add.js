angular.module('myApp.addTab', ['myApp.env'])

.factory('Camera', ['$q', function($q) {

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

.factory('s3Uploader', ['$q','$http', function($q, $http) {

 
  var upload = function(imageURI, fileName) {



      console.log('in upload factory function');

      var signingURI = "http://127.0.0.1:8000/api/sign_s3";


 
        var q = $q.defer();
        var ft = new FileTransfer();
        var options = new FileUploadOptions();
 
        options.fileKey = "file";
        options.fileName = fileName;
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
 
        $http.post(signingURI, {"fileName": fileName})
            .then(function (data) {
              console.log('http post data', JSON.stringify(data));


        //              var ft = new FileTransfer();
        // var options = new FileUploadOptions();
 
        // options.fileKey = "file";
        // options.fileName = fileName;
        // options.mimeType = "image/jpeg";
        // options.chunkedMode = false;

                options.params = {
                    "key": fileName,
                    "AWSAccessKeyId": data.data.awsKey,
                    "acl": "public-read",
                    "policy": data.data.policy,
                    "signature": data.data.signature,
                    "Content-Type": "image/jpeg"
                };
 
                ft.upload(imageURI, "https://" + data.data.bucket + ".s3.amazonaws.com/",
                    function (e) {
                      console.log('upload done');
                        q.resolve(e);
                    },
                    function (e) {
                        alert("Upload failed");
                        q.reject(e);
                    }, options);
 
            }, function (error) {
                console.log('fail', JSON.stringify(error));
            });
 
        return q.promise;
 
    }
 
    return {
        upload: upload
    }

}])



.controller('addCtrl', function($scope, $state, Post, Camera, s3Uploader, $http) {

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
      console.log('ok to send', $scope.post);
      Post.addPost($scope.post);
      
      $scope.post = {
        title: '',
        description : ''   
      };  

      var fileOneName = fileNameGenerator();
      var fileTwoName = fileNameGenerator();

      s3Uploader.upload($scope.imageOne, fileOneName).then(function() {
        console.log('first done');
        s3Uploader.upload($scope.imageTwo, fileTwoName).then(function() {
          console.log('two done');
          $state.go('tab.dash');
        });
      });

      // s3Uploader.upload($scope.imageOne, fileTwoName);

      // $state.go('tab.dash');

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
      if (imageNumber === 'picture-one') {
        $scope.imageOne = imageURI;
      } else {
        $scope.imageTwo = imageURI;
      }

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
      if (imageNumber === 'picture-one') {
        $scope.imageOne = imageURI;
      } else {
        $scope.imageTwo = imageURI;
      }
      angular.element('.picture-container.' + imageNumber).css('background-image', 'url('+imageURI+')' );
      // $scope.$apply()

    }, function(err) {
      console.err('error in take picture', err);
    });
  };

});