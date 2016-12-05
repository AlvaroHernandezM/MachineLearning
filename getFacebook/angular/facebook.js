app.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('1093188044136348');
})

app.run( function( $rootScope ) {
  (function(){
     if (document.getElementById('facebook-jssdk')) {return;}
     var firstScriptElement = document.getElementsByTagName('script')[0];
     var facebookJS = document.createElement('script'); 
     facebookJS.id = 'facebook-jssdk';
     facebookJS.src = '//connect.facebook.net/en_US/sdk.js';
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());
});

app.controller('controller',function($scope,$http,$facebook){  
  $scope.isLoggedIn = false;
  $facebook.login().then(function() {
    refresh();
  });

  function refresh() {
    $facebook.api('/5347104545/members','GET',{"fields":"name,link,picture.type(large)"}).then( 
      function(response) {
        console.log(response);
        $scope.welcomeMsg = "Welcome " + response;
        $scope.isLoggedIn = true;
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
      });
  }
});