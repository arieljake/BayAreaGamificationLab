

define([
	"/js/pages/concepts3/SysRenderer.js",
	"/js/pages/concepts3/NodeRenderer.js",
	"/js/pages/concepts3/EdgeRenderer.js",
	"/js/pages/concepts3/ArborGraphAlgos.js",
	"/js/pages/concepts3/ScriptLoader.js"
], function(
	SysRenderer,
	NodeRenderer,
	EdgeRenderer,
	ArborGraphAlgos,
	ScriptLoader
){
	var VisibleTreeModel = function(model,width,height,parent,backgroundImage)
	{
		var that = {

			scriptDeps: [
				'/js/external/jquery/jquery.contextmenu.js',
				'/js/external/arbor/arbor.js',
				'/js/external/arbor/arbor-tween.js',
				'/js/external/arbor/arbor-mixins.js'
			],

			init: function(done)
			{
				ScriptLoader.loadScripts(that.scriptDeps,function()
				{
					model.canvas = that.createCanvas();
					model.canvas.bind("click",that.onCanvasClick);

					model.sys = that.createParticleSystem(model.canvas);

					model.ee.on("graphChanged", that.onGraphChange);
					model.ee.on("clickedMousePointChanged", that.onMousePointClicked);
					model.ee.on("depthChanged", that.refresh);
					model.ee.on("selectedNodeChanged", that.refresh);
					model.ee.on("newNodeChanged", that.refresh);

					model.sys.renderer.init(done);
				})
			},

			onGraphChange: function()
			{
				var sys = model.sys;

				sys.prune(function(node,from,to)
				{
					return true;
				});
				sys.graft(model.graph);

				model.gameNode = sys.getNode("Game");
				model.setValue("selectedNode",model.gameNode);
				model.setValue("depth",1);
			},

			refresh: function()
			{
				var sys = model.sys;
				var prevVisibleTreeDepth = model.visibleTreeDepth;
				var prevVisibleTreeStart = model.visibleTreeStart;
				var visibleTreeStart = model.selectedNode;
				var depth = model.depth;

				if (prevVisibleTreeStart)
				{
					prevVisibleTreeStart.data._visibleTree = false;

					ArborGraphAlgos.dive(sys,prevVisibleTreeStart,
						function(node,context)
						{
							node.data._visibleTree = false;
						},
						function(edge,context)
						{
							edge.data._visibleTree = false;
						},
						prevVisibleTreeDepth);
				}

				if (visibleTreeStart)
				{
					visibleTreeStart.data._visibleTree = true;

					ArborGraphAlgos.dive(sys,visibleTreeStart,
						function(node,context)
						{
							node.data._visibleTree = true;
						},
						function(edge,context)
						{
							edge.data._visibleTree = true;
						},
						depth);
				}

				model.visibleTreeStart = visibleTreeStart;
				model.visibleTreeDepth = depth;
				sys.start();

				console.log("visible tree refreshed");
			},

			onCanvasClick: function(e)
			{
				var canvas = model.canvas;

				var canvasPos = canvas.offset();
				var mouseP = arbor.Point(e.pageX-canvasPos.left, e.pageY-canvasPos.top);

				console.log("--- user interaction (" + e.type + ") ---");

				model.setValue("clickedPagePoint",arbor.Point(e.pageX, e.pageY));
				model.setValue("clickedMousePoint",mouseP);
			},

			onMousePointClicked: function()
			{
				var sys = model.sys;
				var selectedNode = model.selectedNode;
				var clickedPoint = model.clickedMousePoint;

				ArborGraphAlgos.diveBreadthFirst(sys,selectedNode,function(node,context)
				{
					var distance = sys.toScreen(node.p).subtract(clickedPoint).magnitude();

					if (node.data._visibleTree == false)
					{
						console.log("end of visible tree reached");
						return true;
					}
					else if (distance <= node.data.radius)
					{
						console.log("visible node clicked");
						model.setValue("clickedNode",node);
						return true;
					}
				});
			},

			createCanvas: function()
			{
				var canvas = $("<canvas id='viewport'></canvas>").appendTo(parent);
				canvas.attr("width",width || 1024);
				canvas.attr("height",height || 768);

				parent.append("<span class='sectionTitle visibleTreeModel'>Graph</span>");

				return canvas;
			},

			createParticleSystem: function(canvas)
			{
				var sys = arbor.ParticleSystem({
					repulsion: 500,
					stiffness: 0,
					friction: 0.0,
					integrator: "verlet",
					gravity: true
				});
				sys.renderer = SysRenderer(sys,canvas,{
					nodeRenderer: NodeRenderer(model),
					edgeRenderer: EdgeRenderer(model),
					backgroundImage: backgroundImage
				});

				return sys;
			}
		};

		return that;
	};

	return VisibleTreeModel;
});