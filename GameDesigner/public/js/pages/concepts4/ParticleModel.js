

define([
	"/js/pages/concepts4/ScriptLoader.js"
], function(
	ScriptLoader
){
	var ParticleModel = function(model,width,height,parent,backgroundImage)
	{
		var camera, scene, renderer, pointLight;
		var particleSystem, geometry, material, mesh, particles, pMaterial;
		var VIEW_ANGLE, ASPECT, NEAR, FAR, particleCount;

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

				pMaterial = new THREE.ParticleBasicMaterial({
					color: 0xFFFFFF,
					size: 20,
					blending: THREE.AdditiveBlending,
					transparent: true
				})
				particles = new THREE.Geometry();
				particleSystem = new THREE.ParticleSystem(particles,pMaterial);
				particleSystem.sortParticles = true;
				scene.add(particleSystem);
			},

			onGraphChange: function()
			{
				var particle;

				model.graph.eachNode(function(node)
				{
					var pX = Math.random() * width,
						pY = Math.random() * height,
						pZ = Math.random() * 100;

					particle = new THREE.Vertex(new THREE.Vector3(pX, pY, pZ));
					particles.vertices.push(particle);
				})

				that.refresh();

//				model.gameNode = sys.getNode("Game");
//				model.setValue("selectedNode",model.gameNode);
//				model.setValue("depth",1);
			},

			refresh: function()
			{
				particleSystem.rotation.y += 0.01;
				renderer.render(scene, camera);
				that.requestAnimFrame(that.refresh);
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
			},

			requestAnimFrame: function(cb)
			{
				var animFn = (
					window.requestAnimationFrame       ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame    ||
					window.oRequestAnimationFrame      ||
					window.msRequestAnimationFrame     ||
					function(/* function */ callback){
						window.setTimeout(callback, 1000 / 60);
					}
				);

				animFn(cb);
			}
		};

		return that;
	};

	return ParticleModel;
});