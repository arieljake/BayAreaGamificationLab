$(document).ready(function()
{
	require([
		"/js/pages/concepts3/Game.js",
		"/js/pages/concepts3/VisibleTreeModel.js",
		"/js/pages/concepts3/ClickedNodeModel.js",
		"/js/pages/concepts3/BreadcrumbsModel.js",
		"/js/pages/concepts3/NodeContextMenu.js",
		"/js/pages/concepts3/DepthInputControl.js",
		"/js/pages/concepts3/GraphAutoSave.js"
	],function(
		Game,
		VisibleTreeModel,
		ClickedNodeModel,
		BreadcrumbsModel,
		NodeContextMenu,
		DepthInputControl,
		GraphAutoSave
	){

		var content;
		var game;

		async.series([
			function(done)
			{
				content = $("<div id='content'></div>").appendTo("body");

				game = Game();
				game.init(done);
			},
			function(done)
			{
				game.visibleTreeModel = VisibleTreeModel(game.model);
				game.visibleTreeModel.init(done);
			},
			function(done)
			{
				game.clickedNodeModel = ClickedNodeModel(game.model);
				game.clickedNodeModel.init(done);
			},
			function(done)
			{
				game.breadcrumbsModel = BreadcrumbsModel(game.model,content);
				game.breadcrumbsModel.init(done);
			},
			function(done)
			{
				game.nodeContextMenu = NodeContextMenu(game.model);
				game.nodeContextMenu.init(done);
			},
			function(done)
			{
				game.depthInputControl = DepthInputControl(game.model,content);
				game.depthInputControl.init(done);
			},
			function(done)
			{
				game.graphAutoSave = GraphAutoSave(game.model);
				game.graphAutoSave.init(done);
			}
		],function()
		{
			game.loadData("/data/concepts.json",function()
			{
				console.log("game initialized");
			});
		});
	});
})