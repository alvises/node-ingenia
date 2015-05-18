var assert = require('chai').assert;
var util = require('util');

var Ingenia = require('../index');

describe('Item',function(){
	this.timeout(20000);
	var bundleId;

	beforeEach(function(done){
		console.log(Ingenia.endPoint);
		console.log(Ingenia.apiKey);
		Ingenia.bundle.get({name: 'Test'}).then(function(bundle){
			bundleId = bundle.id;
			done();
		});
	});

	describe('#save',function(){
		
		it.only('should create an item with custom text',function(done){
			
			var item = new Ingenia.item(bundleId);
			var text = 'hello world '+Math.random();
			console.log(text);
			console.log(item);
			item.save({
				text: text,
				tags: ['hello', 'world','another','tag']
			}).then(function(item){
				assert.isNotNull(item.id);
				assert.equal(item.bundleId,bundleId);
				assert.equal(item.text, text);
				done();
			},function(error){
				console.log(error);
				done(error);
			})
		})


		it('should update the item',function(done){
			//save the first item
			var item = new Ingenia.item(bundleId);
			var text = 'hello world '+Math.random();
			var secondText = 'second text '+Math.random();

			item.save({
				text: text,
				tags: ['hello', 'world']
			}).then(function(createdItem){
				assert.equal(createdItem.text,text);
				var createdId = createdItem.id;
				createdItem.save({
					text: secondText
				}).then(function(updatedItem){
					assert.equal(updatedItem.text,secondText);
					assert.equal(updatedItem.id,createdId);
					done();
				});
			});

		})
	});
});