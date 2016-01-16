angular.module('starter.controllers', [])

.controller('SearchCtrl', ['$scope', '$state', '$rootScope', '$http', function($scope, $state, $rootScope, $http) {

  $scope.matches = [];
  $scope.filter = {};
  $scope.results = [];

  $scope.back = function() {
    $state.go('splash');
  };

  $scope.search = function() {

    $scope.results = [];

    $http.get("http://scoutingserver.herokuapp.com/api/matches")

      .success(function(data) {

        $scope.matches = data;

        for (i = 0; i <= $scope.matches.length; i++) {

          $scope.matches[i].teleop = JSON.parse($scope.matches[i].teleop);
          $scope.matches[i].auto = JSON.parse($scope.matches[i].auto);

          if ($scope.matches[i].team == parseInt($scope.filter.team)) {
            $scope.results.push($scope.matches[i]);
          }

        }

      }
    );

  };

}])

.controller('SplashCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {

    $scope.matches = [];
    $scope.filter = {};
    $scope.refreshed = false;

    $scope.refresh = function() {

      $http.get("http://scoutingserver.herokuapp.com/api/matches")

        .success(function(data) {

          $scope.matches = data;

          for (i = 0; i <= $scope.matches.length; i++) {

            $scope.matches[i].teleop = JSON.parse($scope.matches[i].teleop);
            $scope.matches[i].auto = JSON.parse($scope.matches[i].auto);

          }

          $scope.refreshed = true;

        }
      );

    };

    $scope.search = function() {

      $state.go('search');

    };

    $scope.filter = function() {

      $state.go('filter');

    };

}])

.controller('FilterCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {

  $scope.matches = [];
  $scope.filter = {};
  $scope.refreshed = false;
  $scope.results = [];

    $scope.back = function() {

      $state.go('splash');

    };

    $scope.refresh = function() {

      $scope.results = [];

      if ($scope.filter.type == "RC Auto") {

        $http.get("http://scoutingserver.herokuapp.com/api/matches")

          .success(function(data) {

            $scope.matches = data;

            for (i = 0; i <= $scope.matches.length; i++) {

              $scope.matches[i].teleop = JSON.parse($scope.matches[i].teleop);
              $scope.matches[i].auto = JSON.parse($scope.matches[i].auto);

              if ($scope.matches[i].auto.speed > 0) {
                  $scope.results.push($scope.matches[i]);
              }

            }

          }
        );

      }

      else if ($scope.filter.type == "Points earned") {

        $http.get("http://scoutingserver.herokuapp.com/api/matches")

          .success(function(data) {

            $scope.matches = data;

            for (i = 0; i <= $scope.matches.length; i++) {

              $scope.matches[i].points = 0;

              for (j = 0; j < $scope.matches[i].teleop.length; j++) {

                $scope.matches[i].points += (parseInt($scope.matches[i].teleop[j].size) * 2);

                if ($scope.matches[i].teleop[j].bin == true) {
                  $scope.matches[i].points += (4 * $scope.matches[i].teleop[j].size);
                }

                if ($scope.matches[i].teleop[j].noodle == true) {
                  $scope.matches[i].points += 6;
                }

                if ($scope.matches[i].teleop[j].rainbow == true) {
                  $scope.matches[i].points *= 2;
                }

              }

            }

          }
        );

        $scope.matches.sort(function(a, b) {

          if (parseInt(a.points) > parseInt(b.points)) {
            return 1;
          }
          if (parseInt(a.points) < parseInt(b.points)) {
            return -1;
          }

          return 0;
        });

      }

    };

}]);
