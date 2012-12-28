
define([], function()
{
	var getPathToTarget = function(source,target,nodeParents)
	{
		var path = [];

		var curNode = target;
		path.unshift(curNode);

		while (curNode.equals(source) == false)
		{
			curNode = nodeParents[curNode.index];
			path.unshift(curNode);
		}

		return path;
	}

	var SearchBreadthFirst = function(graph,source,target)
	{
		var visitedNodeIndexes = {};
		var nodeParents = {};
		var edgeQueue = [];
		var startingEdge = {from: source, to: source, cost: 0};

		edgeQueue.push(startingEdge);
		visitedNodeIndexes[source.index] = "visited";

		while (edgeQueue.length > 0)
		{
			var curEdge = edgeQueue.shift();

			nodeParents[curEdge.to.index] = curEdge.from;

			if (curEdge.to.equals(target))
			{
				return getPathToTarget(source,target,nodeParents);
			}

			graph.getEdgesFrom(curEdge.to).forEach(function(edgeFrom)
			{
				if (visitedNodeIndexes[edgeFrom.to.index] === undefined)
				{
					edgeQueue.push(edgeFrom);
					visitedNodeIndexes[curEdge.to.index] = "visited";
				}
			})
		}

		return [];
	}

	return SearchBreadthFirst;
})