
define([
	"/js/pages/concepts3/ScriptLoader.js"
], function(
	ScriptLoader
){
	var NodeContextMenu = function(model)
	{
		var that = {

			scriptDeps: [
				'/js/external/jquery/jquery.contextmenu.js'
			],

			init: function(done)
			{
				ScriptLoader.loadScripts(that.scriptDeps,function()
				{
					model.ee.on("clickedNodeChanged",that.onNodeClicked);
					model.nodeContextMenu = that.createNodeContextMenu();

					if (done)
						done();
				})
			},

			onNodeClicked: function(e)
			{
				$(".context-menu-one").contextMenu(model.clickedScreenPoint);
			},

			newNode: function()
			{
				var sys = model.sys;
				var nodeName = prompt("Please enter the node name:");

				if (nodeName)
				{
					var newNode = sys.addNode(nodeName);
					sys.addEdge(model.clickedNode,newNode);
					model.setValue("newNode",newNode);
				}
			},

			selectNode: function()
			{
				if (model.selectedNode)
					model.selectedNode.data.selected = false;

				model.clickedNode.data.selected = true;

				model.setValue("selectedNode",model.clickedNode);
			},

			deleteNode: function()
			{
				model.sys.pruneNode(model.clickedNode);
				model.setValue("deletedNode",model.clickedNode);
			},

			createNodeContextMenu: function()
			{
				var contextMenu = $("<div class='context-menu-one box menu-1'></div>").appendTo("body");

				$.contextMenu({
					selector: ".context-menu-one",
					trigger: "left",
					build: function(trigger,e)
					{
						var items = {};

						if (model.clickedNode === model.selectedNode)
						{
							items["new"] = {name: "New Child", icon: "add"};
						}
						else
						{
							items["select"] = {name: "Select", icon: "edit"};
							items["delete"] = {name: "Delete", icon: "delete"};
						}

						return {items: items};
					},
					callback: function(key, options) {
						switch (key)
						{
							case "new":
								that.newNode();
								break;

							case "select":
								that.selectNode();
								break;

							case "delete":
								that.deleteNode();
								break;
						}
					}
				});

				return contextMenu;
			}
		};

		return that;
	};

	return NodeContextMenu;

});