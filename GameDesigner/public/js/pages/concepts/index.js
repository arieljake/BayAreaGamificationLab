$(document).ready(function()
{
	var scriptDeps = [
		'/js/external/jquery/jquery.contextmenu.js',
		'/js/external/arbor/arbor.js',
		'/js/external/arbor/arbor-tween.js',
		'/js/external/arbor/arbor-mixins.js'
	];

	var loadScript = function(path,cb)
	{
		$.getScript(path,function()
		{
			cb();
		})
	}

	async.forEach(scriptDeps,
		function(dep,done)
		{
			loadScript(dep,done);
		},
		function()
		{
			require([
				"/js/external/EventEmitter.js",
				"/js/pages/concepts/SysRenderer.js",
				"/js/pages/concepts/NodeRenderer.js",
				"/js/pages/concepts/EdgeRenderer.js",
				"/js/pages/concepts/ArborGraphAlgos.js"
			], function(EventEmitter,SysRenderer,NodeRenderer,EdgeRenderer,ArborGraphAlgos)
			{
				var dataUrl = "/data/concepts.json";
				var content;
				var canvas;
				var sys;
				var model = {
					ee: new EventEmitter(),
					_setValues: [],

					init: function()
					{

					},

					setValue: function(name,value)
					{
						var oldValue = model[name];

						model[name] = value;
						model[name + "Changed"] = true;
						model._setValues.push(name);
						console.log(name + "Changed");
						model.ee.emit(name + "Changed",{oldValue: oldValue, newValue: value});
					},

					clearChanges: function()
					{
						model._setValues.forEach(function(name)
						{
							model[name + "Changed"] = false;
						});

						model._setValues = [];
					},

					isChanged: function()
					{
						return model._setValues.length > 0;
					}
				};
				var visibleTreeModel = {
					init: function()
					{
						model.ee.on("depthChanged", visibleTreeModel.refresh);
						model.ee.on("selectedNodeChanged", visibleTreeModel.refresh);
						model.ee.on("newNodeChanged", visibleTreeModel.refresh);
					},

					refresh: function()
					{
						var prevVisibleTreeDepth = model.visibleTreeDepth;
						var prevVisibleTreeStart = model.visibleTreeStart;
						var visibleTreeStart = model.selectedNode;
						var depth = model.depth;

						if (prevVisibleTreeStart)
						{
							prevVisibleTreeStart.data._visibleTree = false;

							ArborGraphAlgos.dive(sys,prevVisibleTreeStart,
								function(node,context)
								{
									node.data._visibleTree = false;
								},
								function(edge,context)
								{
									edge.data._visibleTree = false;
								},
								prevVisibleTreeDepth);
						}

						if (visibleTreeStart)
						{
							visibleTreeStart.data._visibleTree = true;
							visibleTreeStart.data.radius = 20;

							ArborGraphAlgos.dive(sys,visibleTreeStart,
								function(node,context)
								{
									node.data._visibleTree = true;
									node.data.radius = 20;
								},
								function(edge,context)
								{
									edge.data._visibleTree = true;
								},
								depth);
						}

						model.visibleTreeStart = visibleTreeStart;
						model.visibleTreeDepth = depth;
						sys.start();
					}
				};
				var breadcrumbsModel = {
					init: function()
					{
						model.ee.on("selectedNodeChanged", breadcrumbsModel.refresh);
						canvas.mousedown(breadcrumbsModel.onCanvasClick);
					},

					refresh: function()
					{
						var gameNode = model.gameNode;
						var endNode = model.selectedNode || gameNode;
						var breadcrumbRoot = sys.getNode("_breadcrumb:Breadcrumbs") || sys.addNode("_breadcrumb:Breadcrumbs",{_breadcrumb: false});

						ArborGraphAlgos.dive(sys,breadcrumbRoot,
							function(node,context)
							{
								sys.pruneNode(node);
							});

						model.breadcrumbPath = ArborGraphAlgos.search(sys,gameNode,endNode);

						var breadcrumbPath = model.breadcrumbPath || [];
						var prevItem = breadcrumbRoot;

						for (var i=0; i < breadcrumbPath.length; i++)
						{
							var pathItem = breadcrumbPath[i];
							var breadcrumbName = "_breadcrumb:" + pathItem.name;
							var breadcrumbData = {_breadcrumb: true, fixed: true, x: -10, radius: 25, prev: prevItem.name, node: pathItem};

							if (pathItem.name == "Game")
								breadcrumbData.y = -10;
							else
								breadcrumbData.y = -10 + (i*1.6);

							var breadcrumb = sys.addNode(breadcrumbName, breadcrumbData);
							sys.addEdge(prevItem,breadcrumbName)
							prevItem.data.next = breadcrumb.name;

							prevItem = breadcrumb;
						}

						sys.start();
					},

					onCanvasClick: function(e)
					{
						var pos = canvas.offset();
						var mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
						var breadcrumbRoot = sys.getNode("_breadcrumb:Breadcrumbs");

						if (breadcrumbRoot)
						{
							ArborGraphAlgos.dive(sys,breadcrumbRoot,
								function(breadcrumb,context)
								{
									if (sys.toScreen(breadcrumb.p).subtract(mouseP).magnitude() < breadcrumb.data.radius)
									{
										console.log("breadcrumb selected");
										console.dir(breadcrumb);

										breadcrumbsModel.onBreadcrumbClicked(breadcrumb);
									}
								});
						}
					},

					onBreadcrumbClicked: function(breadcrumb)
					{
						var selectedNode = breadcrumb.data.node;

						console.dir(selectedNode);

						ArborGraphAlgos.dive2(sys,breadcrumb,function(node,context)
						{
							sys.pruneNode(node);
						})

						model.setValue("selectedNode",selectedNode);
					}
				};
				var visibleTreeNodeClickModel = {
					init: function()
					{
						canvas.mousedown(visibleTreeNodeClickModel.onCanvasClick);
					},

					onCanvasClick: function(e)
					{
						var pos = canvas.offset();
						var mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
						var selectedNode = model.selectedNode;

						console.log("starting search for visible node clicked");

						ArborGraphAlgos.diveBreadthFirst(sys,selectedNode,function(node,context)
						{
							var distance = sys.toScreen(node.p).subtract(mouseP).magnitude();

							console.log(node.name);

							if (node.data._visibleTree == false)
							{
								console.log("end of visible tree reached");
								return true;
							}
							else if (distance <= node.data.radius)
							{
								console.log("match found");

								model.setValue("clickedNode",node);

								return true;
							}
						});
					}
				};
				var nodeContextMenu = {
					init: function()
					{
						model.ee.on("clickedNodeChanged",nodeContextMenu.onNodeClicked);

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
									items["edit"] = {name: "Edit", icon: "edit"};
									items["delete"] = {name: "Delete", icon: "delete"};
								}

								return {items: items};
							},
							callback: function(key, options) {
								switch (key)
								{
									case "new":
										nodeContextMenu.newNode();
										break;

									case "select":
										nodeContextMenu.selectNode();
										break;

									case "delete":
										nodeContextMenu.deleteNode();
										break;

									case "edit":
										nodeContextMenu.editNode();
										break;
								}
							}
						});
					},

					onNodeClicked: function(e)
					{
						$(".context-menu-one").contextMenu(sys.toScreen(model.clickedNode.p));
					},

					newNode: function()
					{
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
						sys.pruneNode(model.clickedNode);

						model.setValue("deletedNode",model.clickedNode);
					},

					editNode: function()
					{
						var nodeName = prompt("Please enter the new node name:", model.clickedNode.name);

						if (nodeName)
						{
							model.clickedNode.name = nodeName;
							model.setValue("editedNode",model.clickedNode);
						}
					}
				};
				var graphSyncModel = {
					init: function()
					{
						model.ee.on("newNodeChanged",graphSyncModel.onGraphChange);
						model.ee.on("deletedNodeChanged",graphSyncModel.onGraphChange);
						model.ee.on("editedNodeChanged",graphSyncModel.onGraphChange);
					},

					onGraphChange: function()
					{
						var graph = graphSyncModel.serializeGameGraph();

						$.ajax({
							url: dataUrl,
							type: "POST",
							data: JSON.stringify(graph),
							contentType: "application/json",
							success: function(data)
							{
								console.log("save result");
								console.dir(data);
							}
						});
					},

					serializeGameGraph: function()
					{
						var nodes = {};
						var edges = {};

						ArborGraphAlgos.dive(sys,model.gameNode,
							function(node)
							{
								nodes[node.name] = node.data;
							},
							function(edge)
							{
								if (!edges[edge.from.name])
									edges[edge.from.name] = {};

								edges[edge.from.name][edge.to.name] = {};
							});

						return {nodes: nodes, edges: edges};
					}
				};

				init();

				function init()
				{
					function print(output)
					{
						return function(done)
						{
							console.log(output);
							done();
						}
					}

					async.series([
						initUI,
						print("ui initialized"),
						initParticleSystem,
						print("particle system initialized"),
						initModel,
						print("model initialized"),
						loadData,
						print("data initialized")
					], function()
					{
						window.sys = sys;
					});
				}

				function initUI(done)
				{
					content = $("<div id='content'></div>").appendTo("body");
					canvas = $("<canvas id='viewport' width='1024' height='768'></canvas>").appendTo(content);
					canvas.mousedown(function(e){ console.log("--- user interaction (" + e.type + ") ---"); });

					var depthInputContainer = $("<div id='depthInputContainer' class='settingsContainer'><span class='label'>Depth</span></div>").appendTo(content);
					depthInputContainer.css("position","absolute");
					depthInputContainer.css("top","20px");
					depthInputContainer.css("left","200px");

					var depthInput = $("<input type='number' id='depthInput' min='1' max='10' value='1' />").appendTo(depthInputContainer);
					depthInput.bind("change", function()
					{
						model.setValue("depth",depthInput.val());
					});

					var dataUrlInputContainer = $("<div id='dataUrlInputContainer' class='settingsContainer'><span class='label'>Data</span></div>").appendTo(content);
					dataUrlInputContainer.css("position","absolute");
					dataUrlInputContainer.css("top","20px");
					dataUrlInputContainer.css("left","20px");

					var dataUrlInput = $("<input type='text' id='dataUrlInput' value='" + dataUrl + "' />").appendTo(dataUrlInputContainer);
					dataUrlInput.bind("keypress", function(e)
					{
						if (e.keyCode == 13)
						{
							dataUrl = dataUrlInput.val();
							loadData();
						}
					});

					done();
				}

				function initParticleSystem(done)
				{
					sys = arbor.ParticleSystem({ // create the system with sensible repulsion/stiffness/friction
						repulsion: 1000,
						stiffness: 1000,
						friction: 1,
						gravity: true
					});
					sys.renderer = SysRenderer(sys,"#viewport",{
						nodeRenderer: NodeRenderer,
						edgeRenderer: EdgeRenderer
					});

					done();
				}

				function loadData(done)
				{
					$.get(dataUrl, function(data)
					{
						sys.graft(data);

						model.gameNode = sys.getNode("Game");
						model.setValue("selectedNode",model.gameNode);
						model.setValue("depth",1);

						if (done)
							done();
					});
				}

				function initModel(done)
				{
					model.init();
					visibleTreeModel.init();
					visibleTreeNodeClickModel.init();
					breadcrumbsModel.init();
					nodeContextMenu.init();
					graphSyncModel.init();

					done();
				}
			})
		});
})