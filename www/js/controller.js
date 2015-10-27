angular.module('starter.controllers', [])

.controller('ConfirmCtrl', ['$scope', '$state', function($scope, $state) {

  $scope.next = function () {
    $state.go('newmatch');
  };

}])

.controller('NewMatchCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {

  $scope.auto = function() {
    $state.go('auto');
  }

  $rootScope.match = {};

}])

.controller('TeleopCtrl', ['$scope', '$state', '$ionicPopup', '$rootScope', function($scope, $state, $ionicPopup, $rootScope) {

  $scope.stacks = [];

  $scope.stacks.push({size: 1, noodle: false, bin: false});

  $scope.deleteStack = function(index) {
    $scope.stacks.splice(index, 1);
  }

  $scope.newStack = function() {
    $scope.stacks.push({size: 1, noodle: false, bin: false});
  }

  $scope.upload = function() {
    var confirmPopup = $ionicPopup.confirm({
       title: 'Upload',
       template: 'Are you sure you want to upload the match? Double check that all your information is accurate.'
     });
     confirmPopup.then(function(res) {
       if(res) {

         /*$http.post('http://scoutingserver.herokuapp.com/api/matches/', {quadrant: $scope.match.quadrant, number: $scope.match.number, scouter: $scope.match.scouter, teleop: JSON.stringify($scope.stacks)})
             .success(function(data) {
                 console.log(data);
             })
             .error(function(data) {
                 console.log('Error: ' + data);
             }
         );
*/
         $scope.stacks = [];
         $scope.match.number = $scope.match.number + 1;
         $scope.match.team = null;
         $rootScope.uploaded = "Previous match was recoreded. Thank you!";
         $state.go('newmatch');

         console.log('You are sure');
       } else {
         console.log('You are not sure');
       }
     });
   };

}])

.controller('AutoCtrl', ['$scope', '$state', '$rootScope', '$ionicPopup', function($scope, $state, $rootScope, $ionicPopup) {

  $scope.teleop = function() {
    $state.go('teleop');
  }

  $rootScope.auto = {speed: 0, stackSize: 0, bins: 0};

}])

.controller('ListCtrl', ['$scope', '$state', '$rootScope', '$ionicPlatform', '$ionicPopup', function($scope, $state, $rootScope, $ionicPlatform,$ionicPopup) {

}])

.controller('SearchCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {

}])

.controller('SplashCtrl', ['$scope', '$state', function($scope, $state) {

  // goes to Confirm page

  $scope.next = function () {
    $state.go('confirm');
  };

}]);
