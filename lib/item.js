var q = require('q');
var request = require('request-promise');

function Item(bundleId) {
	this.bundleId = bundleId;
}


//attach item to the Ingenia object
module.exports = function(Ingenia) {
	Ingenia.item = function(bundleId,id) {
		this.bundleId = bundleId;
		this.id = id;
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

			var req = request({
				uri: uri,
				method: method,
				json: true
			});

			var form = req.form();
			if(file) form.append('file',file);
			form.append('json',JSON.stringify(json));
			form.append('api_key',Ingenia.apiKey);
			return req.then(function(result){
				if(result && result.data) {
					for(var key in result.data) {
						item[key] = result.data[key];
					} 						
				}
				return item;
			});
		}
	}
}