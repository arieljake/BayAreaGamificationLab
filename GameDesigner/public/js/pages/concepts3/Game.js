

define([
	"/js/pages/concepts3/MainModel.js"
], function(
	MainModel
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
					that.model.setValue("graph",data);

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