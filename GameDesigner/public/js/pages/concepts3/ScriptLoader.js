


define([], function()
{
	var ScriptLoader = {

		loadScripts: function(scripts,allDone)
		{
			async.forEachSeries(scripts,function(script,done)
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