

define(["/js/pages/concepts/DrawUtils.js"], function(DrawUtils)
{
	var nodeRadius = 20;
	var drawUtils = DrawUtils();

	var NodeRenderer = function(node,pt)
	{
		// node: {mass:#, p:{x,y}, name:"", data:{}}
		// pt:   {x:#, y:#}  node position in screen coords

		if (node.data._visibleTree == true)
		{
			drawUtils.drawNodeAt.call(this,pt,{
				fillStyle: (node.name == "Game" ? "rgba(196,179,232,1.0)" : "#9DDE96"),
				strokeStyle: "#FFFFFF",
				text: node.name,
				radius: node.data.radius
			});
		}
		else if (node.data._breadcrumb == true)
		{
			drawUtils.drawNodeAt.call(this,pt,{
				fillStyle: "rgba(0, 0, 0, 0.3)",
				text: node.name.replace("_breadcrumb:",""),
				radius: node.data.radius
			});
		}
	};



	return NodeRenderer;
})