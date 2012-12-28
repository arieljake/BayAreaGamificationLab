/**
 * @param provider
 * - getEdgesFrom(index)
 *   {to: NODE, cost: COST}
 */

define(["/js/external/graph-algos/PriorityQueue.js"],function(PriorityQueue)
{
	var SearchByDjikstra = function(provider,sourceIndex,targetIndex)
	{
		var priorityQueue = new PriorityQueue(function(a,b) {
			return a.priority - b.priority;
		});

		var shortestPathTree = {};
		var costToNode = {};
		var searchFrontier = {};

		priorityQueue.push(sourceIndex,0);
		searchFrontier[sourceIndex] = {from: sourceIndex, to: sourceIndex, cost: 0};

		while (priorityQueue.length > 0)
		{
			var closestNodeIndex = priorityQueue.pop();
			shortestPathTree[closestNodeIndex] = searchFrontier[closestNodeIndex];

			if (closestNodeIndex == targetIndex)
				break;

			provider.getEdgesFrom(closestNodeIndex).forEach(function(edgeFrom)
			{
				var newCost = costToNode[closestNodeIndex] + edgeFrom.cost;

				if (searchFrontier[edgeFrom.to] == 0)
				{
					costToNode[edgeFrom.to] = newCost;
					priorityQueue.push(edgeFrom.to,newCost);
					searchFrontier[edgeFrom.to] = edgeFrom;
				}
				else if ( (newCost < costToNode[edgeFrom.to]) && (shortestPathTree[edgeFrom.to] == 0))
				{
					costToNode[edgeFrom.to] = newCost;
					priorityQueue.changePriority(edgeFrom.to,newCost);
					searchFrontier[edgeFrom.to] = edgeFrom;
				}
			})
		}
	}

	return SearchByDjikstra;
});