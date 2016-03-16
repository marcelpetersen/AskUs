angular.module('myApp.postPage', ['myApp.env'])

.controller('postCtrl', ['$scope', 'Post', '$stateParams', function($scope, Post, $stateParams) {
  $scope.parentCategory = $stateParams.parentCat;
  $scope.post = Post.singlePostInfoGet();



  // TO DO on click on user picture link and userinfo object saving for redirection
}]);