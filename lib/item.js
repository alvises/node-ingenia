var q = require('q');
var request = require('request-promise');

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
			var uri = Ingenia.endPoint + '/items';
			var method = 'POST';
			if(this.id !== undefined) {
				uri = Ingenia.endPoint + '/items/'+this.id;
				method = 'PUT';
			}
			if(this.bundleId !== undefined) json.bundle_id = this.bundleId;

			return request({
				uri: uri,
				method: method,
				json: true,
				form: {
					json: JSON.stringify(json),
					api_key: Ingenia.apiKey
				}
			})
			.then(function(result){
				if(result && result.data) {
					for(var key in result.data) {
						item[key] = result.data[key];
					} 						
				}
				return item;
			})
		}
	}
}