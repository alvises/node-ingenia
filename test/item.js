var assert = require('chai').assert;
var util = require('util');
var fs = require('fs');

var Ingenia = require('../index');

describe('Item',function(){
	this.timeout(5000);
	var bundleId;

	beforeEach(function(done){
		(new Ingenia.bundle()).get({name: 'Test'}).then(function(bundle){
			bundleId = bundle.id;
			done();
		});
	});

	describe('#save',function(){
		
		it('should create an item with custom text',function(done){
			
			var item = new Ingenia.item(bundleId);
			var text = 'hello world '+Math.random();
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

		it('should update initializing the item with id and bundle id',function(done){
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
		});

		it('should create the item and upload the pdf',function(done){
			this.timeout(15000);
			var item = new Ingenia.item(bundleId);

			item.save({},fs.createReadStream('test/fixtures/test.pdf'))
			.then(function(newItem){
				assert.isNotNull(newItem.id);
				assert.isNotNull(newItem.text);
				assert.isAbove(newItem.text.length,100);
				done();
			});
		});

		it('should create an item with large text data',function(done){
			this.timeout(15000);
			var item = new Ingenia.item(bundleId);
			var data = "";
			var s = fs.createReadStream('test/fixtures/text.txt');
			s.on('data',function(chunk){
				data += chunk;
			})
			.on('end',function(){
				item.save({
					text: data
				})
				.then(function(newItem){
					assert.isNotNull(newItem.id);
					assert.isNotNull(newItem.text);
					assert.isAbove(newItem.text.length,100);
					assert.equal(newItem.text,data);
					done();
				});

			});
		});

		describe('#delete',function(){
			var item;
			beforeEach(function(done){
				item = new Ingenia.item(bundleId);
				var msg = 'message to be deleted ' + Math.random();
				item.save({
					text: msg,
					tags: ['to', 'be', 'deleted']
				})
				.then(function(){
					done();
				});
			});

			it.only('should delete the existing item',function(done){
				item.delete().then(function(deletedItem){
					assert.equal(deletedItem.id,item.id);
					done();
				})
				.catch(function(error){
					console.log(error);
					done(error);
				});
			});
		});

		describe('Summarize',function(){
			this.timeout(15000);
			var item;
			beforeEach(function(done){
				var i = new Ingenia.item(bundleId);
				i.save({},fs.createReadStream('test/fixtures/test.pdf'))
				.then(function(newItem){
					item = i;
					done();
				});
			});

			it('should have a summarization of the item',function(done){
				item.summarize().then(function(result){
					console.log(result);
					done();
				});
			});
		});
	});
});