var app = angular.module('mainModule', ['ngFacebook']);

app.controller('controller',function($scope,$http,$facebook){

	$scope.members = new Array();

	//Metodo principal
	$scope.main = function () {
	    //llamando a Watson
		$scope.classifierWatson($scope.img);
	
	};

	$scope.classifierWatson = function (img){
		var apiKeyWatson = '37ff1e95c9da3f5e5161d6f49b0139469c087f8d';
		var threshold = '0.05'; //puntaje minimo para traer la respuesta
		var owners = 'me'; //utiliza los clasificadores de
		var version = '2016-05-20';
		//urls funcionando:
		//https%3A%2F%2Ffb-s-a-a.akamaihd.net%2Fh-ak-xpf1%2Fv%2Ft34.0-12%2F15400993_10211556462330267_4927781756354383261_n.jpg%3Foh%3D9b95b6ddeb0f85d12c34c3ed34f95eb4%26oe%3D584807DE%26__gda__%3D1481197555_fa4c46bda8fbc16d6a6ab1ec25fea9c4
		//https%3A%2F%2Ffb-s-c-a.akamaihd.net%2Fh-ak-xpa1%2Fv%2Ft34.0-12%2F15350645_10211556247604899_6714770042266764987_n.jpg%3Foh%3D6980550a809d62337407d9fc3d3ba136%26oe%3D5849473C%26__gda__%3D1481195213_8a8d059ae6f61d1987c1c275a6307724
		//https%3A%2F%2Fscontent-atl3-1.xx.fbcdn.net%2Fv%2Ft34.0-12%2F15285094_10211556245244840_802085943704274960_n.jpg%3Foh%3D373f73a57cd8b7b25833862ac0c4eddf%26oe%3D58493247
		//usadndo esta varibale mientras tanto
		$scope.classifier='cargando imagen....';
		$http.post('https://watson-api-explorer.mybluemix.net/visual-recognition/api/v3/classify?api_key=' + apiKeyWatson + '&url=' + encodeURL(img) + '&owners='+owners+'&threshold='+ threshold +'&version='+ version).
		success(function(data){
			if(data.custom_classes>0){ //verificando que encontro clases
				$scope.classifier=' se han encontrado: '+data.custom_classes+' clases';
				$classes = data.images[0].classifiers[0].classes;
				$classes.forEach(function (classe){ //monstrando las clases
					$scope.classifier = $scope.classifier+'  - clase: '+classe.class+' - puntaje: '+classe.score;
				});
				$scope.getOCRMicrosft(img);
			} else {
				$scope.classifier='no se pudo clasificar la imagen como un carnet de la uptc, ingresa otra imagen';
			}			
		}).
		error(function(err,status){
			console.log(err);
			$scope.test = err;
		});
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
		$scope.txtMicrosoft='extrayendo texto...';
		$http.post('https://api.projectoxford.ai/vision/v1.0/ocr?' + param, data, config)
		.success(function(data){
			console.log(data);
			var regions = data.regions;
			if(regions.length>0){ //verificando que existen regiones con texto y monnstrandolas
				$scope.lines = data.regions[0].lines;
				$scope.txtMicrosoft = '';
				var index = 0;
				$scope.lines.forEach(function(line){
					line.words.forEach(function(text){						
						if (index == 0){
							var str=text.text.toLowerCase().replace(' ','').replace(/\./g,'');
							$scope.txtMicrosoft =  str;
						} else {
							var str=text.text.toLowerCase().replace(' ','').replace(/\./g,'');
							$scope.txtMicrosoft =  $scope.txtMicrosoft + '-' + str;
						}
						index++;
					});
				});
				//filtrando el texto  que ingresa
				var filterWords = $scope.txtMicrosoft.split('-');
				for (var i = filterWords.length - 1; i >= 0; i--) {
					if (filterWords[i].length<3||filterWords[i].match(/uptc/)||filterWords[i].match(/cod/)||filterWords[i].match(/edu/)||filterWords[i].match(/www/)||filterWords[i].match(/[0-9]/)) { //el texto
						filterWords.splice(i, 1);
					}
				}
				$scope.filterMicrosoft = filterWords;
			} else {
				$scope.txtMicrosoft = 'no se ha podido identificar ni extraer el texto de la imagen';
			}
			
		})
		.error(function(err){
			console.log(err.message);
			$scope.txtMicrosoft = 'No se ha podido extraer el texto, error: '+err.message;
		})
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

	
	
});