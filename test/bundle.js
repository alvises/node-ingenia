var assert = require('chai').assert;
var util = require('util');

describe('Bundle',function(){
	it('should get successfully the bundles if correct api key is set in env',function(done){
		var Ingenia = require('../index');
		Ingenia.bundle.all().then(function(bundles){
			console.log(bundles);
			done();
		});
	});

	
});