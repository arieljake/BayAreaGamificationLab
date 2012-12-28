
(function($)
{
	arbor.Node.prototype.equals = function(value)
	{
		if (typeof value == "string")
		{
			return this.name == value;
		}
		else
		{
			return this.name == value.name;
		}
	}

	arbor.Node.prototype.__defineGetter__("index", function()
	{
		return this._id;
	});

	arbor.Edge.prototype.__defineGetter__("from", function()
	{
		return this.source;
	});

	arbor.Edge.prototype.__defineGetter__("to", function()
	{
		return this.target;
	});

	arbor.Edge.prototype.__defineGetter__("index", function()
	{
		return Math.abs(this._id);
	});

})(this.jQuery);