

define([], function()
{
	var Node = function(data)
	{
		return {
			data: data
		};
	}

	var LinkedList = function()
	{
		var that = {

			head: null,
			tail: null,

			prepend: function (data)
			{
				var curr = Node(data);

				if (!that.head)
				{
					that.head = that.tail = curr;
				}
				else
				{
					curr.next = that.head;
					that.head.prev = curr;
					that.head = curr;
				}

				return that;
			},

			append: function (data)
			{
				if (!that.tail)
					return that.prepend(data)

				var curr = Node(data);
				curr.prev = that.tail;
				that.tail.next = curr;
				that.tail = curr;

				return that;
			},

			toArray: function()
			{
				var curr = that.head;
				var res = [];

				while (curr)
				{
					res.push(curr.data);
					curr = curr.next;
				}

				return res;
			},

			print: function ()
			{
				var res = that.toArray();
				res.push("null");
				console.log(res.join(" -> "));

				return that;
			},

			walkFwd: function(cb,done)
			{
				var curr = that.head;

				while (curr)
				{
					cb(curr.data);
					curr = curr.next;
				}

				if (done)
					done();
			},

			walkBwd: function(cb,done)
			{
				var curr = that.tail;

				while (curr)
				{
					cb(curr.data);
					curr = curr.prev;
				}

				if (done)
					done();
			},

			reverse: function ()
			{
				var curr = that.head;
				var prev = null;

				while (curr)
				{
					var next = curr.next;
					curr.next = prev;
					prev = curr;
					curr = next;

					if (next)
					{
						that.head = curr;
					}
				}

				return that;
			},

			empty: function()
			{
				var curr = that.head;

				while (curr)
				{
					var tmp = curr.next;
					curr.next = curr.prev = null;
					curr = tmp;
				}

				that.head = that.tail = null;
			}
		};

		return that;
	};

	return LinkedList;
})