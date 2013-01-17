
define([
	"/js/pages/concepts4/ArborGraphAlgos.js"
],function(
	ArborGraphAlgos
){
	var GraphAutoSave = function(model)
	{
		var that = {

			init: function(done)
			{
				model.ee.on("newNodeChanged",that.onGraphChange);
				model.ee.on("deletedNodeChanged",that.onGraphChange);

				if (done)
					done();
			},

			onGraphChange: function()
			{
				var graph = that.serializeGameGraph();

				$.ajax({
					url: model.dataUrl,
					type: "POST",
					data: JSON.stringify(graph),
					contentType: "application/json",
					success: function(data)
					{
						if (data.result == "error")
							console.log("save error");
						else
							console.log("graph saved");
					}
				});
			},

			serializeGameGraph: function()
			{
				var sys = model.sys;
				var nodes = {};
				var edges = {};

				ArborGraphAlgos.dive(sys,model.gameNode,
					function(node)
					{
						nodes[node.name] = node.data;
					},
					function(edge)
					{
						if (!edges[edge.from.name])
							edges[edge.from.name] = {};

						edges[edge.from.name][edge.to.name] = {};
					});

				return {nodes: nodes, edges: edges};
			}
		};

		return that;
	};

	return GraphAutoSave;
})