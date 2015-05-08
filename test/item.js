var assert = require('chai').assert;
var util = require('util');

var Ingenia = require('../index');

describe('Item',function(){
	var bundleId;
	beforeEach(function(done){
		Ingenia.bundle.get({name: 'Test'}).then(function(bundle){
			bundleId = bundle.id;
			done();
		});
	});

	describe('#save',function(){

		it('should create an item with custom text',function(done){
			this.timeout(4000);
			var item = new Ingenia.item(bundleId);
			var text = 'hello world '+Math.random();

			item.save({
				text: text,
				tags: ['hello', 'world','another','tag']
			}).then(function(item){
				assert.isNotNull(item.id);
				assert.equal(item.bundleId,bundle.id);
				assert.equal(item.text, text);
				done();
			},function(error){
				conso.e.log(error);
			})
		})


		it.only('should update the item',function(done){
			//save the first item
			var item = new Ingenia.item(bundleId);
			var text = 'hello world '+Math.random();
			var secondText = 'second text '+Math.random();

			item.save({
				text: text,
				tags: ['hello', 'world']
			}).then(function(createdItem){
				assert.equal(createdItem.text,text);

				createdItem.save({
					text: secondText
				}).then(function(updatedItem){
					assert.equal(updatedItem.text,secondText);
					assert.equal(updatedItem.id,createdItem.id);
					done();
				});
			});
		})
	});
});