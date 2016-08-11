var weatherApp = angular.module("weatherApp", []);

weatherApp.controller("weatherCtrl", function ($scope, $http) {

	$scope.forecasts = [];
	$scope.zipCode = '34639';
	$scope.showMain = false;
	$scope.noLocation = true;
	
	$scope.getLatLon = function(){
		var startPos;
		var geoOptions = {
			maximumAge: 15 * 60 * 1000,
			timeout: 10 * 1000
		}

		var geoSuccess = function(position) {
			startPos = position;
			$scope.lat = startPos.coords.latitude;
			$scope.lon = startPos.coords.longitude;
			$scope.getCity($scope.lat, $scope.lon);
		};
		var geoError = function(position) {
			console.log('Error occurred. Error code: ' + error.code);
			switch(error.code){
				case '0':
					console.log('unknown error');
					//show zip code entry box
					$scope.noLocation = true;
					break;
				case '1':
					console.log('permission denied');
					//show zip code entry box
					$scope.noLocation = true;
					break;
				case '2':
					console.log('position unavailable (error response from location provider)');
					//show zip code entry box
					$scope.noLocation = true;
					break;
				case '3':
					console.log(' timed out');
					//show zip code entry box
					$scope.noLocation = true;
					break;
				default:
					console.log('An unknown error occured');
					//show zip code entry box
					$scope.noLocation = true;
			}
		};
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
	};
	
	$scope.getLatLon();
			
	$scope.icons = {
		'chanceflurries': 'snow',
		'chancerain': 'rain',
		'chancesleet': 'snow',
		'chancesnow': 'snow',
		'chancetstorms': 'tstorms',
		'clear': 'sunny',
		'cloudy': 'clouds',
		'flurries': 'snow',
		'fog': 'clouds',
		'hazy': 'clouds',
		'mostlycloudy': 'clouds',
		'mostlysunny': 'sunny',
		'overcast': 'clouds',
		'partlycloudy': 'clouds',
		'partlysunny': 'partSunny',
		'sleet': 'snow',
		'rain': 'rain',
		'snow': 'snow',
		'sunny': 'sunny',
		'tstorms': 'tstorms'
	}
	
	$scope.getCity = function(lat, lon){
		var locUrl = "http://api.wunderground.com/api/a13b7b2ede6af563/geolookup/q/" + lat + "," + lon +".json";
		
		$http({
			method: "GET",
			url : locUrl,
			dataType : "jsonp",
		}).then(function gotConditions(response) {
			var conditionsUrl = response.data.location.requesturl;
			var locationJSONUrl = conditionsUrl.slice(0, -5);
			console.log('got city: ');
			console.log(response);
			$scope.showMain = true;
			$scope.city = response.data.location.city;
			$scope.state = response.data.location.state;
			$scope.getConditions(locationJSONUrl);
			$scope.getForecast(locationJSONUrl);
		}, function error(err){
			console.log(err);
		});
	}
	
	$scope.getCityByZip = function(){
		var locUrl = "http://api.wunderground.com/api/a13b7b2ede6af563/geolookup/q/" + $scope.zipCode + ".json";
		
		$http({
			method: "GET",
			url : locUrl,
			dataType : "jsonp",
		}).then(function gotConditions(response) {
			var conditionsUrl = response.data.location.requesturl;
			var locationJSONUrl = conditionsUrl.slice(0, -5);
			console.log('got city: ');
			console.log(response);
			$scope.showMain = true;
			$scope.city = response.data.location.city;
			$scope.state = response.data.location.state;
			$scope.getConditions(locationJSONUrl);
			$scope.getForecast(locationJSONUrl);
		}, function error(err){
			console.log(err);
		});
	}
	
	$scope.getConditions = function(locDir){
		var condUrl = 'http://api.wunderground.com/api/a13b7b2ede6af563/geolookup/conditions/q/' + locDir + '.json';
		
		$http({
			method: "GET",
			url : condUrl,
			dataType : "jsonp",
		}).then(function gotConditions(response) {
			$scope.weather = response.data.current_observation;
			$scope.currIcon = $scope.icons[response.data.current_observation.icon];			
			$scope.currTime = moment(response.data.local_epoch).format('MMMM Do YYYY, h:mm a');
			console.log('got current conditions: ');
			console.log($scope.weather);
		}, function error(err){
			console.log(err);
		});
	}
	
	$scope.getForecast = function(url){
		var foreUrl = 'http://api.wunderground.com/api/a13b7b2ede6af563/geolookup/forecast/q/' + url + '.json';
		
		$http({
			method: "GET",
			url : foreUrl,
			dataType : "jsonp",
		}).then(function gotForecast(response) {
			console.log('got forecast: ');
			console.log(response);
			var days = response.data.forecast.simpleforecast.forecastday.length;
			for(var i = 0; i < days; i++){
				var icon = response.data.forecast.simpleforecast.forecastday[i].icon;
				response.data.forecast.simpleforecast.forecastday[i].icon = $scope.icons[icon];
				$scope.forecasts.push(response.data.forecast.simpleforecast.forecastday[i]);
			}
		}, function error(err){
			console.log(err);
		});
	}

});