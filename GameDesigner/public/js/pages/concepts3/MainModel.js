
define([
	"/js/external/EventEmitter.js"
],function(EventEmitter)
{
	var MainModel = function()
	{
		var model = {

			ee: new EventEmitter(),
			_setValues: [],

			init: function()
			{

			},

			setValue: function(name,value)
			{
				var oldValue = model[name];

				model[name] = value;
				model[name + "Changed"] = true;
				model._setValues.push(name);

				console.log(name + "Changed");
				console.dir(value);

				model.ee.emit(name + "Changed",{oldValue: oldValue, newValue: value});
			},

			clearChanges: function()
			{
				model._setValues.forEach(function(name)
				{
					model[name + "Changed"] = false;
				});

				model._setValues = [];
			},

			isChanged: function()
			{
				return model._setValues.length > 0;
			}
		}

		return model;
	};

	return MainModel;
});