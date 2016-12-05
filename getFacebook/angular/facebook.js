app.run(['$window',	function($window, $scope) {	
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
				$scope.getMembers();
			} else {
				console.log('User cancelled login or did not fully authorize.');
			}
		}, {scope: ''});
	};	
}]);


app.factory('facebookService', function($q) {
	return {
		getMembers: function() {
			var deferred = $q.defer();
			FB.api(
				'/5347104545/members',
				'GET',
				{"fields":"name,link,picture.type(large)"},
				function(response) {
					if (!response || response.error) {
						deferred.reject('Error occured');
					} else {
						deferred.resolve(response);
					}
				},{access_token: access_token});
			return deferred.promise;
		}
	}
});


