var assert = require('chai').assert;
var util = require('util');

var Ingenia = require('../index');

describe('Item',function(){
	this.timeout(5000);
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
		
		it('should create an item with custom text',function(done){
			
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
				console.log(createdItem);
				createdItem.save({
					text: secondText
				}).then(function(updatedItem){
					assert.equal(updatedItem.text,secondText);
					assert.equal(updatedItem.id,createdId);
					done();
				})
				.catch(function(error){
					console.log('ERROR');
					console.log(error);
					done(error);
				})
			}).catch(function(error){
				console.log(error);
				done(error);
			});
		});

		it.only('should update initializing the item with id and bundle id',function(done){
			var item = new Ingenia.item(bundleId);
			var text = 'hello world '+Math.random();
			item.save({
				text: text,
				tags: ['hello', 'world']
			}).then(function(createdItem){
				
				var newItem = new Ingenia.item(bundleId,createdItem.id);
				var newMessage = 'new message ' + Math.random();
				
				newItem.save({
					text: newMessage,
					tag: ['a','b']
				})
				.then(function(updatedItem){
					assert.equal(updatedItem.id,newItem.id);
					assert.equal(updatedItem.id,createdItem.id);
					assert.equal(updatedItem.text,newMessage);
					assert.deepEqual(updatedItem,newItem);
					done();
				});
			});
		})
	});
});