angular.module('App').controller('modCtrl', ['$scope', '$rootScope', ($scope, $rootScope) => {
  $scope.showTab = (tabindex) => {
    $('.serverTab').removeClass('active')
    $('.serverPane').removeClass('active')
    $('#serverTab' + tabindex).addClass('active')
    $('#serverPane' + tabindex).addClass('active')
    console.log(tabindex)
    console.log($scope.servers)
    $scope.activeServer = $scope.servers[tabindex]
    console.log($scope.activeServer)
    $scope.activeMods = $scope.activeServer.mods
    $scope.activeImage = $scope.activeServer.background
    console.log($scope.activeMods)
    console.log($scope.activeImage)
    $('#modScroll').perfectScrollbar()
  }

  $scope.init = () => {
    $scope.loading = true
    jsonist.get('https://launcher.globalconflicts.net/metadata.json', {
      headers: {
        'user-agent': `Global Conflicts Launcher/${app.getVersion()} (${os.type()} ${os.release()}; ${os.platform()}; ${os.arch()}) - `
      }
    }, (err, data, resp) => {
      $scope.loading = false
      $scope.servers = data.servers
      console.log($scope.servers)
    })
  }
}])
