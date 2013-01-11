

define([], function()
{
	var EdgeRenderer = function(model)
	{
		return function(edge,pt1,pt2)
		{
			if (edge.data._visibleTree == true)
			{
				this.strokeStyle = "rgba(0,0,0, .666)"
				this.lineWidth = 1
				this.beginPath()
				this.moveTo(pt1.x, pt1.y)
				this.lineTo(pt2.x, pt2.y)
				this.stroke()
			}
		}
	};

	return EdgeRenderer;
})