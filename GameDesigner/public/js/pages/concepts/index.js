$(document).ready(function()
{
	require(["/js/pages/concepts/Renderer.js"], function(Renderer)
	{
		$("body").append("<canvas id='viewport' width='1024' height='768'></canvas>");

		var sys = arbor.ParticleSystem({ // create the system with sensible repulsion/stiffness/friction
			replusion: 5000,
			stiffness: 1000,
			friction: 0.1,
			gravity: false
		});
		sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

		$.get("/js/pages/concepts/concepts.json", function(data)
		{
			sys.graft(data);
		})
	})
})