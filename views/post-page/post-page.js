angular.module('myApp.postPage', ['myApp.env'])

.controller('postCtrl', ['$scope', 'Post', '$stateParams', function($scope, Post, $stateParams) {
  $scope.parentCategory = $stateParams.parentCat;
  $scope.post = Post.singlePostInfoGet();
}]);