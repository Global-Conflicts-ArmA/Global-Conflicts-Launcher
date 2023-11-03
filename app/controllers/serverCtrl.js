angular.module('App').controller('serverCtrl', ['$scope', '$sce', ($scope, $sce) => {

  $scope.init = () => {
    $scope.loading = true
    $scope.getProfiles()
    helpers.getServerData()
  }

  $scope.getProfiles = () => {
    $scope.profiles = {
      available: ['Default']
    }
    storage.get('profile', (err, data) => {
      if (err) throw err
      $scope.profiles.selected = data.profile
    })
    const profileDir = app.getPath('documents') + '\\Arma 3 - Other Profiles'
    try {
      fs.lstatSync(profileDir).isDirectory()
      const profiles = fs.readdirSync(profileDir).filter(file => fs.statSync(path.join(profileDir, file)).isDirectory())
      profiles.forEach((profile, i) => {
        $scope.profiles.available.push(decodeURIComponent(profile))
      })
    } catch (e) {
      console.log(e)
      $scope.profiles = false
    }
  }

  $scope.setProfile = () => {
    storage.set('profile', {
      profile: $scope.profiles.selected
    }, (err) => {
      if (err) throw err
    })
  }

  $scope.getPlayerDisplayText = (player) => {
    return `• ${player.name}`;
  }

  ipcRenderer.on('to-app', (event, args) => {
    switch (args.type) {
      case 'server-callback':
        $scope.serverId = "Main Server"
        //$scope.serverPlayers = args.data.players
        $scope.serverPlayers = [
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "pizzadox" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" },
          { name: "w-cephei" }
        ]
        $scope.serverName = args.data.name
        $scope.serverPlayerCount = $scope.serverPlayers.length
        $scope.serverMissionName = "" 
        $scope.serverAppId = args.data.raw.appId
        if ($scope.serverPlayerCount > -1 && args.data.raw.game != "Arma 3") {
          $scope.serverMissionName = args.data.raw.game
        } else {
          $scope.serverMissionName = "No Mission Selected"
        }
        $scope.serverPing = false
        ping.promise.probe(config.ServerIP)
        .then(function (res) {
          $scope.serverPing = res.time
        })
        $('#playerScroll').perfectScrollbar()
        $scope.$apply()
        $scope.loading = false
        break
    }
  })

  $scope.joinServer = (server) => {
    if ($scope.serverAppId === 107410) {
      storage.get('settings', (err, data) => {
        if (err) throw err
        const params = []
        params.push('-noLauncher')
        params.push('-useBE')
        params.push('-connect=' + config.ServerIP)
        params.push('-port=' + config.Port)
        params.push('-mod=' + server.StartParameters)
        params.push('-password=' + server.ServerPassword)
        if ($scope.profiles && $scope.profiles.selected !== 'Default') {
          params.push('-name=' + $scope.profiles.selected)
        }
        if (data.splash) {
          params.push('-nosplash')
        }
        if (data.intro) {
          params.push('-skipIntro')
        }
        if (data.ht) {
          params.push('-enableHT')
        }
        if (data.windowed) {
          params.push('-window')
        }
        if (data.mem && typeof data.mem !== 'undefined') {
          params.push('-maxMem=' + data.mem)
        }
        if (data.vram && typeof data.vram !== 'undefined') {
          params.push('-maxVRAM=' + data.vram)
        }
        if (data.cpu && typeof data.cpu !== 'undefined') {
          params.push('-cpuCount=' + data.cpu)
        }
        if (data.thread && typeof data.thread !== 'undefined') {
          params.push('-exThreads=' + data.thread)
        }
        if (data.add_params && typeof data.add_params !== 'undefined') {
          params.push(data.add_params)
        }

        helpers.spawnNotification('Launching ArmA...')
        alertify.log('Launching ArmA...', 'success')
        child.spawn((data.armapath + '\\arma3launcher.exe'), params, [])
        console.log(params)
      })
    } else {
      alertify.log('Launching ArmA...', 'success')
      shell.openExternal('steam://connect/' + server.IpAddress + ':' + server.Port)
    }
  }
}])
