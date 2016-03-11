angular.module('myApp.addTab', ['myApp.env'])

.controller('addCtrl', function($scope, $state, Post) {

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
      console.log('error');
    }
  }; 

});