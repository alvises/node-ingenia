var assert = require('chai').assert;
var util = require('util');
var Ingenia = require('../index');
describe('Bundle',function(){
	
	describe('#get',function(){
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
	
	describe('#create',function(){
		it('should create the bundle',function(done){
			bundle = new Ingenia.bundle({name: 'TestToDelete'});
			bundle.save()
			.then(function(createdBundle){
				assert.isNotNull(createdBundle.id);
				assert.equal(createdBundle.id,bundle.id);
				bundle.delete().then(done);
			})
			.catch(function(error){
				console.log(error);
				assert.isNull(error);
				done(error);
			});
		})
	});

	describe('#delete',function(){
		var bundle;
		beforeEach(function(done){
			bundle = new Ingenia.bundle({name: 'TestToDelete'});
			bundle.save()
			.then(function(createdBundle){
				done();
			});
		});

		it('should delete the bundle with valid id',function(done){
			bundle.delete()
			.then(function(){
				//check if the bundle exists
				var deletedBundle = (new Ingenia.bundle(bundle.id));
				deletedBundle.get().catch(function(error){
					assert.isNotNull(error);
					done();
				});
			});
		})
	});

});