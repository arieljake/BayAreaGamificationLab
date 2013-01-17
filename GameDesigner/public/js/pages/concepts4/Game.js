

define([
	"/js/pages/concepts4/MainModel.js",
	"/js/pages/concepts4/Graph.js"
], function(
	MainModel,
	Graph
){

	var Game = function()
	{
		var that = {

			model: new MainModel(),

			init: function(done)
			{
				that.model = MainModel();
				that.model.init();
				that.model.ee.on("dataUrlChanged",that.onDataUrlChanged);

				if (done)
					done();
			},

			loadData: function(dataUrl, done)
			{
				$.get(dataUrl, function(data)
				{
					that.model.dataUrl = dataUrl;
					that.model.setValue("graph",Graph(data));

					console.dir(that.model.graph);

					if (done)
						done();
				});
			},

			onDataUrlChanged: function()
			{
				that.loadData(that.model.dataUrl,function()
				{
					console.log("game initialized");
				});
			}
		};

		return that;
	}

	return Game;
});