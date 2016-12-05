var app = angular.module('mainModule', ['ngFacebook']);

app.controller('controller',function($scope,$http,$facebook){

	//Metodo principal
	$scope.main = function () {
		$scope.isLoggedIn = false;
		$facebook.login().then(function() {
			refresh();
		});

		function refresh() {
			$facebook.api('/5347104545/members','GET',{"fields":"name,link,picture.type(large)"}).then( 
				function(response) {
					$scope.welcomeMsg = "Welcome " + response.name;
					$scope.isLoggedIn = true;
				},
				function(err) {
					$scope.welcomeMsg = "Please log in";
				});
		}

		refresh();
	};

	//Retorna el id de la imagen, si retorna vacio no pertenece a un rostro.
	function detectFace(img){
		var data = {
			url: img
		}

		var config = {
			headers : {
				'Content-Type': 'application/json',
				'Ocp-Apim-Subscription-Key' : 'fe7560344bad462c8658412202e534b1'
			}
		}

		$http.post('https://api.projectoxford.ai/face/v1.0/detect?', data, config)
		.success(function(data){
			console.log(data);
			return data.faceId;
		})
		.error(function(err){
			console.log(err);
		})
	};
});