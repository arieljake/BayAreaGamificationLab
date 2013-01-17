

define([
	"/js/pages/concepts4/ScriptLoader.js"
], function(
	ScriptLoader
){
	var GridModel = function(model,width,height,parent,backgroundImage)
	{
		var camera, scene, renderer, pointLight;
		var geometry, material, mesh, sphereMaterial;
		var VIEW_ANGLE, ASPECT, NEAR, FAR;

		var that = {

			scriptDeps: [
				"/js/external/three/three.min.js"
			],

			init: function(done)
			{
				ScriptLoader.loadScripts(that.scriptDeps,function()
				{
					that.initThree();

					model.ee.on("graphChanged", that.onGraphChange);
					model.ee.on("mouseDownCanvasPointChanged", that.onCanvasPointMouseDown);
					model.ee.on("clickedCanvasPointChanged", that.onCanvasPointClicked);
					model.ee.on("depthChanged", that.refresh);
					model.ee.on("selectedNodeChanged", that.refresh);
					model.ee.on("newNodeChanged", that.refresh);

					done();
				})
			},

			initThree: function()
			{
				VIEW_ANGLE = 45;
				ASPECT = width / height;
				NEAR = 0.1;
				FAR = 10000;

				renderer = new THREE.WebGLRenderer();

				camera = new THREE.PerspectiveCamera(
						VIEW_ANGLE,
						ASPECT,
						NEAR,
						FAR);

				scene = new THREE.Scene();
				scene.add(camera);

				pointLight = new THREE.PointLight(0xFFFFFF);
				pointLight.position.x = 10;
				pointLight.position.y = 50;
				pointLight.position.z = 130;
				scene.add(pointLight);

				camera.position.z = 300;
				renderer.setSize(width, height);

				parent.append(renderer.domElement);

				sphereMaterial = new THREE.MeshLambertMaterial(
						{
							color: 0xCC0000
						});
			},

			onGraphChange: function()
			{
				that.refresh();

//				model.gameNode = sys.getNode("Game");
//				model.setValue("selectedNode",model.gameNode);
//				model.setValue("depth",1);
			},

			refresh: function()
			{
				var radius = 10,
					segments = 16,
					rings = 16;

				var sphere = new THREE.Mesh(
					new THREE.SphereGeometry(
						radius,
						segments,
						rings),
					sphereMaterial);

				scene.add(sphere);

				renderer.render(scene, camera);

				console.log("visible tree refreshed");
			},

			onCanvasMouseDown: function(e)
			{
				model.setValue("mouseDownScreenPoint",screenP);
				model.setValue("mouseDownCanvasPoint",mouseP);
			},

			onCanvasClick: function(e)
			{
				model.setValue("clickedScreenPoint",screenP);
				console.dir(screenP);
				model.setValue("clickedCanvasPoint",mouseP);
				console.dir(mouseP);
			},

			onCanvasPointMouseDown: function()
			{
				model.setValue("mouseDownNode",node);
			},

			onCanvasPointClicked: function()
			{
				model.setValue("clickedNode",node);
			}
		};

		return that;
	};

	return GridModel;
});