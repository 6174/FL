(function(win){
	var Utils = win.Utils;
	var Sprite = win.Sprite;

	var MovieClip = win.MovieClip = function(x, y)
	{
		Sprite.call(this, x, y);

		this.time = 0;
		this.isPlay = false;
		this.isLoop = false;
		this.frameNum = 0;
		this.totalFrame = 0;
		this.data = {};
		this.action = "";
		this.frames = [];
		this.setFrameRate(24);
	};
	Utils.extends(MovieClip, Sprite);

	MovieClip.prototype.play = function(name, reset)
	{
		if(name != this.action || reset)
		{
			var data = this.data[name];

			this.action = name;
			this.frames = data.frames;
			this.totalFrame = data.frames.length;
			this.isLoop = data.loop;
			this.delay = data.delay||this.delay;
			this.frameNum = 0;
			this.time = 0;
			this._setFrame();
		}
		if(!this.isPlay)
		{
			this.time = 0;
			this.isPlay = true;
		}
	};

	MovieClip.prototype.stop = function(name)
	{
		if(name)
		{
			this.play(name);
		}
		this.isPlay = false;
	};

	MovieClip.prototype.addAnimation = function(name, frames, loop, frameRate)
	{
		if(typeof(frames) === "string")
		{
			var temp = frames.split("-");
			frames = [];
			for(var i = parseInt(temp[0]), l = parseInt(temp[1]);i <= l;i ++)
			{
				frames.push(i);
			}
		}
		
		var obj = {frames:frames, loop:loop||false};
		frameRate > 0 && (obj.delay = 1000/frameRate);
		this.data[name] = obj;
	};

	MovieClip.prototype.setFrameRate = function(frameRate)
	{
		this.frameRate = frameRate||24;
		this.delay = 1000/this.frameRate;
	};

	MovieClip.prototype._update = function()
	{
		this.time += this.timeStep;
		if(this.time >= this.delay)
		{
			this.time = this.time - this.delay;
			this.frameNum ++;
			if(this.frameNum >= this.totalFrame)
			{
				this.frameNum = 0;
				if(!this.isLoop) this.stop();
			}
			this._setFrame();
		}
	};

	MovieClip.prototype._draw = function(ctx)
	{
		if(this.img)
		{
			ctx.drawImage(this.img, this.sourceX, this.sourceY, this.width, this.height, -this.originX, -this.originY, this.width, this.height);
		}
		if(this.isPlay)
		{
			this._update();
		}
	};

	MovieClip.prototype._setFrame = function()
	{
		var num = this.frames[this.frameNum];
		this.sourceX = (num%this.col) * this.width;
		this.sourceY = (num/this.col>>0) * this.height;
	};
	
	MovieClip.prototype.setImg = function(img, width, height)
	{
		this.img = img;
		this.width = width;
		this.height = height;

		this.col = this.img.width/this.width>>0;
		this.row = this.img.height/this.height>>0;
	};
})(FL);