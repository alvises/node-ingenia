var assert = require('chai').assert;
var util = require('util');

describe('Ingenia',function(){
	it('should load apiKey from the env var INGENIA_APIKEY once initialized',function(){
		process.env.INGENIA_APIKEY = 'ingenia apikey';
		var Ingenia = require('../index');
		assert.equal('ingenia apikey', Ingenia.apiKey);
	});

	
});