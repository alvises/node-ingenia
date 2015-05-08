var q = require('q');
var request = require('request');

function processBundle(b) {
	b.created_at = new Date(b.created_at);
	b.updated_at = new Date(b.updated_at);
}

module.exports = function(Ingenia) {
	Ingenia.bundle = {
		all: function() {
			var deferred = q.defer();
			request(Ingenia.endPoint+'/bundles',{
				qs: {
					api_key: Ingenia.apiKey
				}
			},function(error,response,body){
				if(error) deferred.reject(error);
				else {
					var json = JSON.parse(body);
					if(json && json.data) {
						var bundles = json.data;
						//setting dates
						bundles.forEach(function(b){
							processBundle(b);
						});
					}
					deferred.resolve(json.data);
				}
			});
			return deferred.promise;
		},

		// id: bundle id
		// name: bundle name
		get: function(options) {
			var endPoint = Ingenia.endPoint+'/bundles';
			if(options.id) endPoint += '/'+options.id;
			else if(options.name) {
				endPoint += '/find_by_name';
			}
			var deferred = q.defer();
			request(endPoint,{
				qs: {
					api_key: Ingenia.apiKey,
					name: options.name
				}
			},function(error,response,body){
				if(error) deferred.reject(error);
				else {
					var json = JSON.parse(body);
					var bundle = json.data;
					//json.data should be one bundle
					deferred.resolve(bundle)
				}
			});
			return deferred.promise;
		}
	}
}