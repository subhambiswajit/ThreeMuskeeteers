 paper.install(window);
    

    var RectFillColor = 'yellow';
    var RectStrokeColor = 'blue';
    var TextFillColor = 'black';

    var RectFillColorOnFocus = 'blue';
    var RectStrokeColorOnFocus = 'yellow';
    var TextFillColorOnFocus = 'black';

    var CenterTileFillColor = 'orange';
    var CenterTileStrokeColor = 'blue';

    var WireStrokeColor = 'green';

    //Animation States
    var CollapseChildren = false;
    var ExpandChildren = false;
    var MoveCenterTileToLeft = false;
    var MoveSelectedTileToCenter = false;

    //History Panel
    var HistoryTiles = new Array();
    var HistoryPanelLeftMargin = 20;
    var HistoryPanelTopMargin = 20;

	window.onload = function() {
		paper.setup('myCanvas');

		// Create two drawing tools.
		// tool1 will draw straight lines,
		// tool2 will draw clouds.

		// Both share the mouseDown event:
		var path;
			path = new Path();

            // Use the arcTo command to draw cloudy lines
            //var rect = new Path.Rectangle(event.point,)
            var circle = new Path.Circle(new paper.Point(80, 50), 35);
            var group = new Group();

            var tile1 = addTile(100,30, 'kanagaraj');
            var tile2 = addTile(140,70, 'subham');
            var tile3 = addTile(40,110, 'iswarya');
            var tile5 = addTile(100,30, 'kanagaraj');
            var tile6 = addTile(140,70, 'subham');
            var tile7 = addTile(40,110, 'iswarya');
            
            var tile15 = addTile(100,30, 'kanagaraj');
            var tile16 = addTile(140,70, 'subham');
            var tile17 = addTile(40,110, 'iswarya');
            
            var tile25 = addTile(100,30, 'kanagaraj');
            var tile26 = addTile(140,70, 'subham');
            var tile27 = addTile(40,110, 'iswarya');
            
            var tile4 = addTile(180,150, 'three musketeers');

            var groupedTiles = connectTiles(tile4,[tile1,tile2, tile3,tile5,tile6,tile7,tile15,tile16,tile17,tile25,tile26,tile27]);
            //groupedTiles.smooth();
            console.log(tile1);
           // group.scale(1.5);
           path.onFrame = function(event) {
           // Every frame, rotate the path by 3 degrees:
            //text.rotate(3);
            //circle.moveBy(10,10);
           }

        
			//path.arcTo(event.point);
    }
    
    addTile = function(x,y, title,id) {
            var text = new PointText(new Point(x, y));
            text.fillColor = TextFillColor;
            text.content = title;
            var rect =  new Path.Rectangle(text.bounds,6);
            rect.scale(1.2,1.5);
            rect.strokeColor = RectStrokeColor;
            rect.strokeWidth = 2;
            rect.fillColor = RectFillColor;
            rect.blendMode = 'multiply';
            var group = new Group();
            group.addChild(text);
            group.addChild(rect);
            group.scale(1.5);
            group.position = new paper.Point(x,y);
            group.data = getDataObject(id, title, true, false, false,false);
            group.onMouseEnter = function(event) {
                rect.fillColor = RectFillColorOnFocus;
                text.fillColor = TextFillColorOnFocus;
                event.stopPropagation();
                return false;
            }
            group.onMouseLeave = function(event) {
                rect.fillColor = RectFillColor;
                rect.strokeColor = RectStrokeColor;
                text.fillColor = TextFillColor;
                event.stopPropagation();
                return false;
            }
            group.onMouseDown = function(event){
                if(!CollapseChildren && !ExpandChildren && !this.data.isParent)
                {
                    CollapseChildren = true;
                    this.data.isNewlySelected = true;
                    this.data.isChild = false;
                    this.data.isParent = true;
                }
                //Trigger data apis
            }
            group.onFrame = function(event){
                    //Collapse on Selection
                    if(CollapseChildren)
                    {
                        //MoveCenterTileToLeft = true;
                        if(this.data.isChild)
                        {
                            this.data.isCollapsing = true;
                        }
                        if(this.data.isCollapsing)
                        {
                            var moveX = this.data.parentTile.bounds.center.x - this.position.x;
                            var moveY = this.data.parentTile.bounds.center.y - this.position.y;
                            this.position.x = this.position.x + moveX / 10;
                            this.position.y = this.position.y + moveY / 10; 
                            //var wire = //addConnectingWire(this.data.parentTile.bounds.center, this.bounds.center);
                            this.data.parentWire.removeSegments();
                            this.data.parentWire.add(this.position);
                            this.data.parentWire.lineTo(this.data.parentTile.bounds.center);
                            this.data.count++;
                        }
                        if(this.data.count > 50)
                        {
                            CollapseChildren = false;
                            MoveCenterTileToLeft = true;
                            this.data.count = 0;
                        }
                    }
                    
                    //Expand on load
                    if(ExpandChildren)
                    {
                        if(this.data.isChild)
                        {
                            this.data.isExpanding = true;
                        }
                        if(this.data.isExpanding)
                        {
                            var moveX = this.data.targetPosition.x - this.position.x;
                            var moveY = this.data.targetPosition.y - this.position.y;
                            this.position.x = this.position.x + moveX / 10;
                            this.position.y = this.position.y + moveY / 10; 
                            //var wire = //addConnectingWire(this.data.parentTile.bounds.center, this.bounds.center);
                            this.data.parentWire.lineTo(this.bounds.center);
                            this.data.count++;
                        }
                        if(this.data.count > 50)
                        {
                            ExpandChildren = false;
                            this.data.count = 0;
                        }
                    }

                    if(!ExpandChildren && !CollapseChildren && !MoveCenterTileToLeft && !MoveSelectedTileToCenter)
                    {
                        this.data.count = 0;
                    }
                    if(!ExpandChildren)
                        this.data.isExpanding = false;

                    //Removing the collapsed tiles;
                    if(!CollapseChildren && this.data.isChild && this.data.isCollapsing)
                        this.remove();

                    if(MoveCenterTileToLeft)
                    {
                        if(this.data.isParent && !this.data.isMovingToHistory && !this.data.isNewlySelected )
                        {
                            this.data.isMovingToHistory = true;
                            this.data.historyPanelPosition = getHistoryPanelPosition(this);
                            //this.scale(0.75);
                        }
                        if(this.data.isParent && this.data.isMovingToHistory && !this.data.isNewlySelected )
                        {
                            var moveX = this.data.historyPanelPosition.x - this.position.x;
                            var moveY = this.data.historyPanelPosition.y - this.position.y;
                            this.position.x = this.position.x + moveX / 10;
                            this.position.y = this.position.y + moveY / 10; 

                            if(this.data.parentWire != null)
                            {
                                this.data.parentWire.removeSegments();
                                this.data.parentWire.add(this.data.parentTile.bounds.center);
                                this.data.parentWire.lineTo(this.bounds.center);
                            }

                            this.data.count++;

                            if(this.data.count > 50)
                            {
                                console.log(this.position);
                                MoveCenterTileToLeft = false;
                                MoveSelectedTileToCenter = true;
                                HistoryTiles.push(this); // adding to history tiles
                                this.data.isMovingToHistory = false;
                                this.data.count = 0;
                                setHistoryTileProperties(this);
                            }
                        }
                        if(this.data.isNewlySelected)
                        {
                            this.data.parentWire.removeSegments();
                            this.data.parentWire.add(this.data.parentTile.bounds.center);
                            this.data.parentWire.lineTo(this.bounds.center);
                        }
                    }
                    if(MoveSelectedTileToCenter)
                    {
                        if(this.data.isNewlySelected && !this.data.isMovingToCenter)
                        {
                            this.data.targetPosition = view.center;
                            this.data.isMovingToCenter = true;
                        }

                        if(this.data.isMovingToCenter)
                        {
                            this.data.parentWire.removeSegments();
                            this.data.parentWire.add(this.data.parentTile.bounds.center);
                            this.data.parentWire.lineTo(this.bounds.center);

                            var moveX = this.data.targetPosition.x - this.position.x;
                            var moveY = this.data.targetPosition.y - this.position.y;
                            this.position.x = this.position.x + moveX / 10;
                            this.position.y = this.position.y + moveY / 10; 
                            this.data.count++;
                            if(this.data.count > 50)
                            {
                                MoveSelectedTileToCenter = false;
                                //setCenterTileProperties(this);
                               // connectTiles(this,getTestChildren());
                               loadChild(this);
                            }
                        }
                    }
            }
            return group;
          }
    getDataObject = function(id, title, isChild, isParent, isSelectedHistory, isNewlySelected){
        return {id: id, title: title, isChild: isChild, 
                isParent: isParent, isSelectedHistory: isSelectedHistory, isNewlySelected:false, targetPosition: null, 
                parentTile: null, count:0, parentWire: null,isExpanding: false, isCollapsing:false, isMovingToHistory:false,
                historyPanelPosition:null, isMovingToCenter:false
            };
    }

    setCenterTileProperties = function(tile)
    {
        tile.position = view.center;
        tile.scale(1.5);
        tile.fillColor = CenterTileFillColor;
        tile.strokeColor = CenterTileStrokeColor;
        tile.data.isParent = true;
        tile.data.isChild = false;
        tile.data.isSelectedHistory = false;
        tile.data.isNewlySelected = false;
        tile.data.isExpanding = false;
        tile.data.isCollapsing = false;
        tile.data.isMovingToHistory = false;
        tile.data.isMovingToCenter = false;
        tile.data.count = 0;
    }

    setHistoryTileProperties = function(tile)
    {
        tile.scale(0.75);
        tile.data.isParent = false;
        tile.data.isSelectedHistory = false;
        tile.data.isNewlySelected = false;
        tile.data.isCollapsing = false;
        tile.data.isExpanding = false;
        tile.data.isMovingToHistory = false;
        tile.data.isChild = false;
        tile.data.isMovingToCenter = false;
        tile.data.count = 0;
    }

    getTestChildren = function()
    {

        return  [addTile(100,30, 'kanagaraj'),
                 addTile(140,70, 'subham'),
                 addTile(40,110, 'iswarya'),
                 addTile(100,30, 'kanagaraj'),
                 addTile(140,70, 'subham'),
                 addTile(40,110, 'iswarya')];
    }

    loadChild = function(tile) {
        getData("childItems", function (data) {
            var tiles = new Array();
            for(var i=0;i<data.length;i++)
            {
                tiles.push(addTile(0,0,data[i].name));
            }

            connectTiles(tile,tiles)

        });

        getData("ItemInfo/abcd", fillInfoPanel);
        
    }

    getHistoryPanelPosition = function(tile){
        if(HistoryTiles.length == 0)
            return new paper.Point(100, 30);
        return new paper.Point(100 , 30 + ( HistoryTiles.length * tile.bounds.height));
    }

    connectTiles = function(centerTile,args) {
        if(args.length > 0 && centerTile != null)
        {
            var group = new Group();
            group.addChild(centerTile);
            setCenterTileProperties(centerTile);
            var parentCenter = centerTile.bounds.center;
            
            //position all children witin parent
            for(var i=0;i<args.length;i++)
            {
                args[i].position = centerTile.position;
                args[i].data.isChild = true;
                args[i].data.parentTile = centerTile;
            }

            positionChildren(centerTile, args);
        for(var i=0;i<args.length;i++)
        {
           var childCenter = args[i].bounds.center;
           var wire = addConnectingWire(parentCenter, childCenter);
           args[i].data.parentWire = wire;
           group.addChild(wire);
           group.addChild(args[i]);
        }
            ExpandChildren = true;
            return group;
        }
    }

    positionChildren = function(centerTile,args){
        var minDistX = 0;
        var minDistY = 0;
        var centerBound = centerTile.bounds;
        var topCenterPoint = new paper.Point(centerBound.centerX,centerBound.top);
        var bottomCenterPoint = new paper.Point(centerBound.centerX,centerBound.bottom);
        var placedTiles = new Array();
        var lastTopRight = topCenterPoint;
        var lastBottomRight = bottomCenterPoint;
        var lastBottomLeft = bottomCenterPoint;
        var lastTopLeft = topCenterPoint;
        for(var i=0;i<args.length;i++)
        {
            var tile = args[i];
            var side = i % 4;
            switch(side)
            {
                case 0: // top right
                    lastTopRight = positionTopRight(minDistX,minDistY, lastTopRight, args[i], placedTiles);
                    break;
                case 1: // bottom right
                    lastBottomRight = positionBottomRight(minDistX,minDistY, lastBottomRight, args[i], placedTiles);
                    break;
                case 2: // bottom left
                    lastBottomLeft = positionBottomLeft(minDistX,minDistY, lastBottomLeft, args[i], placedTiles);
                    break;
                case 3: // top left
                    lastTopLeft = positionTopLeft(minDistX,minDistY, lastTopLeft, args[i], placedTiles);
                    minDistX = 10;
                    minDistY = 10;
                    break;
            }
            placedTiles.push(tile);
        }
    }

    positionTopRight = function(minDistX, minDistY, centerPoint, tile, args) {
        var pos = new paper.Point(centerPoint);
        var temp = getRandomPosition(minDistX, minDistY);
        pos.x = view.center.x + temp.x;
        pos.y = pos.y - 50; 
        tile.data.targetPosition = pos;
        //tile.position = pos;
        return pos;
    }

    positionBottomRight = function(minDistX, minDistY, centerPoint, tile, args) {
        var pos = new paper.Point(centerPoint);
        var temp = getRandomPosition(minDistX, minDistY);
        pos.x = view.center.x + temp.x;
        pos.y = pos.y + 50; 
        tile.data.targetPosition = pos;
        //tile.position = pos;
        return pos;
    }

    positionBottomLeft = function(minDistX, minDistY, centerPoint, tile, args) {
        var pos = new paper.Point(centerPoint);
        var temp = getRandomPosition(minDistX, minDistY);
        var x = temp.x > tile.bounds.width ? temp.x : tile.bounds.width;
        pos.x = view.center.x - x;
        pos.y = pos.y + 50; 
        tile.data.targetPosition = pos;
        //tile.position = pos;
        return pos;
    }

    positionTopLeft = function(minDistX, minDistY, centerPoint, tile, args) {
        var pos = new paper.Point(centerPoint);
        var temp = getRandomPosition(minDistX, minDistY);
        var x = temp.x > tile.bounds.width ? temp.x : tile.bounds.width;
        pos.x = view.center.x - x ;
        pos.y = pos.y - 50; 
        tile.data.targetPosition = pos;
        //tile.position = pos;
        return pos;
    }

    getRandomPosition = function(minDistX, minDistY) {
        var temp = new paper.Point(minDistX, minDistY)
        var rand = paper.Point.random();
        rand.x = rand.x * 100;
        rand.y = rand.y * 100;
        temp.x = temp.x + rand.x;
        temp.y = temp.y + rand.y;
        return temp;
    }

    addConnectingWire = function(point1,point2){
        var group = new Group();
        var path = new Path(point1);
           path.strokeColor = WireStrokeColor;
           path.strokeWidth = 2;
           path.blendMode = 'difference';
           path.add(point2);
        group.addChild(path);    
        return path;  
     }