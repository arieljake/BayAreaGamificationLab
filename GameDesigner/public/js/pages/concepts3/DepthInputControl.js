

define([],function()
{
	var DepthInputControl = function(model,content)
	{
		var that = {

			init: function(done)
			{
				model.depthInputContainer = that.createDepthInputContainer();
				model.depthInputControl = that.createDepthInputControl(model.depthInputContainer);

				if (done)
					done();
			},

			onDepthInputChange: function()
			{
				var value = model.depthInputControl.val();

				if (value !== model.depth)
					model.setValue("depth",value);
			},

			createDepthInputContainer: function()
			{
				var depthInputContainer = $("<div id='depthInputContainer'><span class='label'>Depth</span></div>").appendTo(content);
				depthInputContainer.css("position","absolute");
				depthInputContainer.css("top","20px");

				return depthInputContainer;
			},

			createDepthInputControl: function(depthInputContainer)
			{
				var depthInput = $("<input type='number' id='depthInput' min='1' max='10' value='1' />").appendTo(depthInputContainer);
				depthInput.bind("change", function()
				{
					that.onDepthInputChange();
				});

				return depthInput;
			}
		};

		return that;
	}

	return DepthInputControl;
})