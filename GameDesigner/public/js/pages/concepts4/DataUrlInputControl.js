

define([],function()
{
	var DataUrlInputControl = function(model,content)
	{
		var that = {

			init: function(done)
			{
				model.dataUrlInputContainer = that.createDataUrlInputContainer();
				model.dataUrlInputControl = that.createDataUrlInputControl(model.dataUrlInputContainer);

				if (done)
					done();
			},

			onDataUrlInputChange: function()
			{
				var value = model.dataUrlInputControl.val();

				if (value.indexOf("/") == -1 && value.indexOf(".") == -1)
				{
					value = "/data/" + value + ".json";
				}

				if (value !== model.dataUrl)
				{
					model.setValue("dataUrl",value);
				}
			},

			createDataUrlInputContainer: function()
			{
				var dataUrlInputContainer = $("<div id='dataUrlInputContainer'><span class='label'>Data Url</span></div>").appendTo(content);

				return dataUrlInputContainer;
			},

			createDataUrlInputControl: function(dataUrlInputContainer)
			{
				var dataUrlInput = $("<input type='text' id='dataUrlInput' />").appendTo(dataUrlInputContainer);
				dataUrlInput.val(model.dataUrl);
				dataUrlInput.bind("keypress", function(e)
				{
					if (e.keyCode == 13)
					{
						that.onDataUrlInputChange();
					}
				});

				return dataUrlInput;
			}
		};

		return that;
	}

	return DataUrlInputControl;
})