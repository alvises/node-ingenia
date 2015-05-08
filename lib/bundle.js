var q = require('q');
var request = require('request');

module.exports = function(Ingenia) {
	Ingenia.bundle = {
		all: function() {
			var deferred = q.defer();
			request(Ingenia.endPoint+'/bundles/',{
				qs: {
					api_key: Ingenia.apiKey
				}
			},function(error,response,body){
				if(error) deferred.reject(e);
				else {
					var json = JSON.parse(body);
					deferred.resolve(json.data);
				}
			});
			return deferred.promise;
		}
	}
}