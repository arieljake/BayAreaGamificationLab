
define([

],function(

){
	var Header = function(model,parent)
	{
		var that = {

			init: function(done)
			{
				parent.append("<div id='header'><span class='title'>Knowledge Graph</span></div>");

				if (done)
					done();
			}
		};

		return that;
	};

	return Header;
})