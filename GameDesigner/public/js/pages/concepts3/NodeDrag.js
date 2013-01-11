

define([],function()
{
	var NodeDrag = function(model)
	{
		var dragged = undefined;
		var _mouseP = undefined;
		var that = {

			init: function(done)
			{
				model.ee.on("mouseDownNodeChanged",that.onNodeMouseDown);

				if (done)
					done();
			},

			onNodeMouseDown: function()
			{
				_mouseP = model.mouseDownCanvasPoint;
				dragged = model.mouseDownNode;

				if (dragged)
				{
					console.log("node drag started");
					dragged.fixed = true; 					// while we're dragging, don't let physics move the node

					model.canvas.bind('mousemove', that.onDrag);
					$(window).bind('mouseup', that.onMouseUp);
				}
			},

			onDrag: function(e)
			{
				var pos = $(model.canvas).offset();
				var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

				if (dragged)
				{
					var p = model.sys.fromScreen(s);
					dragged.p = p;
				}
			},

			onMouseUp: function(e)
			{
				if (!dragged)
					return;

				console.log("node drag ended");

				dragged.fixed = false;
				dragged.tempMass = 1000;
				dragged = undefined;

				model.canvas.unbind('mousemove', that.onDrag);
				$(window).unbind('mouseup', that.onMouseUp);
				_mouseP = null
			}
		};

		return that;
	}

	return NodeDrag;
})