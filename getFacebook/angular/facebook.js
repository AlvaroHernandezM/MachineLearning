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