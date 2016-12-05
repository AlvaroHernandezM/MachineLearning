var app = angular.module('mainModule', ['ngFacebook']);

app.controller('controller',function($scope,$http,$facebook){

	$scope.members = new Array();

	//Metodo principal
	$scope.main = function () {
		//$scope.getMembers();
		//$scope.detectFaceMicrosft($scope.img);
		//$scope.watson('https://scontent-mia1-2.xx.fbcdn.net/v/t34.0-12/15320306_10211010821042541_437563197_n.jpg?oh=4f8a8c3a854cd21733c4fc0970983da1&oe=58488544');
		//$scope.getOCRMicrosft($scope.img);
		$scope.getOCRSpace($scope.img);
	};
	
	$scope.getMembersFacebook = function () {
		$scope.isLoggedIn = false;
		$facebook.login().then(function() {
			refresh('');
		});

		function refresh(after) {
			$facebook.api('/5347104545/members','GET',{'fields':'name,link,picture.type(large)','limit':'1000','after':after}).then( 
				function(response) {
					$scope.members = $scope.members.concat(response.data);
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
					$scope.welcomeMsg = 'Error';
					console.log(err);
				});
		}
	};

	//Retorna el id de la imagen, si retorna vacio no pertenece a un rostro.
	$scope.detectFaceMicrosft = function (img){
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

	//Retorna el id de la imagen, si retorna vacio no pertenece a un rostro.
	$scope.getOCRMicrosft = function (img){
		var data = {
			url: img
		}

		var param = {
			'language': 'spa',
			'detectOrientation': 'true'
		}

		var config = {
			headers : {
				'Content-Type': 'application/json',
				'Ocp-Apim-Subscription-Key' : '7c955f15783a4000afdd117635ae6b19'
			}
		}

		$http.post('https://api.projectoxford.ai/vision/v1.0/ocr?' + param, data, config)
		.success(function(data){
			console.log(data);
		})
		.error(function(err){
			console.log(err);
		})
	};

	$scope.getOCRSpace = function (img){
		var data = {
			'url': img,
			'language': 'spa',
			'apikey': '0bdd98696888957'
		}

		$http.post('https://api.ocr.space/parse/image', data)
		.success(function(data){
			console.log(data);
		})
		.error(function(err){
			console.log(err);
		})
	};

	$scope.classifierWatson = function (img){
		$scope.apiKeyWatson = '37ff1e95c9da3f5e5161d6f49b0139469c087f8d';
		$http.post('https://watson-api-explorer.mybluemix.net/visual-recognition/api/v3/classify?api_key='+$scope.apiKeyWatson+'&url='+img+'&owners=me&version=2016-05-20')
		.success(function(data){
			console.log(data);
		})
		.error(function(err){
			console.log(err);
		})
	};
});