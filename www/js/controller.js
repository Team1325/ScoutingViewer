angular.module('starter.controllers', ['ionic'])

.controller('SplashCtrl', ['$scope', '$state', function($scope, $state) {

  $scope.next = function() {
    $state.go('list');
  }

}])

.controller('ListCtrl', ['$scope', '$state', '$http', '$rootScope', '$filter', function($scope, $state, $http, $rootScope, $filter) {

    $scope.filterType = "View All";
    $scope.orderType = "Date Uploaded";
    $scope.pull = [];
    $scope.matches = [];
    $scope.refreshed = false;
    $rootScope.filter = "";
    $rootScope.filterType = "";
    $rootScope.orderType = "";
    $rootScope.reverse = false;
    $scope.reverseOrder = false;

    $scope.newFilter = function(filterVar,filterSelection,orderSelection,reverseOrder){

      $rootScope.filter = filterVar;
      $rootScope.filterType = filterSelection;

      $rootScope.orderType = orderSelection;

      console.log("Filtering By: " + $rootScope.filterType);
      console.log("Filter: " + $rootScope.filter);

      console.log("Ordering By: " + $rootScope.orderType);
      console.log("Reverse: " + reverseOrder);

      $http.get("http://scoutingserver.herokuapp.com/api/matches")

        .success(function(data) {

          $scope.pull = [];
          $scope.matches = [];
          $scope.orderedMatches = [];

          $scope.pull = data;

          console.log("Number of Entries: " + $scope.pull.length);

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
                $scope.matches[i].indexValue = i;
              }
            }
            else if ($rootScope.filterType == "Scouter")
            {
              if ($scope.pull[i].scouter == $rootScope.filter)
              {
                $scope.matches.push($scope.pull[i]);
                $scope.matches[i].indexValue = i;
              }
            }
            else if ($rootScope.filterType == "Match Number")
            {
              if ($scope.pull[i].number == $rootScope.filter)
              {
                $scope.matches.push($scope.pull[i]);
                $scope.matches[i].indexValue = i;
              }
            }
            else if ($rootScope.filterType == "Robot Type")
            {
              if ($scope.pull[i].robotType == $rootScope.filter)
              {
                $scope.matches.push($scope.pull[i]);
                $scope.matches[i].indexValue = i;
              }
            }
            else {
              $scope.matches.push($scope.pull[i]);
              $scope.matches[i].indexValue = i;

            }

          }

          if ($rootScope.orderType == "Date Uploaded")
          {
            $rootScope.reverse = reverseOrder;

            $scope.orderedMatches = $scope.matches;

            $scope.orderedMatches = $filter('orderBy')($scope.orderedMatches, "indexValue", $rootScope.reverse);
            console.log("Ordered Matches:")
            for (asd = 0; asd<$scope.orderedMatches.length; asd++)
            {
                console.log(JSON.stringify($scope.orderedMatches[asd].indexValue));
            }
          }
          else if ($rootScope.orderType == "Match Number")
          {
            $rootScope.reverse = reverseOrder;

            $scope.orderedMatches = $scope.matches;
            $scope.orderedMatches = $filter('orderBy')($scope.orderedMatches, "number", $rootScope.reverse);

            console.log("Ordered Matches:")
            for (asd = 0; asd<$scope.orderedMatches.length; asd++)
            {
                console.log(JSON.stringify($scope.orderedMatches[asd].number));
            }
          }
          else if ($rootScope.orderType == "Score Contribution")
          {
            if (reverseOrder){$rootScope.reverse = false;}
            else {$rootScope.reverse = true;}

            $scope.orderedMatches = $scope.matches;
            $scope.orderedMatches = $filter('orderBy')($scope.orderedMatches, "totalscore", $rootScope.reverse);

            console.log("Ordered Matches:")
            for (asd = 0; asd<$scope.orderedMatches.length; asd++)
            {
                console.log(JSON.stringify($scope.orderedMatches[asd].totalscore));
            }
          }

          $scope.refreshed = true;

        }
      );

    }


    $scope.statistics = function() {
      $state.go('statistics');
    }
    $scope.rankings = function() {
      $state.go('rankings');
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
                          autoLowShotTotal: 0, autoHighShotTotal: 0,
                          autoLowShotAverage: 0, autoHighShotAverage: 0,

                          autoLowBarAch: "Failed", autoLowBarCrossCount: 0, autoLowBarAppearCount: 0,
                          autoPortcullisAch: "Failed", autoPortcullisCrossCount: 0, autoPortcullisAppearCount: 0,
                          autoChevalDeFriseAch: "Failed", autoChevalDeFriseCrossCount: 0, autoChevalDeFriseAppearCount: 0,
                          autoMoatAch: "Failed", autoMoatCrossCount: 0, autoMoatAppearCount: 0,
                          autoRampartsAch: "Failed", autoRampartsCrossCount: 0, autoRampartsAppearCount: 0,
                          autoDrawbridgeAch: "Failed", autoDrawbridgeCrossCount: 0, autoDrawbridgeAppearCount: 0,
                          autoSallyPortAch: "Failed", autoSallyPortCrossCount: 0, autoSallyPortAppearCount: 0,
                          autoRockWallAch: "Failed", autoRockWallCrossCount: 0, autoRockWallAppearCount: 0,
                          autoRoughTerrainAch: "Failed", autoRoughTerrainCrossCount: 0, autoRoughTerrainAppearCount: 0,

                          teleopLowBallTotal: 0, teleopHighBallTotal: 0, // Convert to Averages
                          teleopLowBallAverage: 0, teleopHighBallAverage: 0,
                          teleopLowShotTotal: 0, teleopHighShotTotal: 0,
                          teleopLowShotAverage: 0, teleopHighShotAverage: 0,

                          teleopLowBarAch: "Failed", teleopLowBarCrossCount: 0, teleopLowBarAppearCount: 0,
                          teleopPortcullisAch: "Failed", teleopPortcullisCrossCount: 0, teleopPortcullisAppearCount: 0,
                          teleopChevalDeFriseAch: "Failed", teleopChevalDeFriseCrossCount: 0, teleopChevalDeFriseAppearCount: 0,
                          teleopMoatAch: "Failed", teleopMoatCrossCount: 0, teleopMoatAppearCount: 0,
                          teleopRampartsAch: "Failed", teleopRampartsCrossCount: 0, teleopRampartsAppearCount: 0,
                          teleopDrawbridgeAch: "Failed", teleopDrawbridgeCrossCount: 0, teleopDrawbridgeAppearCount: 0,
                          teleopSallyPortAch: "Failed", teleopSallyPortCrossCount: 0, teleopSallyPortAppearCount: 0,
                          teleopRockWallAch: "Failed", teleopRockWallCrossCount: 0, teleopRockWallAppearCount: 0,
                          teleopRoughTerrainAch: "Failed", teleopRoughTerrainCrossCount: 0, teleopRoughTerrainAppearCount: 0,

                          teleopTotalDamageTotal: 0, // Convert to Averages
                          teleopTotalDamageAverage: 0,

                          teleopCycleTimeTotal: 0, // Convert to Averages
                          teleopCycleTimeAverage: 0,

                          teleopTowerAttackFailCount: 0,
                          teleopTowerAttackChallengeCount: 0,
                          teleopTowerAttackScaleCount: 0,

                          overallAccuracy: 0,

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

        console.log("Number of Available Entries: " + $scope.pull.length);

        for (i = 0; i < $scope.pull.length; i++) {

          if ($scope.pull[i].team == $rootScope.filter)
          {

            if ($scope.pull[i].teleop)
            {
              $scope.pull[i].teleop = JSON.parse($scope.pull[i].teleop);
            }
            if ($scope.pull[i].auto)
            {
              $scope.pull[i].auto = JSON.parse($scope.pull[i].auto);
            }

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

              if (theDefense == "Low Bar") {$rootScope.teams.autoLowBarAppearCount++;}
              if (theDefense == "Portcullis (A)") {$rootScope.teams.autoPortcullisAppearCount++;}
              if (theDefense == "Cheval de Frise (A)") {$rootScope.teams.autoChevalDeFriseAppearCount++;}
              if (theDefense == "Moat (B)") {$rootScope.teams.autoMoatAppearCount++;}
              if (theDefense == "Ramparts (B)") {$rootScope.teams.autoRampartsAppearCount++;}
              if (theDefense == "Drawbridge (C)") {$rootScope.teams.autoDrawbridgeAppearCount++;}
              if (theDefense == "Sally Port (C)") {$rootScope.teams.autoSallyPortAppearCount++;}
              if (theDefense == "Rock Wall (D)") {$rootScope.teams.autoRockWallAppearCount++;}
              if (theDefense == "Rough Terrain (D)") {$rootScope.teams.autoRoughTerrainAppearCount++;}

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

              if (theDefense == "Low Bar") {$rootScope.teams.teleopLowBarAppearCount++;}
              if (theDefense == "Portcullis (A)") {$rootScope.teams.teleopPortcullisAppearCount++;}
              if (theDefense == "Cheval de Frise (A)") {$rootScope.teams.teleopChevalDeFriseAppearCount++;}
              if (theDefense == "Moat (B)") {$rootScope.teams.teleopMoatAppearCount++;}
              if (theDefense == "Ramparts (B)") {$rootScope.teams.teleopRampartsAppearCount++;}
              if (theDefense == "Drawbridge (C)") {$rootScope.teams.teleopDrawbridgeAppearCount++;}
              if (theDefense == "Sally Port (C)") {$rootScope.teams.teleopSallyPortAppearCount++;}
              if (theDefense == "Rock Wall (D)") {$rootScope.teams.teleopRockWallAppearCount++;}
              if (theDefense == "Rough Terrain (D)") {$rootScope.teams.teleopRoughTerrainAppearCount++;}

            }

            $rootScope.teams.team = $rootScope.filter,
            $rootScope.teams.autoLowBallTotal +=$scope.pull[i].auto.lowBall;
            $rootScope.teams.autoHighBallTotal +=$scope.pull[i].auto.highBall; // Convert to Averages
            $rootScope.teams.autoLowShotTotal +=$scope.pull[i].auto.lowShots;
            $rootScope.teams.autoHighShotTotal +=$scope.pull[i].auto.highShots;

            $rootScope.teams.teleopLowBallTotal +=$scope.pull[i].teleop.lowBall;
            $rootScope.teams.teleopHighBallTotal +=$scope.pull[i].teleop.highBall; // Convert to Averages
            $rootScope.teams.teleopLowShotTotal +=$scope.pull[i].teleop.lowShots;
            $rootScope.teams.teleopHighShotTotal +=$scope.pull[i].teleop.highShots;

            $rootScope.teams.teleopTotalDamageTotal +=$scope.pull[i].teleop.totalDamage; // Convert to Averages
            $rootScope.teams.teleopCycleTimeTotal +=$scope.pull[i].teleop.cycleTime; // Convert to Averages

            if ($scope.pull[i].teleop.towerAttack.towerLabel == "Defended")
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

        $rootScope.teams.autoLowShotAverage = $rootScope.teams.autoLowShotTotal/$rootScope.teams.totalGameCount;
        $rootScope.teams.autoHighShotAverage = $rootScope.teams.autoHighShotTotal/$rootScope.teams.totalGameCount;

        $rootScope.teams.teleopLowShotAverage = $rootScope.teams.teleopLowShotTotal/$rootScope.teams.totalGameCount;
        $rootScope.teams.teleopHighShotAverage = $rootScope.teams.teleopHighShotTotal/$rootScope.teams.totalGameCount;

        $rootScope.teams.teleopTotalDamageAverage = $rootScope.teams.teleopTotalDamageTotal/$rootScope.teams.totalGameCount;
        $rootScope.teams.teleopCycleTimeAverage = $rootScope.teams.teleopCycleTimeTotal/$rootScope.teams.totalGameCount/100;

        $rootScope.teams.overallAccuracy = ($rootScope.teams.autoLowBallTotal +
                                            $rootScope.teams.autoHighBallTotal +
                                            $rootScope.teams.teleopLowBallTotal +
                                            $rootScope.teams.teleopHighBallTotal)/
                                           ($rootScope.teams.teleopHighShotTotal +
                                            $rootScope.teams.teleopLowShotTotal +
                                            $rootScope.teams.autoHighShotTotal +
                                            $rootScope.teams.autoLowShotTotal)*100;

        $rootScope.teams.averageTotalScore = $rootScope.teams.totalTotalScore/$rootScope.teams.totalGameCount;

        console.log("Success!")

      });
  }

}])

.controller('RankingsCtrl', ['$scope', '$state', '$http', '$rootScope', '$filter', function($scope, $state, $http, $rootScope, $filter) {

  $scope.refreshed = false;
  $scope.filterStat = "Avg Score Contribution";
  $scope.filterDisplayStat = "Average Score: ";
  $scope.reverseOrder = false;
  $scope.listTeams = [];

  $scope.list = function() {
    $state.go('list');
  }

  $scope.toggleGroup = function(group) {
    group.show = !group.show;
  };
  $scope.isGroupShown = function(group) {
    return group.show;
  };


  $scope.rankList = function(filterStat, reverseOrder) {

    $http.get("http://scoutingserver.herokuapp.com/api/matches")

      .success(function(data) {

        console.log("Filter: " + filterStat);
        console.log("Reverse: " + reverseOrder);

        $scope.pull = [];
        $scope.matches = [];

        $scope.pull = data;

        $scope.listTeams = [];

        for (check = 0; check < $scope.pull.length; check++) {
          var add = true;
          if ($scope.listTeams.length>0)
          {
            for (doubleCheck = 0; doubleCheck < $scope.listTeams.length; doubleCheck++) {
              if ($scope.pull[check].team == $scope.listTeams[doubleCheck] || !$scope.pull[check].team)
              {
                add = false;
              }
            }
          }
          if (add == true){
            $scope.listTeams.push($scope.pull[check].team);
            console.log("Added Team: " + $scope.pull[check].team + " at: " + check);
          }
        }

        console.log("Teams List: " + JSON.stringify($scope.listTeams));

        $scope.allStats = [];

        for (teamLoc = 0; teamLoc < $scope.listTeams.length; teamLoc++)
        {

        var theTeam = $scope.listTeams[teamLoc];

        console.log("Team: " + theTeam);

        $rootScope.teams =    {team: 0,
                              autoLowBallTotal: 0, autoHighBallTotal: 0, // Convert to Averages
                              autoLowBallAverage: 0, autoHighBallAverage: 0,

                              autoLowBarAch: "Failed", autoLowBarCrossCount: 0, autoLowBarAppearCount: 0,
                              autoPortcullisAch: "Failed", autoPortcullisCrossCount: 0, autoPortcullisAppearCount: 0,
                              autoChevalDeFriseAch: "Failed", autoChevalDeFriseCrossCount: 0, autoChevalDeFriseAppearCount: 0,
                              autoMoatAch: "Failed", autoMoatCrossCount: 0, autoMoatAppearCount: 0,
                              autoRampartsAch: "Failed", autoRampartsCrossCount: 0, autoRampartsAppearCount: 0,
                              autoDrawbridgeAch: "Failed", autoDrawbridgeCrossCount: 0, autoDrawbridgeAppearCount: 0,
                              autoSallyPortAch: "Failed", autoSallyPortCrossCount: 0, autoSallyPortAppearCount: 0,
                              autoRockWallAch: "Failed", autoRockWallCrossCount: 0, autoRockWallAppearCount: 0,
                              autoRoughTerrainAch: "Failed", autoRoughTerrainCrossCount: 0, autoRoughTerrainAppearCount: 0,

                              teleopLowBallTotal: 0, teleopHighBallTotal: 0, // Convert to Averages
                              teleopLowBallAverage: 0, teleopHighBallAverage: 0,

                              teleopLowBarAch: "Failed", teleopLowBarCrossCount: 0, teleopLowBarAppearCount: 0,
                              teleopPortcullisAch: "Failed", teleopPortcullisCrossCount: 0, teleopPortcullisAppearCount: 0,
                              teleopChevalDeFriseAch: "Failed", teleopChevalDeFriseCrossCount: 0, teleopChevalDeFriseAppearCount: 0,
                              teleopMoatAch: "Failed", teleopMoatCrossCount: 0, teleopMoatAppearCount: 0,
                              teleopRampartsAch: "Failed", teleopRampartsCrossCount: 0, teleopRampartsAppearCount: 0,
                              teleopDrawbridgeAch: "Failed", teleopDrawbridgeCrossCount: 0, teleopDrawbridgeAppearCount: 0,
                              teleopSallyPortAch: "Failed", teleopSallyPortCrossCount: 0, teleopSallyPortAppearCount: 0,
                              teleopRockWallAch: "Failed", teleopRockWallCrossCount: 0, teleopRockWallAppearCount: 0,
                              teleopRoughTerrainAch: "Failed", teleopRoughTerrainCrossCount: 0, teleopRoughTerrainAppearCount: 0,

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
                              teleopNotesCollection: [],

                              filterVarStat: 0}

        if (theTeam)
        {
          $rootScope.filter = theTeam;
        }

        console.log("Number of Available Entries: " + $scope.pull.length);

        for (i = 0; i < $scope.pull.length; i++) {

          if ($scope.pull[i].team == $rootScope.filter)
          {

            console.log("+++ New Entry! Count: " + ($rootScope.teams.totalGameCount + 1) + " +++");

            if ($scope.pull[i].teleop)
            {
              $scope.pull[i].teleop = JSON.parse($scope.pull[i].teleop);
            }
            if ($scope.pull[i].auto)
            {
              $scope.pull[i].auto = JSON.parse($scope.pull[i].auto);
            }

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

              if (theDefense == "Low Bar") {$rootScope.teams.autoLowBarAppearCount++;}
              if (theDefense == "Portcullis (A)") {$rootScope.teams.autoPortcullisAppearCount++;}
              if (theDefense == "Cheval de Frise (A)") {$rootScope.teams.autoChevalDeFriseAppearCount++;}
              if (theDefense == "Moat (B)") {$rootScope.teams.autoMoatAppearCount++;}
              if (theDefense == "Ramparts (B)") {$rootScope.teams.autoRampartsAppearCount++;}
              if (theDefense == "Drawbridge (C)") {$rootScope.teams.autoDrawbridgeAppearCount++;}
              if (theDefense == "Sally Port (C)") {$rootScope.teams.autoSallyPortAppearCount++;}
              if (theDefense == "Rock Wall (D)") {$rootScope.teams.autoRockWallAppearCount++;}
              if (theDefense == "Rough Terrain (D)") {$rootScope.teams.autoRoughTerrainAppearCount++;}

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

              if (theDefense == "Low Bar") {$rootScope.teams.teleopLowBarAppearCount++;}
              if (theDefense == "Portcullis (A)") {$rootScope.teams.teleopPortcullisAppearCount++;}
              if (theDefense == "Cheval de Frise (A)") {$rootScope.teams.teleopChevalDeFriseAppearCount++;}
              if (theDefense == "Moat (B)") {$rootScope.teams.teleopMoatAppearCount++;}
              if (theDefense == "Ramparts (B)") {$rootScope.teams.teleopRampartsAppearCount++;}
              if (theDefense == "Drawbridge (C)") {$rootScope.teams.teleopDrawbridgeAppearCount++;}
              if (theDefense == "Sally Port (C)") {$rootScope.teams.teleopSallyPortAppearCount++;}
              if (theDefense == "Rock Wall (D)") {$rootScope.teams.teleopRockWallAppearCount++;}
              if (theDefense == "Rough Terrain (D)") {$rootScope.teams.teleopRoughTerrainAppearCount++;}

            }

            $rootScope.teams.team = $rootScope.filter,
            $rootScope.teams.autoLowBallTotal +=$scope.pull[i].auto.lowBall;
            $rootScope.teams.autoHighBallTotal +=$scope.pull[i].auto.highBall; // Convert to Averages

            $rootScope.teams.teleopLowBallTotal +=$scope.pull[i].teleop.lowBall;
            $rootScope.teams.teleopHighBallTotal +=$scope.pull[i].teleop.highBall; // Convert to Averages

            $rootScope.teams.teleopTotalDamageTotal +=$scope.pull[i].teleop.totalDamage; // Convert to Averages
            $rootScope.teams.teleopCycleTimeTotal +=$scope.pull[i].teleop.cycleTime; // Convert to Averages

            if ($scope.pull[i].teleop.towerAttack.towerLabel == "Defended")
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
        $rootScope.teams.teleopCycleTimeAverage = $rootScope.teams.teleopCycleTimeTotal/$rootScope.teams.totalGameCount/100;

        $rootScope.teams.averageTotalScore = $rootScope.teams.totalTotalScore/$rootScope.teams.totalGameCount;

        if (filterStat == "Avg Score Contribution")
        {
          $rootScope.teams.filterVarStat = $rootScope.teams.averageTotalScore;
        }
        else if (filterStat == "Avg Cycle Time")
        {
          $rootScope.teams.filterVarStat = $rootScope.teams.teleopCycleTimeAverage;
        }

        console.log("Success!");

        $scope.allStats.push($rootScope.teams);

        }

        if (filterStat == "Avg Score Contribution")
        {
          $scope.allStats = $filter('orderBy')($scope.allStats, "averageTotalScore", (!reverseOrder));
          $scope.filterDisplayStat = "Average Score: ";
          console.log("Ranking...  Reversed: " + (!reverseOrder));
          console.log("Ordered Teams:")
          for (dsa = 0; dsa<$scope.allStats.length; dsa++)
          {
              console.log(JSON.stringify($scope.allStats[dsa].averageTotalScore));
          }
        }
        else if (filterStat == "Avg Cycle Time")
        {
          $scope.allStats = $filter('orderBy')($scope.allStats, "teleopCycleTimeAverage", (reverseOrder));
          $scope.filterDisplayStat = "Average Time: ";
          console.log("Ranking...  Reversed: " + (reverseOrder));
          console.log("Ordered Teams:")
          for (dsa = 0; dsa<$scope.allStats.length; dsa++)
          {
              console.log(JSON.stringify($scope.allStats[dsa].teleopCycleTimeAverage));
          }
        }


      });

    }

}])
