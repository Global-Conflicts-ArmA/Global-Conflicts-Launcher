angular.module('App').controller('changelogCtrl', ['$scope', ($scope) => {
  
  $scope.init = () => {
    $scope.changeLog = 'server changelog loading'
    $scope.loading = true
    const url = "https://launcher.globalconflicts.net/news.md"
    fetch(url)
    .then( r => r.text() )
    .then( t => {
      marked.use({
        breaks: true
      });
      const regex = /\[size=20\](.*)\[\/size\]/g
      const regParsedT = t.replace(regex, '===$1===')
      const regex2 = /\*\*(.*)\*\*/g
      const regParsedT2 = regParsedT.replace(regex2, '==$1==')
      marked.use({
        breaks: true,
        gfm: true,
      });
      let parsedMD = marked.parse(regParsedT2)
      //console.log(parsedMD)
      document.getElementById('changelogDiv').innerHTML = parsedMD
      $('#changelogDiv').perfectScrollbar()
    })
  }
}])
