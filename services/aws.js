angular.module('AskUs.awsServices', [])

.factory('s3Uploader', ['$q','$http', 'DevelopmentAPI', 'ProductionAPI', function($q, $http, DevelopmentAPI, ProductionAPI) {
 
  var upload = function(imageURI, fileName) {

      var signingURI = ProductionAPI + "/api/sign_s3";
 
      var q = $q.defer();
      var ft = new FileTransfer();
      var options = new FileUploadOptions();

      options.fileKey = "file";
      options.fileName = fileName;
      options.mimeType = "image/jpeg";
      options.chunkedMode = false;
 
      $http.post(signingURI, {"fileName": fileName})
          .then(function (data) {
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

}]);


