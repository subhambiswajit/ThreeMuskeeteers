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

    var IsSingleChild = false;

    var animationSpeed = 10;

    var ExpansionSpeed = 8;
    var CollapseSpeed = 8;
    var MoveToHistorySpeed = 3;
    var MoveToCenterSpeed = 3;

    var speedFactor = 5;

    //History Panel
    var HistoryTiles = new Array();
    var HistoryPanelLeftMargin = 20;
    var HistoryPanelTopMargin = 20;
    var IsHistoryTileSelected = false;

	window.onload = function() {
		paper.setup('myCanvas');

		// Create two drawing tools.
		// tool1 will draw straight lines,
		// tool2 will draw clouds.

		// Both share the mouseDown event:
		var path;
            path = new Path();
            
            getData("/projectInfo", function(data) {
                data1=JSON.stringify(data);
                var arr=JSON.parse(data1);
                //var spanTitle = $('#spnProjectTitle');
                //spanTitle.text(arr[0].name);
                var rootId = arr[0].rootNodeId;

                getData("ItemInfo/" + rootId, function(data) {
                    data1=JSON.stringify(data);
                    var arr=JSON.parse(data1);
                    var mainTile = addTile(0,0,arr.name);
                    mainTile.data.id = rootId;//'5ad543c6c6e3447aacd12476';
                     //setCenterTileProperties(mainTile);
                    loadChild(mainTile);

                });

                
              });

          

    }

    var childFillColor = '#FF9800';
    var centerFillColor = '#00BCD4';
    var historyFillColor = centerFillColor;//'#9C27B0';
    var textColor = 'black';

    setChildTileColors = function(tile){
        
       var setBaseColors = function(group){
            var text = group.children[0];
            var rect = group.children[1];
            text.fillColor =  textColor;
            text.strokeColor = textColor;
            rect.fillColor = childFillColor;
            rect.strokeColor = '#4a148c';
        }

       var setOnEnter = function(group){
            var text = group.children[0];
            var rect = group.children[1];
            rect.fillColor =   centerFillColor;
            rect.strokeColor = '#4a148c';
            text.fillColor = textColor;
            text.strokeColor = textColor;
        }

        setBaseColors(tile);

        tile.onMouseEnter = function(event) {
           setOnEnter(this);
        }

        tile.onMouseLeave = function(event) {
           setBaseColors(this);
        }
    }

    setCenterTileColors = function(tile)
    {
       var setBaseColors = function(group){
            var text = group.children[0];
            var rect = group.children[1];
            text.fillColor =textColor;
            text.strokeColor = textColor;
            rect.fillColor = centerFillColor;
            rect.strokeColor = '#4a148c';
        }

       var setOnEnter = function(group){
            var text = group.children[0];
            var rect = group.children[1];
            rect.fillColor = 'blue';
            rect.strokeColor = 'black';
            text.fillColor = textColor;
            text.strokeColor = textColor;
        }

        setBaseColors(tile);

        tile.onMouseEnter = function(event) {
         //  setOnEnter(this);
        }
        
        tile.onMouseLeave = function(event) {
         //  setBaseColors(this);
        }

    }

    setHistoryTileColors = function(tile)
    {
        var setBaseColors = function(group){
            var text = group.children[0];
            var rect = group.children[1];
            text.fillColor = 'black';
            text.strokeColor = 'black';
            rect.fillColor = historyFillColor;
            rect.strokeColor = 'black';
        }

        var setOnEnter = function(group){
            var text = group.children[0];
            var rect = group.children[1];
            rect.fillColor = centerFillColor;
            rect.strokeColor = 'black';
            text.fillColor = 'black';
            text.strokeColor = 'black';
        }

        setBaseColors(tile);

        tile.onMouseEnter = function(event) {
           setOnEnter(this);
        }
        
        tile.onMouseLeave = function(event) {
           setBaseColors(this);
        }
    }

    setWireColor = function(wire){
        wire.strokeColor = 'blue';
        wire.strokeWidth = 2;
        wire.blendMode = 'difference';
    }
    
    addTile = function(x,y, title,id) {
            var text = new PointText(new Point(x, y));
            text.fillColor = TextFillColor;
            var titleMinimized = title
            var fontSize = 10;
            if(title.length > 15)
            {
                fontSize = (fontSize - (title.length/15)) //+ 1;
            }
            text.fontFamily = 'verdana';
            text.fontSize = fontSize;
            text.content = titleMinimized;
            //text.blendMode = 'multiply'
           // var rect =  new Path.Rectangle(text.bounds,6);
           var rect =  new Path.Rectangle(text.bounds,6);
           var expand = 5;
           rect.bounds.left -= expand;
           rect.bounds.top -= expand;
           rect.bounds.width += expand * 2;
           rect.bounds.height += expand * 2;

          //  rect.sendToBack();
            //rect.scale(1.2,1.5);
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
            project.activeLayer.addChild(group);
      setChildTileColors(group);
            group.onMouseDown = function(event){
                if(!CollapseChildren && !ExpandChildren && !this.data.isParent)
                {
                    if(IsSingleChild && !this.data.isSelectedHistory){
                        MoveCenterTileToLeft = true;
                    }
                    else{
                        CollapseChildren = true;
                    }
                    this.data.isNewlySelected = true;
                    this.data.isChild = false;
                    this.data.isParent = true;
                    if(this.data.isSelectedHistory)
                        IsHistoryTileSelected = true;
                 //   rearrangeHistoryTiles();
                }
                //Trigger data apis
            }
            group.onFrame = function(event){
                //console.log('test');
                    //Collapse on Selecti;on
                    if(CollapseChildren)
                    {
                        //MoveCenterTileToLeft = true;
                        if(this.data.isChild)
                        {
                            this.data.isCollapsing = true;
                            this.opacity = 0.5;
                        }
                        if(this.data.isCollapsing)
                        {
                            var moveX = this.data.parentTile.bounds.center.x - this.position.x;
                            var moveY = this.data.parentTile.bounds.center.y - this.position.y;
                            this.position.x = this.position.x + moveX / CollapseSpeed;
                            this.position.y = this.position.y + moveY / CollapseSpeed; 
                            //var wire = //addConnectingWire(this.data.parentTile.bounds.center, this.bounds.center);
                            if(this.data.parentWire != null)
                            {
                                this.data.parentWire.removeSegments();
                                this.data.parentWire.add(this.position);
                                this.data.parentWire.lineTo(this.data.parentTile.bounds.center);
                            }
                            this.data.count++;
                        }
                        if(this.data.count > CollapseSpeed * speedFactor)
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
                            this.position.x = this.position.x + moveX / ExpansionSpeed;
                            this.position.y = this.position.y + moveY / ExpansionSpeed; 
                            //var wire = //addConnectingWire(this.data.parentTile.bounds.center, this.bounds.center);
                            if(this.data.parentWire != null)
                            {
                            this.data.parentWire.lineTo(this.bounds.center);
                            this.data.parentWire.sendToBack();
                            }
                            this.data.count++;
                        }
                        if(this.data.count > ExpansionSpeed * speedFactor)
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
                    {
                        removeTile(this);
                    }
                    if(MoveCenterTileToLeft)
                    {
                        if(this.data.isParent && !this.data.isMovingToHistory && !this.data.isNewlySelected )
                        {
                            if(!IsHistoryTileSelected)
                            {
                                rearrangeHistoryTiles();
                            }
                            this.data.isMovingToHistory = true;
                            this.data.historyPanelPosition = getHistoryPanelPosition(this);
                            this.scale(0.666);
                            if(this.data.infoWire != null)
                                this.data.infoWire.remove();
                        }
                        if(this.data.isParent && this.data.isMovingToHistory && !this.data.isNewlySelected )
                        {
                            var moveX = this.data.historyPanelPosition.x - this.position.x;
                            var moveY = this.data.historyPanelPosition.y - this.position.y;
                            this.position.x = this.position.x + moveX / MoveToHistorySpeed;
                            this.position.y = this.position.y + moveY / MoveToHistorySpeed; 

                            if(this.data.parentWire != null)
                            {
                                this.data.parentWire.removeSegments();
                                this.data.parentWire.add(this.data.parentTile.bounds.center);
                                this.data.parentWire.lineTo(this.bounds.center);
                            }

                            this.data.count++;

                            if(this.data.count > MoveToHistorySpeed * speedFactor)
                            {
                                MoveCenterTileToLeft = false;
                                MoveSelectedTileToCenter = true;
                                HistoryTiles.push(this); // adding to history tiles
                                this.data.historyIndex = HistoryTiles.length - 1;
                                this.data.isMovingToHistory = false;
                                this.data.count = 0;
                                setHistoryTileProperties(this);
                                setHistoryTileColors(this)
                            }
                        }
                        if(this.data.isNewlySelected)
                        {
                            if(this.data.parentWire != null)
                            {
                                this.data.parentWire.removeSegments();
                                this.data.parentWire.add(this.data.parentTile.bounds.center);
                                this.data.parentWire.lineTo(this.bounds.center);
                            }
                        }
                    }
                    if(MoveSelectedTileToCenter)
                    {
                        if(this.data.isNewlySelected && !this.data.isMovingToCenter)
                        {
                            this.data.targetPosition = getViewCenter();
                            this.data.isMovingToCenter = true;
                            if(this.data.isSelectedHistory)
                                {
                                    var index = this.data.historyIndex;
                                    for(var i=0;i<HistoryTiles.length;i++)
                                    {
                                        if(i > index)
                                        {
                                            removeTile(HistoryTiles[i]);
                                            HistoryTiles[i] = null;
                                        }
                                    }
                                    HistoryTiles = HistoryTiles.slice(0,index);
                                }
                        }

                        if(this.data.isMovingToCenter)
                        {
                            if(this.data.parentWire != null)
                            {
                                this.data.parentWire.removeSegments();
                                this.data.parentWire.add(this.data.parentTile.bounds.center);
                                this.data.parentWire.lineTo(this.bounds.center);
                            }

                            var moveX = this.data.targetPosition.x - this.position.x;
                            var moveY = this.data.targetPosition.y - this.position.y;
                            this.position.x = this.position.x + moveX / MoveToCenterSpeed;
                            this.position.y = this.position.y + moveY / MoveToCenterSpeed; 
                            this.data.count++;
                            if(this.data.count > MoveToCenterSpeed * speedFactor)
                            {
                                MoveSelectedTileToCenter = false;
                                IsHistoryTileSelected = false;
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
                historyPanelPosition:null, isMovingToCenter:false, historyIndex:null, infoWire:null
            };
    }

    rearrangeHistoryTiles = function() {
        var maxSize = 14;
        
        if(HistoryTiles.length > maxSize)
        {
            removeTile(HistoryTiles[0]);
            HistoryTiles = HistoryTiles.slice(1,HistoryTiles.length);
            for(var i=0;i<HistoryTiles.length;i++)
            {
                var tile = HistoryTiles[i];
                tile.data.historyIndex--;
                tile.position.y = tile.position.y - 40.5; 
                if(i != 0 && tile.data.parentWire != null && tile.data.parentTile != null)
                {
                    tile.data.parentWire.removeSegments();
                    tile.data.parentWire.add(tile.data.parentTile.bounds.center);
                    tile.data.parentWire.lineTo(tile.bounds.center);
                }
            }
        }
    }

    removeTile = function(tile) {
        if(tile.data != null && tile.data.parentWire != null)
        {
            tile.data.parentWire.remove();
        }
        tile.remove();
    }

    setCenterTileProperties = function(tile)
    {
        tile.position = getViewCenter();
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
        //tile.scale(0.75);
        tile.data.isParent = false;
        tile.data.isSelectedHistory = true;
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
        var path = "childItems";
        if(tile.data != null && tile.data.id != null)
        {
            path += "/" + tile.data.id;
            updateTreeViewLink(tile.data.id);
        }
        getData(path, function (data) {
            var tiles = new Array();
            if(data.length == 0)
            {
                if($('#chkCircular').prop('checked') == true)
                {
                getData("ChildItems",function (data2) {
                    var tiles2 = new Array();
                    if(data.length == 0)
                    {
                        getData("ChildItems")
                    }
        
                    for(var i=0;i<data2.length;i++)
                    {
                        tiles2.push(addTile(0,0,data2[i].name, data2[i]._id));
                    }
        
                    connectTiles(tile,tiles2)
        
                });
            }
            }

            if(data.length == 1){
                IsSingleChild = true;
            }
            else
            {
                IsSingleChild = false;
            }

            for(var i=0;i<data.length;i++)
            {
                tiles.push(addTile(0,0,data[i].name, data[i]._id));
            }

            connectTiles(tile,tiles)
           // var infoWire = addConnectingWire(tile.bounds.center, new paper.Point(tile.bounds.center.x + 800, tile.bounds.center.y - 200));
           // tile.data.infoWire = infoWire;

        });

        if(tile.data.id != null)
        {
            getData("ItemInfo/" + tile.data.id, fillInfoPanel);
        }


    }

    populateChild = function(data){}

    getHistoryPanelPosition = function(tile){
        if(HistoryTiles.length == 0)
            return new paper.Point(100, 30);
        return new paper.Point(100 , 30 + ( HistoryTiles.length * 40.5));
    }

    connectTiles = function(centerTile,args) {
        if(args.length > 0 && centerTile != null)
        {
            var group = new Group();
            group.addChild(centerTile);
            setCenterTileProperties(centerTile);
            setCenterTileColors(centerTile);
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
        pos.x = getViewCenter().x+ 30 + temp.x;
        pos.y = pos.y - 50; 
        tile.data.targetPosition = pos;
        //tile.position = pos;
        return pos;
    }

    positionBottomRight = function(minDistX, minDistY, centerPoint, tile, args) {
        var pos = new paper.Point(centerPoint);
        var temp = getRandomPosition(minDistX, minDistY);
        pos.x = getViewCenter().x + 30 + temp.x;
        pos.y = pos.y + 50; 
        tile.data.targetPosition = pos;
        //tile.position = pos;
        return pos;
    }

    positionBottomLeft = function(minDistX, minDistY, centerPoint, tile, args) {
        var pos = new paper.Point(centerPoint);
        var temp = getRandomPosition(minDistX, minDistY);
        var x = temp.x > tile.bounds.width ? temp.x : tile.bounds.width;
        pos.x = getViewCenter().x - x;
        pos.y = pos.y + 50; 
        tile.data.targetPosition = pos;
        //tile.position = pos;
        return pos;
    }

    positionTopLeft = function(minDistX, minDistY, centerPoint, tile, args) {
        var pos = new paper.Point(centerPoint);
        var temp = getRandomPosition(minDistX, minDistY);
        var x = temp.x > tile.bounds.width ? temp.x : tile.bounds.width;
        pos.x = getViewCenter().x - x ;
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
           setWireColor(path);
           path.add(point2);
           path.sendToBack();
           path.strokeWidth = 0.5;
        group.addChild(path);

        return path;  
     }

     getViewCenter = function()
     {
         return new paper.Point(view.center.x + 150, view.center.y);
     }