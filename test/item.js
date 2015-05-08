var assert = require('chai').assert;
var util = require('util');

var Ingenia = require('../index');

describe('Item',function(){
	it('should create an item with custom text',function(done){
		this.timeout(5000);

		Ingenia.bundle.get({name: 'Test'}).then(function(bundle){
			Ingenia.item(bundle.id).create({text: 'hello world!',tags: ['hello','world']})
			.then(function(item){
				assert.isNotNull(item);
				console.log(item);
				done();
			},function(err){
				console.log(err);
				done();
			});
		});
	})
});