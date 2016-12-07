var app = angular.module('mainModule', ['ngFacebook']);

app.controller('controller',function($scope,$http,$facebook){

	$scope.idGroup = '160626413991175'; //ING SISTEMAS


	//Metodo principal
	$scope.main = function () {
	    //llamando a Watson
	    $scope.classifierWatson($scope.img);
	    $scope.l = $scope.img;

	};

	$scope.classifierWatson = function (img){
		var apiKeyWatson = '37ff1e95c9da3f5e5161d6f49b0139469c087f8d';
		var threshold = '0.1'; //puntaje minimo para traer la respuesta
		var owners = 'me'; //utiliza los clasificadores de
		var version = '2016-05-20';
		$scope.classifier='cargando imagen....';
		$http.post('https://watson-api-explorer.mybluemix.net/visual-recognition/api/v3/classify?api_key=' + apiKeyWatson + '&url=' + encodeURL(img) + '&owners='+owners+'&threshold='+ threshold +'&version='+ version).
		success(function(data){
			if(data.images[0].classifiers.length>0){ //verificando que encontro clases
				$scope.classifier=' se han encontrado: '+data.images[0].classifiers+' clases';
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
					if (filterWords[i].length<3||filterWords[i].match(/uptc/)||filterWords[i].match(/cod/)||filterWords[i].match(/edu/)||filterWords[i].match(/www/)||filterWords[i].match(/[0-9]/)||filterWords[i].match(/ypțę/)) { //el texto
						filterWords.splice(i, 1);
					}
				}
				$scope.filterMicrosoft = filterWords;
				$scope.members = new Array();
				$scope.candidates = new Array();
				$scope.name = new Array();
				$scope.combinationsName = new Array();
				$scope.getMembersFacebook();
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
		
		$facebook.login().then(function() {
			refresh('');
		});

		function refresh(after) {
			$facebook.api('/'+$scope.idGroup+'/members','GET',{'fields':'name,link,picture.type(large)','limit':'1000','after':after}).then( 
				function(response) {
					$scope.members = $scope.members.concat(response.data);
					try {
						refresh(response.paging.cursors.after);
					}
					catch(e){
						$scope.classifierMembersFacebookName();

					}
				},
				function(err) {
					$scope.numMembersFacebook = 'Error';
					console.log(err);
				});
		}
	};

	$scope.classifierMembersFacebookName = function () {
		$scope.name = $scope.filterMicrosoft.slice(0,4);
		$scope.combinationsName = combinations($scope.name);
		for (var i = $scope.members.length - 1; i >= 0; i--) {
			for (var j = $scope.combinationsName.length - 1; j >= 0; j--) {
				if(cleanString($scope.members[i].name) == cleanString($scope.combinationsName[j]))
				{
					$scope.candidates.push($scope.members[i]);
					break;
				}
			}
		}
		$scope.classifierMembersFacebookPicture();
	};

	$scope.classifierMembersFacebookPicture = function () {
		$scope.detectFaceMicrosft($scope.img,-1);
	};

	$scope.detectFaceCandidates = function () {
		for (var i = $scope.candidates.length - 1; i >= 0; i--) {
			$scope.detectFaceMicrosft($scope.candidates[i].picture.data.url,i);
		}
	};

	//Retorna el id de la imagen, si retorna vacio no pertenece a un rostro.
	$scope.detectFaceMicrosft = function (img,index){
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
			if (index < 0) {
				$scope.faceId1 = data[0].faceId;
				$scope.detectFaceCandidates();
			}else{
				if (data.length == 0) {
					delete $scope.candidates[index];
				}else{
					$scope.candidates[index].faceId = data[0].faceId;
					$scope.verifyFaceMicrosft($scope.faceId1, $scope.candidates[index].faceId);
				}
			}
		})
		.error(function(err){
			console.log(err);
		})
	};

	$scope.verifyFaceMicrosft = function (faceId1, faceId2) {
		var data = {
			faceId1: faceId1,
			faceId2: faceId2
		}

		var config = {
			headers : {
				'Content-Type': 'application/json',
				'Ocp-Apim-Subscription-Key' : 'fe7560344bad462c8658412202e534b1'
			}
		}

		$http.post('https://api.projectoxford.ai/face/v1.0/verify?', data, config)
		.success(function(data){
			console.log(data);
		})
		.error(function(err){
			console.log(err);
		})
	};	
	
});