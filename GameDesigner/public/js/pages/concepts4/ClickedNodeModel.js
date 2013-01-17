

define([],function()
{
	var ClickedNodeModel = function(model)
	{
		var that = {

			init: function(done)
			{
				model.ee.on("clickedNodeChanged", that.onClickedNodeChange);

				if (done)
					done();
			},

			onClickedNodeChange: function()
			{
//				var clickedNode = model.clickedNode;
//
//				if (model.selectedNode != clickedNode)
//					model.setValue("selectedNode",clickedNode);
			}
		};

		return that;
	};

	return ClickedNodeModel;
})