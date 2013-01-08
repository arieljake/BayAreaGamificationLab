


define([], function()
{
	var ScriptLoader = {

		loadScripts: function(scripts,allDone)
		{
			async.forEach(scripts,function(script,done)
			{
				ScriptLoader.loadScript(script,done);
			},function()
			{
				allDone();
			})
		},

		loadScript: function(path,cb)
		{
			$.getScript(path,function()
			{
				cb();
			})
		}

	};

	return ScriptLoader;
})