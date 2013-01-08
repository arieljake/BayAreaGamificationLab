define(["/js/external/EventEmitter.js"], function(EventEmitter)
{
	var SysRenderer = function(sys,canvas,params)
	{
		var dom = $(canvas);
		var canvasElem = dom.get(0);
		var ctx = canvasElem.getContext("2d");

		var nodeRenderer = params.nodeRenderer;
		var edgeRenderer = params.edgeRenderer;

		var that = {
			ee: new EventEmitter(),
			invalid: true,
			dirCounter: 0,

			dir: function(obj)
			{
				if (that.dirCounter < 500)
				{
					that.dirCounter++;
					console.dir(obj);
				}
			},

			init:function(system)
			{
				sys.fps(24);
				sys.screenSize(canvasElem.width, canvasElem.height)
				sys.screenPadding(80) // leave an extra 80px of whitespace per side
			},

			redraw:function()
			{
				ctx.fillStyle = "white"
				ctx.fillRect(0,0, canvasElem.width, canvasElem.height)

				sys.eachEdge(function(edge,pt1,pt2)
				{
					edgeRenderer.call(ctx,edge,pt1,pt2);
				})

				sys.eachNode(function(node,pt)
				{
					nodeRenderer.call(ctx,node,pt);
				})
			}
		};

		return that;
	}

	return SysRenderer;
})