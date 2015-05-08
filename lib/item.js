var q = require('q');
var request = require('request');

//attach item to the Ingenia object
module.exports = function(Ingenia) {
	Ingenia.item = function(bundleId) {
		console.log('BundleId: '+bundleId);
		return {
			create: function(options) {
				var deferred = q.defer();

				var params = {}, jsonParams, file;
				
				if(options) {
					if(bundleId) options.bundle_id = bundleId;						
					if(options.file) {
						file = options.file;
						delete options.file;
					}
					params.json = options;
					jsonParams = JSON.stringify(params);
				}
				console.log(jsonParams);
				request({ 
					url: Ingenia.endPoint+'/items', 
					method: 'POST',
					json: true,
					headers: { "content-type": "application/json"},
					body: params,
					qs: {api_key: Ingenia.apiKey}
				},function(error,response,body){
					if(error) return deferred.reject(error);
					deferred.resolve(body);
				});

				return deferred.promise;
			}
		}
	}
}