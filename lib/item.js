var q = require('q');
var request = require('request');

function Item(bundleId) {
	this.bundleId = bundleId;
}


//attach item to the Ingenia object
module.exports = function(Ingenia) {
	Ingenia.item = function(bundleId) {
		this.bundleId = bundleId;
		this.save = function(json,file) {
			json = json || {};
			var item = this;
			var deferred = q.defer();

			if(this.id !== undefined) json.id = this.is;
			else if(this.bundleId !== undefined) json.bundle_id = this.bundleId;

			var error;

			try {
				request({
					uri: Ingenia.endPoint + '/items',
					method: 'POST',
					json: true,
					form: {
						json: JSON.stringify(json),
						api_key: Ingenia.apiKey
					}
				},function(error,response,result){
					if(error) return deferred.reject(error);
					
					if(result.data) {
						for(var key in result.data) {
							item[key] = result.data[key];
						} 						
					}
					deferred.resolve(item);
				});
			} catch(err) {
				deferred.reject(err);
			}

			return deferred.promise;

		}
	}
}