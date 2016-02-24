angular.module('starter.controllers', [])

.controller('SplashCtrl', ['$scope', '$state', function($scope, $state) {

  $scope.next = function() {
    $state.go('list');
  }

}])

.controller('ListCtrl', ['$scope', '$state', '$http', '$rootScope', function($scope, $state, $http, $rootScope) {

    $scope.filterType = "View All";
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
              console.log(JSON.stringify($scope.matches[i].auto.definedDefensesAuto.firstDefenseLabel));
            }

          }

          $scope.refreshed = true;

        }
      );

    }


    $scope.statistics = function() {
      $state.go('statistics');
    }

}])

.controller('StatisticsCtrl', ['$scope', '$state', '$http', '$rootScope', function($scope, $state, $http, $rootScope) {

  $scope.refreshed = false;

  $scope.list = function() {
    $state.go('list');
  }

  $scope.newTeam = function(filterTeam) {

    $rootScope.teams =    {team: 0,
                          autoLowBallTotal: 0, autoHighBallTotal: 0, // Convert to Averages
                          autoLowBallAverage: 0, autoHighBallAverage: 0,

                          autoLowBarAch: "Failed", autoLowBarCrossCount: 0,
                          autoPortcullisAch: "Failed", autoPortcullisCrossCount: 0,
                          autoChevalDeFriseAch: "Failed", autoChevalDeFriseCrossCount: 0,
                          autoMoatAch: "Failed", autoMoatCrossCount: 0,
                          autoRampartsAch: "Failed", autoRampartsCrossCount: 0,
                          autoDrawbridgeAch: "Failed", autoDrawbridgeCrossCount: 0,
                          autoSallyPortAch: "Failed", autoSallyPortCrossCount: 0,
                          autoRockWallAch: "Failed", autoRockWallCrossCount: 0,
                          autoRoughTerrainAch: "Failed", autoRoughTerrainCrossCount: 0,

                          teleopLowBallTotal: 0, teleopHighBallTotal: 0, // Convert to Averages
                          teleopLowBallAverage: 0, teleopHighBallAverage: 0,

                          teleopLowBarAch: "Failed", teleopLowBarCrossCount: 0,
                          teleopPortcullisAch: "Failed", teleopPortcullisCrossCount: 0,
                          teleopChevalDeFriseAch: "Failed", teleopChevalDeFriseCrossCount: 0,
                          teleopMoatAch: "Failed", teleopMoatCrossCount: 0,
                          teleopRampartsAch: "Failed", teleopRampartsCrossCount: 0,
                          teleopDrawbridgeAch: "Failed", teleopDrawbridgeCrossCount: 0,
                          teleopSallyPortAch: "Failed", teleopSallyPortCrossCount: 0,
                          teleopRockWallAch: "Failed", teleopRockWallCrossCount: 0,
                          teleopRoughTerrainAch: "Failed", teleopRoughTerrainCrossCount: 0,

                          teleopTotalDamageTotal: 0, // Convert to Averages
                          teleopTotalDamageAverage: 0,

                          teleopCycleTimeTotal: 0, // Convert to Averages
                          teleopCycleTimeAverage: 0,

                          teleopTowerAttackFailCount: 0,
                          teleopTowerAttackChallengeCount: 0,
                          teleopTowerAttackScaleCount: 0,

                          totalTotalScore: 0, // Convert to Averages
                          averageTotalScore: 0,

                          timesOffensiveBot: 0,
                          timesDefensiveBot: 0,
                          timesHybridBot: 0,

                          totalGameCount: 0,

                          autoNotesCollection: [],
                          teleopNotesCollection: []}

    $http.get("http://scoutingserver.herokuapp.com/api/matches")

      .success(function(data) {

        $scope.pull = [];
        $scope.matches = [];

        $scope.pull = data;

        if (filterTeam)
        {
          $rootScope.filter = filterTeam;
        }

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



          if ($scope.pull[i].team == $rootScope.filter)
          {

            for (time = 1; time<=5; time++)
            {
              var theDefense = "";
              var theLabel = "";

              if (time == 1){theDefense = $scope.pull[i].defenseOne;theLabel = $scope.pull[i].auto.definedDefensesAuto.firstDefenseLabel;}
              if (time == 2){theDefense = $scope.pull[i].defenseTwo;theLabel = $scope.pull[i].auto.definedDefensesAuto.secondDefenseLabel;}
              if (time == 3){theDefense = $scope.pull[i].defenseThree;theLabel = $scope.pull[i].auto.definedDefensesAuto.thirdDefenseLabel;}
              if (time == 4){theDefense = $scope.pull[i].defenseFour;theLabel = $scope.pull[i].auto.definedDefensesAuto.fourthDefenseLabel;}
              if (time == 5){theDefense = $scope.pull[i].defenseFive;theLabel = $scope.pull[i].auto.definedDefensesAuto.fifthDefenseLabel;}

              if (theLabel == "Crossed") {

                if (theDefense == "Low Bar") {$rootScope.teams.autoLowBarAch="Crossed";$rootScope.teams.autoLowBarCrossCount++;}
                if (theDefense == "Portcullis (A)") {$rootScope.teams.autoPortcullisAch="Crossed";$rootScope.teams.autoPortcullisCrossCount++;}
                if (theDefense == "Cheval de Frise (A)") {$rootScope.teams.autoChevalDeFriseAch="Crossed";$rootScope.teams.autoChevalDeFriseCrossCount++;}
                if (theDefense == "Moat (B)") {$rootScope.teams.autoMoatAch="Crossed";$rootScope.teams.autoMoatAch++;}
                if (theDefense == "Ramparts (B)") {$rootScope.teams.autoRampartsAch="Crossed";$rootScope.teams.autoRampartsCrossCount++;}
                if (theDefense == "Drawbridge (C)") {$rootScope.teams.autoDrawbridgeAch="Crossed";$rootScope.teams.autoDrawbridgeCrossCount++;}
                if (theDefense == "Sally Port (C)") {$rootScope.teams.autoSallyPortAch="Crossed";$rootScope.teams.autoSallyPortCrossCount++;}
                if (theDefense == "Rock Wall (D)") {$rootScope.teams.autoRockWallAch="Crossed";$rootScope.teams.autoRockWallCrossCount++;}
                if (theDefense == "Rough Terrain (D)") {$rootScope.teams.autoRoughTerrainAch="Crossed";$rootScope.teams.autoRoughTerrainCrossCount++;}

              }
              else if (theLabel == "Reached") {

                if (theDefense == "Low Bar" && $rootScope.teams.autoLowBarAch != "Crossed") {$rootScope.teams.autoLowBarAch="Reached";}
                if (theDefense == "Portcullis (A)" && $rootScope.teams.autoPortcullisAch != "Crossed") {$rootScope.teams.autoPortcullisAch="Reached";}
                if (theDefense == "Cheval de Frise (A)" && $rootScope.teams.autoChevalDeFriseAch != "Crossed") {$rootScope.teams.autoChevalDeFriseAch="Reached";}
                if (theDefense == "Moat (B)" && $rootScope.teams.autoMoatAch != "Crossed") {$rootScope.teams.autoMoatAch="Reached";}
                if (theDefense == "Ramparts (B)" && $rootScope.teams.autoRampartsAch != "Crossed") {$rootScope.teams.autoRampartsAch="Reached";}
                if (theDefense == "Drawbridge (C)" && $rootScope.teams.autoDrawbridgeAch != "Crossed") {$rootScope.teams.autoDrawbridgeAch="Reached";}
                if (theDefense == "Sally Port (C)" && $rootScope.teams.autoSallyPortAch != "Crossed") {$rootScope.teams.autoSallyPortAch="Reached";}
                if (theDefense == "Rock Wall (D)" && $rootScope.teams.autoRockWallAch != "Crossed") {$rootScope.teams.autoRockWallAch="Reached";}
                if (theDefense == "Rough Terrain (D)" && $rootScope.teams.autoRoughTerrainAch != "Crossed") {$rootScope.teams.autoRoughTerrainAch="Reached";}

              }

            }

            for (time = 1; time<=5; time++)
            {
              var theDefense = "";
              var theLabel = "";

              if (time == 1){theDefense = $scope.pull[i].defenseOne;theLabel = $scope.pull[i].teleop.definedDefensesTeleop.firstDefenseLabel;}
              if (time == 2){theDefense = $scope.pull[i].defenseTwo;theLabel = $scope.pull[i].teleop.definedDefensesTeleop.secondDefenseLabel;}
              if (time == 3){theDefense = $scope.pull[i].defenseThree;theLabel = $scope.pull[i].teleop.definedDefensesTeleop.thirdDefenseLabel;}
              if (time == 4){theDefense = $scope.pull[i].defenseFour;theLabel = $scope.pull[i].teleop.definedDefensesTeleop.fourthDefenseLabel;}
              if (time == 5){theDefense = $scope.pull[i].defenseFive;theLabel = $scope.pull[i].teleop.definedDefensesTeleop.fifthDefenseLabel;}

              if (theLabel == "Crossed") {

                if (theDefense == "Low Bar") {$rootScope.teams.teleopLowBarAch="Crossed";$rootScope.teams.teleopLowBarCrossCount++;}
                if (theDefense == "Portcullis (A)") {$rootScope.teams.teleopPortcullisAch="Crossed";$rootScope.teams.teleopPortcullisCrossCount++;}
                if (theDefense == "Cheval de Frise (A)") {$rootScope.teams.teleopChevalDeFriseAch="Crossed";$rootScope.teams.teleopChevalDeFriseCrossCount++;}
                if (theDefense == "Moat (B)") {$rootScope.teams.teleopMoatAch="Crossed";$rootScope.teams.teleopMoatCrossCount++;}
                if (theDefense == "Ramparts (B)") {$rootScope.teams.teleopRampartsAch="Crossed";$rootScope.teams.teleopRampartsCrossCount++;}
                if (theDefense == "Drawbridge (C)") {$rootScope.teams.teleopDrawbridgeAch="Crossed";$rootScope.teams.teleopDrawbridgeCrossCount++;}
                if (theDefense == "Sally Port (C)") {$rootScope.teams.teleopSallyPortAch="Crossed";$rootScope.teams.teleopSallyPortCrossCount++;}
                if (theDefense == "Rock Wall (D)") {$rootScope.teams.teleopRockWallAch="Crossed";$rootScope.teams.teleopRockWallCrossCount++;}
                if (theDefense == "Rough Terrain (D)") {$rootScope.teams.teleopRoughTerrainAch="Crossed";$rootScope.teams.teleopRoughTerrainCrossCount++;}

              }

            }

            $rootScope.teams.team = $rootScope.filter,
            $rootScope.teams.autoLowBallTotal +=$scope.pull[i].auto.lowBall;
            $rootScope.teams.autoHighBallTotal +=$scope.pull[i].auto.highBall; // Convert to Averages

            $rootScope.teams.teleopLowBallTotal +=$scope.pull[i].teleop.lowBall;
            $rootScope.teams.teleopHighBallTotal +=$scope.pull[i].teleop.highBall; // Convert to Averages

            $rootScope.teams.teleopTotalDamageTotal +=$scope.pull[i].teleop.totalDamage; // Convert to Averages
            $rootScope.teams.teleopCycleTimeTotal +=$scope.pull[i].teleop.cycleTime; // Convert to Averages

            if ($scope.pull[i].teleop.towerAttack.towerLabel == "Failed")
            {
              $rootScope.teams.teleopTowerAttackFailCount++;
            }
            else if ($scope.pull[i].teleop.towerAttack.towerLabel == "Challenged")
            {
              $rootScope.teams.teleopTowerAttackChallengeCount++;
            }
            else if ($scope.pull[i].teleop.towerAttack.towerLabel == "Scaled")
            {
              $rootScope.teams.teleopTowerAttackScaleCount++;
            }

            $rootScope.teams.totalTotalScore += $scope.pull[i].totalscore;

            if ($scope.pull[i].botType = "Hybrid")
            {
              $rootScope.teams.timesHybridBot++;
            }
            else if ($scope.pull[i].botType = "Defensive")
            {
              $rootScope.teams.timesDefensiveBot++;
            }
            else if ($scope.pull[i].botType = "Offensive")
            {
              $rootScope.teams.timesOffensiveBot++;
            }

            $rootScope.teams.totalGameCount++;

            $rootScope.teams.autoNotesCollection.push({notes: $scope.pull[i].autonotes, number: $scope.pull[i].number});
            $rootScope.teams.teleopNotesCollection.push({notes: $scope.pull[i].teleopnotes, number: $scope.pull[i].number});
          }

          $scope.refreshed = true;

        }

        $rootScope.teams.autoLowBallAverage = $rootScope.teams.autoLowBallTotal/$rootScope.teams.totalGameCount;
        $rootScope.teams.autoHighBallAverage = $rootScope.teams.autoHighBallTotal/$rootScope.teams.totalGameCount;

        $rootScope.teams.teleopLowBallAverage = $rootScope.teams.teleopLowBallTotal/$rootScope.teams.totalGameCount;
        $rootScope.teams.teleopHighBallAverage = $rootScope.teams.teleopHighBallTotal/$rootScope.teams.totalGameCount;

        $rootScope.teams.teleopTotalDamageAverage = $rootScope.teams.teleopTotalDamageTotal/$rootScope.teams.totalGameCount;
        $rootScope.teams.teleopCycleTimeAverage = $rootScope.teams.teleopCycleTimeTotal/$rootScope.teams.totalGameCount;

        $rootScope.teams.averageTotalScore = $rootScope.teams.totalTotalScore/$rootScope.teams.totalGameCount;

        console.log("success!")

      });
  }

}])
