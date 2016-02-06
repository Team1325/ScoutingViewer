angular.module('starter.controllers', [])

.controller('SplashCtrl', ['$scope', '$state', function($scope, $state) {

  $scope.next = function() {
    $state.go('list');
  }

}])

.controller('ListCtrl', ['$scope', '$state', '$http', '$rootScope', function($scope, $state, $http, $rootScope) {

    $scope.pull = [];
    $scope.matches = [];
    $scope.refreshed = false;
    $rootScope.filter = "";
    $rootScope.filterType = "";

    $scope.newFilter = function(filterVar,filterSelection){

      $rootScope.filter = filterVar;
      $rootScope.filterType = filterSelection;
      console.log($rootScope.filter);
      console.log($rootScope.filterType);

      $http.get("http://scoutingserver.herokuapp.com/api/matches")

        .success(function(data) {

          $scope.pull = [];
          $scope.matches = [];

          $scope.pull = data;

          console.log($scope.pull.length);

          for (i = 0; i < $scope.pull.length; i++) {

            if ($scope.pull[i].teleop)
            {
              $scope.pull[i].teleop = JSON.parse($scope.pull[i].teleop);
            }
            if ($scope.pull[i].auto)
            {
              $scope.pull[i].auto = JSON.parse($scope.pull[i].auto);
            }

            if ($rootScope.filterType == "Team Number")
            {
              if ($scope.pull[i].team == $rootScope.filter)
              {
                $scope.matches.push($scope.pull[i]);
              }
            }
            else if ($rootScope.filterType == "Scouter")
            {
              if ($scope.pull[i].scouter == $rootScope.filter)
              {
                $scope.matches.push($scope.pull[i]);
              }
            }
            else if ($rootScope.filterType == "Match Number")
            {
              if ($scope.pull[i].number == $rootScope.filter)
              {
                $scope.matches.push($scope.pull[i]);
              }
            }
            else if ($rootScope.filterType == "Total Score Contribution")
            {
              if (JSON.stringify($scope.pull[i].totalscore) == $rootScope.filter)
              {
                $scope.matches.push($scope.pull[i]);
              }
            }
            else {
              $scope.matches.push($scope.pull[i]);
            }

          }

          $scope.refreshed = true;

        }
      );

    }

    $scope.refresh = function() {

      $http.get("http://scoutingserver.herokuapp.com/api/matches")

        .success(function(data) {

          $scope.pull = [];
          $scope.matches = [];

          $scope.pull = data;

          for (i = 0; i < $scope.pull.length; i++) {

            if ($scope.pull[i].teleop)
            {
              $scope.pull[i].teleop = JSON.parse($scope.pull[i].teleop);
            }
            if ($scope.pull[i].auto)
            {
              $scope.pull[i].auto = JSON.parse($scope.pull[i].auto);
            }

            $scope.matches.push($scope.pull[i]);

          }

          $scope.refreshed = true;

        }
      );

    };

}])
