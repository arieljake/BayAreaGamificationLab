

define(["/js/pages/concepts/DrawUtils.js"], function(DrawUtils)
{
	var nodeRadius = 40;
	var drawUtils = DrawUtils();

	var NodeRenderer = function(model)
	{
		return function(node,pt)
		{
			// node: {mass:#, p:{x,y}, name:"", data:{}}
			// pt:   {x:#, y:#}  node position in screen coords

			if (node.data._visibleTree == true)
			{
				var depth = Math.min(7,model.depth);

				drawUtils.drawNodeAt.call(this,pt,{
					fillStyle: (node.name == "Game" ? "rgba(196,179,232,1.0)" : "#9DDE96"),
					strokeStyle: "#999",
					text: node.name,
					radius: (nodeRadius / (8/(8-depth)))
				});
			}
		}
	};



	return NodeRenderer;
})