app.run(['$window',	function($window) {	
	$window.fbAsyncInit = function() {
		FB.init({ 
			appId: '1093188044136348',
			status: true, 
			cookie: true, 
			xfbml: true,
			version: 'v2.8'
		});

		FB.login(function(response) {
			if (response.authResponse) {
				var access_token =   FB.getAuthResponse()['accessToken'];
				console.log('Access Token = '+ access_token);
				FB.api('/me', function(response) {
					console.log('Good to see you, ' + response.name + '.');
				});
			} else {
				console.log('User cancelled login or did not fully authorize.');
			}
		}, {scope: ''});

		FB.api(
			'/5347104545/members',
			'GET',
			{"fields":"name,link,picture.type(large)"},
			function(response) {
				console.log(response);
			}, {access_token: access_token});
	};	
}]);


