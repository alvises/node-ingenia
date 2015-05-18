var request = require('request-promise');

function processBundle(b) {
	b.created_at = new Date(b.created_at);
	b.updated_at = new Date(b.updated_at);
}

module.exports = function(Ingenia) {
	Ingenia.bundle = function(options) {
		if(typeof(options) == 'object') {
			this.id = options.id;
			this.name = options.name;
		} 
		else if(typeof(options) == 'string' || typeof(options) == 'number') {
			this.id = options;	
		}
		

		this.all = function() {
			return request.get(Ingenia.endPoint+'/bundles',{
				qs: {
					api_key: Ingenia.apiKey
				}
			})
			.then(function(result){
				var json = JSON.parse(result);
				if(json && json.data) {
					var bundles = json.data;
					//setting dates
					bundles.forEach(function(b){
						processBundle(b);
					});
				}
				return json.data;
			})
		};

		// id: bundle id
		// name: bundle name
		this.get = function(options) {
			if(!options) options = {};
			var name = this.name || options.name;
			var bundleId = this.id || options.id;

			var endPoint = Ingenia.endPoint+'/bundles';
			if(bundleId) endPoint += '/'+bundleId;
			else if(name) {
				endPoint += '/find_by_name';
			}

			return request(endPoint,{
				qs: {
					api_key: Ingenia.apiKey,
					name: name
				}
			})
			.then(function(result) {
				var json = JSON.parse(result);
				var bundle = json.data;
				return bundle;
			})
		};

		this.save = function() {
			var bundle = this;
			var endPoint = Ingenia.endPoint+'/bundles';
			var json = {name: this.name};

			return request.post(endPoint,{
				json: true,
				qs: {
					api_key: Ingenia.apiKey,
					json: JSON.stringify(json)
				}
			})
			.then(function(result){
				if(result && result.data) {
					for(var key in result.data) {
						bundle[key] = result.data[key];
					} 						
				}
				return bundle;
			})
		}

		this.delete = function() {
			var bundle = this;
			var bundleId = this.id;
			var endPoint = Ingenia.endPoint+'/bundles/'+bundleId;
			return request.del(endPoint,{
				qs: {
					api_key: Ingenia.apiKey,
				}
			})
			.then(function(result) {
				return;
			})
		}
	}
}