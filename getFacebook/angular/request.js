var app = angular.module('mainModule', ['ngFacebook']);

app.controller('controller',function($scope,$http,$facebook){

	$scope.members = new Array();

	//Metodo principal
	$scope.main = function () {
		//$scope.getMembers();
		//$scope.detectFace('http://www.blogsedal.com/Images/2234/2234-723846-crem-pr-el-rostro-912x512-02.jpg');
		$scope.watson();
	};
	
	$scope.getMembers = function () {
		$scope.isLoggedIn = false;
		$facebook.login().then(function() {
			refresh('');
		});

		function refresh(after) {
			$facebook.api('/5347104545/members','GET',{"fields":"name,link,picture.type(large)","limit":"1000","after":after}).then( 
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

	$scope.watson = function (){
		$http.post('https://watson-api-explorer.mybluemix.net/visual-recognition/api/v3/classify?api_key=37ff1e95c9da3f5e5161d6f49b0139469c087f8d&url=https%3A%2F%2Fscontent-mia1-2.xx.fbcdn.net%2Fv%2Ft34.0-12%2F15327550_10211547072255521_2026008890_n.jpg%3Foh%3Dde2807a23063390a95628815543e73e9%26oe%3D5847146E&owners=me&version=2016-05-20')
		.success(function(data){
			console.log(data);
		})
		.error(function(err){
			console.log(err);
		})
	};
});