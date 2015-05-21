var q = require('q');
var request = require('request-promise');

function Item(bundleId) {
	this.bundleId = bundleId;
}


//attach item to the Ingenia object
module.exports = function(Ingenia) {
	Ingenia.item = function(bundleId,id) {
		if(bundleId != undefined) this.bundleId = bundleId;
		if(id != undefined) this.id = id;
		
		this.save = function(json,file) {
			json = json || {};
			var item = this;
			var params = {uri: Ingenia.endPoint + '/items', method: 'POST',json: true};

			if(this.id != undefined) {
				params.uri = Ingenia.endPoint + '/items/'+this.id;
				params.method = 'PUT';
			}
			if(this.bundleId != undefined) json.bundle_id = this.bundleId;
			
			if(!file) {
				//no file to upload
				params.form = {};
				params.form.json = JSON.stringify(json);
				params.form.api_key = Ingenia.apiKey;
			}
			var req = request(params);

			if(file) {
				//file to send via multipart
				//let's add all via form
				var form = req.form();
				var jsonStr = JSON.stringify(json);
				form.append('file',file);
				form.append('json',jsonStr);
				form.append('api_key',Ingenia.apiKey);
			}

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