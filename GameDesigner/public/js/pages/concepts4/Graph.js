

define([],function()
{
	var Graph = function(raw)
	{
		var that = {

			nodes: raw.nodes,
			edges: raw.edges,

			eachNode: function(cb)
			{
				for (var nodeName in that.nodes)
				{
					cb(that.nodes[nodeName]);
				}
			}
		};

		for (var key in that.edges)
		{
			if (!that.nodes.hasOwnProperty(key))
				that.nodes[key] = {};

			for (var key2 in that.edges[key])
			{
				if (!that.nodes.hasOwnProperty(key2))
					that.nodes[key2] = {};
			}
		}

		return that;
	};

	return Graph;
})