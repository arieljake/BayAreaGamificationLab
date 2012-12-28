
define(["/js/external/graph-algos/SearchBreadthFirst.js"], function(SearchBreadthFirst)
{
	var ArborGraphAlgos = {

		search: function(sys,source,target)
		{
			return SearchBreadthFirst(sys,source,target);
		},

		diveBreadthFirst: function(sys,node,nodeCB,edgeCB)
		{
			function _dive(queue,nodeCB,edgeCB)
			{
				var context = this;

				with (context)
				{
					while (queue.length > 0)
					{
						var curEdge = queue.shift();
						var cbResult = false;

						nodeParents[curEdge.to.index] = curEdge.from;

						if (edgeCB && edgeCB(curEdge,context))
							return true;

						if (nodeCB && nodeCB(curEdge.to,context))
							return true;

						sys.getEdgesFrom(curEdge.to).forEach(function(edgeFrom)
						{
							if (visitedNodeIndexes[edgeFrom.to.index] === undefined)
							{
								queue.push(edgeFrom);
								visitedNodeIndexes[curEdge.to.index] = "visited";
							}
						})

						if (_dive.call(context,queue,nodeCB,edgeCB))
						{
							return true;
						}
					}
				}
			}

			var context = {
				depth: 1,
				visitedNodeIndexes: {},
				nodeParents: {}
			};
			_dive.call(context,[{from: node, to: node, cost: 0}],nodeCB,edgeCB);
		},

		dive: function(sys,node,nodeCB,edgeCB,maxDepth)
		{
			function _dive(node,nodeCB,edgeCB)
			{
				var context = this;
				var edgesFrom = sys.getEdgesFrom(node);

				if (edgesFrom.length > 0)
				{
					edgesFrom.forEach(function(edgeFrom)
					{
						var cbResult = false;

						if (nodeCB)
							cbResult = nodeCB(edgeFrom.target,context);

						if (!cbResult && edgeCB)
							cbResult = edgeCB(edgeFrom,context);

						if (!cbResult && (!maxDepth || maxDepth > context.depth))
							cbResult = _dive.call({depth: context.depth+1},edgeFrom.target,nodeCB,edgeCB,maxDepth);

						if (cbResult == true)
							return true;
					});
				}
			}

			var context = {depth: 1};
			_dive.call(context,node,nodeCB,edgeCB,maxDepth);
		},

		dive2: function(sys,node,nodeCB,edgeCB,maxDepth)
		{
			function _dive(node,nodeCB,edgeCB)
			{
				var context = this;
				var edgesFrom = sys.getEdgesFrom(node);

				if (edgesFrom.length > 0)
				{
					edgesFrom.forEach(function(edgeFrom)
					{
						var cbResult = false;

						if (!maxDepth || maxDepth > context.depth)
							cbResult = _dive.call({depth: context.depth+1},edgeFrom.target,nodeCB,edgeCB,maxDepth);

						if (!cbResult && nodeCB)
							cbResult = nodeCB(edgeFrom.target,context);

						if (!cbResult && edgeCB)
							cbResult = edgeCB(edgeFrom,context);

						if (cbResult == true)
							return true;
					});
				}
			}

			var context = {depth: 1};
			_dive.call(context,node,nodeCB,edgeCB,maxDepth);
		},

		climb: function(sys, node,nodeCB,edgeCB)
		{
			function _climb(node,nodeCB,edgeCB)
			{
				var context = this;
				var edgesTo = sys.getEdgesTo(node);

				if (edgesTo.length > 0)
				{
					var edgeTo = edgesTo[0];

					nodeCB(edgeTo.source,context);
					edgeCB(edgeTo,context);

					_climb({},edgeTo.source,nodeCB,edgeCB);
				}
			}

			_climb({},node,nodeCB,edgeCB);
		}
	};

	return ArborGraphAlgos;
})