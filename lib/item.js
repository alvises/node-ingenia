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
		};

		this.delete = function(options) {
			var item = this;
			var id = this.id || options.id;
			var uri = Ingenia.endPoint + '/items/'+id;
			return request({
				uri: uri,
				method: 'DELETE',
				json: true,
				form: { 
					api_key: Ingenia.apiKey, 
					bundle_id: this.bundleId
				}
			})
			.then(function(result){
				return item;
			})
		}

		this.summarize = function(options) {
			if(!options) options = {};
			var params = {};
			var id = this.id || options.id;
			var text = this.text || options.text;
			var maxSentences = this.maxSentences || options.maxSentences;
			
			params.api_key = Ingenia.apiKey;
			if(id) params.id = id;
			if(text) params.text = text;
			if(maxSentences) params.max_sentences = maxSentences;
			
			return request({
				uri: Ingenia.endPoint+'/summarise',
				method: 'POST',
				json: true,
				form: params
			});
		}
	}
}