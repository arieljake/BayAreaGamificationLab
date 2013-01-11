$(document).ready(function ()
{
	require([
		"/js/pages/concepts3/Game.js",
		"/js/pages/concepts3/Header.js",
		"/js/pages/concepts3/VisibleTreeModel.js",
		"/js/pages/concepts3/ClickedNodeModel.js",
		"/js/pages/concepts3/BreadcrumbsModel.js",
		"/js/pages/concepts3/NodeContextMenu.js",
		"/js/pages/concepts3/DepthInputControl.js",
		"/js/pages/concepts3/DataUrlInputControl.js",
		"/js/pages/concepts3/GraphAutoSave.js"
	], function (Game, Header, VisibleTreeModel, ClickedNodeModel, BreadcrumbsModel, NodeContextMenu, DepthInputControl, DataUrlInputControl, GraphAutoSave)
	{

		var content;
		var settings;
		var game;

		async.series([
			function (done)
			{
				content = $("<div id='content'></div>").appendTo("body");

				settings = $("<div id='settings'></div>").appendTo("body");
				settings.append("<span class='sectionTitle settings'>Settings</span>");

				game = Game();
				game.init(done);
			},
			function (done)
			{
				game.header = Header(game.model, $("body"));
				game.header.init(done);
			},
			function (done)
			{
				game.visibleTreeModel = VisibleTreeModel(game.model, 480, 420, content, "/images/shadow9canvas.png");
				game.visibleTreeModel.init(done);
			},
			function (done)
			{
				game.clickedNodeModel = ClickedNodeModel(game.model);
				game.clickedNodeModel.init(done);
			},
			function (done)
			{
				game.breadcrumbsModel = BreadcrumbsModel(game.model, content);
				game.breadcrumbsModel.init(done);
			},
			function (done)
			{
				game.nodeContextMenu = NodeContextMenu(game.model);
				game.nodeContextMenu.init(done);
			},
			function (done)
			{
				game.depthInputControl = DepthInputControl(game.model, settings);
				game.depthInputControl.init(done);
			},
			function (done)
			{
				game.dataUrlInputControl = DataUrlInputControl(game.model, settings);
				game.dataUrlInputControl.init(done);
			},
			function (done)
			{
				game.graphAutoSave = GraphAutoSave(game.model);
				game.graphAutoSave.init(done);
			}
		], function ()
		{
			game.model.setValue("dataUrl", "/data/concepts.json");
			console.log("game initialized");
		});
	});
})