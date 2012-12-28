

define([], function()
{
	var DrawUtils = function()
	{
		var that = {

			drawNodeAt: function(pt,params)
			{
				var fillStyle = params.fillStyle || "#9DDE96";
				var strokeStyle = params.strokeStyle || "#FFFFFF";
				var text = params.text || "";
				var radius = params.radius || 20;
				var textWidth = this.measureText(text).width;

				this.fillStyle = fillStyle;
				this.strokeStyle = strokeStyle;
				this.beginPath();
				this.arc(pt.x, pt.y, radius, 0, 2*Math.PI);
				this.closePath();
				this.fill();
				this.stroke();

				this.fillStyle = "#000000";
				this.strokeStyle = "#FFFFFF";
				this.fillText(text,pt.x - (textWidth/2),pt.y);
			}

		};

		return that;
	}

	return DrawUtils;
});