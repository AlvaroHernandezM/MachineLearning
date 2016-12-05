var app = angular.module('mainModule', ['ngFacebook']);

app.controller('controller',function($scope,$http,$facebook){

	$scope.members = new Array();

	//Metodo principal
	$scope.main = function () {
		$scope.facebook();
		$scope.detectFace('http://www.blogsedal.com/Images/2234/2234-723846-crem-pr-el-rostro-912x512-02.jpg');
	};


	
	$scope.facebook = function () {
		$scope.isLoggedIn = false;
		$facebook.login().then(function() {
			refresh('');
		});

		function refresh(after) {
			$facebook.api('/5347104545/members','GET',{"fields":"name,link,picture.type(large)","limit":"1000","after":after}).then( 
				function(response) {
					$scope.members = $scope.members.concat(response.data);
					$scope.welcomeMsg = $scope.members.length;
					try {
						refresh(response.paging.cursors.after);
					}
					catch(e){
						console.log('Total miembros: ' + $scope.members.length);
						console.log($scope.members);
					}
					$scope.isLoggedIn = true;
				},
				function(err) {
					$scope.welcomeMsg = "Error";
					console.log(err);
				});
		}
	};

	//Retorna el id de la imagen, si retorna vacio no pertenece a un rostro.
	$scope.detectFace = function (img){
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