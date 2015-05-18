var assert = require('chai').assert;
var util = require('util');
var Ingenia = require('../index');
describe('Bundle',function(){
	it('should get successfully the bundles if correct api key is set in env',function(done){
		(new Ingenia.bundle()).all().then(function(bundles){
			assert.isAbove(bundles.length,0);
			var bundle = bundles[0];
			assert.isNotNull(bundle.id);
			assert.isNotNull(bundle.created_at);
			assert.isNotNull(bundle.updated_at);
			done();
		});
	});

	it('should find the bundle by name',function(done){
		var bundle = new Ingenia.bundle({name: 'Test'});
		bundle.get().then(function(bundle){
			assert.isNotNull(bundle);
			assert.equal(bundle.name,'Test');
			done();
		});
	});
	
});