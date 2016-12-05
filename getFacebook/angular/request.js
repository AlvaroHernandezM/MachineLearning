var app = angular.module('mainModule', ['ngFacebook']);

app.controller('controller',function($scope,$http,$facebook){

	//Metodo principal
	$scope.main = function () {
		detectFace('http://www.blogsedal.com/Images/2234/2234-723846-crem-pr-el-rostro-912x512-02.jpg');
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