angular.module('App').controller('navbarCtrl', ['$scope', '$rootScope', ($scope, $rootScope) => {
  $scope.tabs = [
    {
      icon: 'glyphicon glyphicon-home', title: 'Mods', tag: 'modsTabBtn'
    }, {
      icon: 'glyphicon glyphicon-tasks', title: 'Server', tag: 'serversTabBtn'
    }, {
      icon: 'glyphicon glyphicon-list-alt', title: 'Changelog', tag: 'changelogTabBtn'
    }, {
      icon: 'glyphicon glyphicon-cog', title: 'Settings', tag: 'settingsTabBtn'
    }]

  $scope.switchSlide = (tab) => {
    $rootScope.slide = $scope.tabs.indexOf(tab)
  }

  $rootScope.$watch(
    'slide', () => {
      $('#carousel-main').carousel($rootScope.slide)
      if (typeof process.env.PORTABLE_EXECUTABLE_DIR !== 'undefined') {
        $rootScope.portable = true
        $rootScope.AppTitle = 'Global Conflicts Launcher - ' + app.getVersion() + ' Portable - ' + $scope.tabs[$rootScope.slide].title
      } else if (typeof process.windowsStore !== 'undefined') {
        $rootScope.portable = false
        $rootScope.AppTitle = 'Global Conflicts Launcher - ' + app.getVersion() + ' Windows Store - ' + $scope.tabs[$rootScope.slide].title
      } else {
        $rootScope.portable = false
        $rootScope.AppTitle = 'Global Conflicts Launcher - ' + app.getVersion() + ' - ' + $scope.tabs[$rootScope.slide].title
      }
      if ($rootScope.map) {
        $rootScope.map.invalidateSize(false)
      }
    }, true
  )

  $scope.$watch(
    'AppTitle', () => {
      document.title = $rootScope.AppTitle
    }, true)

  $scope.tourApp = () => {
    $rootScope.tour.start()
  }
}])
