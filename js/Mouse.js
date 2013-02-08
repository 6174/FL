(function(win){
	var Utils = win.Utils;

	var Mouse = win.Mouse = {
		stage:null,
		x:0,
		y:0,
		init:function(stage){
			this.stage = stage;
			this.element = this.stage.canvas;
			this.x = 0;
			this.y = 0;
			this.isDown = false;
			var offset = Utils.getElementOffset(this.element);
			this.offsetX = offset.x;
			this.offsetY  =offset.y;
			this.addEvent();
		},
		addEvent:function(){
			var elem = this.element;			
			var names = ["mousedown","mousemove","mouseup"];
			var events = "ontouchstart" in window?["touchstart", "touchmove", "touchend"]:names;
			var that = this;
			names.forEach(function(name, i){
				elem["on" + name] = function(e)
				{
					e.preventDefault();
					
					if(i == 0) that.isDown = true;
					else if(i == 2) that.isDown = false;
					var x = e.changedTouches?e.changedTouches[0].pageX:e.pageX;
					var y = e.changedTouches?e.changedTouches[0].pageY:e.pageY;
					that.x = x - that.offsetX;
					that.y = y - that.offsetY;
					that.stage.dispatchEvent({type:name,x:that.x,y:that.y});
				};
			});
		}
	};

})(FL);