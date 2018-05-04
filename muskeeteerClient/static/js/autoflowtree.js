
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

var parentChildMap = new Array();
var allNodes = new Array();
var maxLevels = 0;

var AutomationJsonObject = null;

	window.onload = function() {
		//paper.setup('myCanvas');

		// Create two drawing tools.
		// tool1 will draw straight lines,
		// tool2 will draw clouds.

		// Both share the mouseDown event:
	//	var path;
    //        path = new Path();
            
        // getFile("/static/js/testLog.json", function(data){
        //     data1=JSON.stringify(data);
        //     var arr=JSON.parse(data1);
        //     console.log(arr);
        // });

        var data = getSampleData();
//setTimeout(() => {
    populateParentChildMap(data);
    console.log(parentChildMap);

   var rootMap = getRootNode();
   AutomationJsonObject = generateJson(rootMap);
   console.log(AutomationJsonObject);
  // var rootNode = createNode(rootMap, null, 0)
  //  populateChildren(rootMap,rootNode, 0);
  //  positionLevels();
  //}, 3000);
       
         // var mainTile = addTile(100,100,'OnBoard Module');
         // mainTile.data.id = '5ad543c6c6e3447aacd12476';
         //setCenterTileProperties(mainTile);
 
    }

    generateJson = function(root) {
        var children = getChildrenJson(root);
        var jsonObject = { name: root.parent, total: 0, passed: 0, children: children };
        return jsonObject;
    }

    getChildrenJson = function(parent) {
        var children = getChildren(parent.child);
        var childrenObjects = new Array();
        for(var i=0;i<children.length;i++) {
            var child = children[i];
            var childObject = {name: child.child, total: child.total, passed: child.passed, children: null };
            childObject.children = getChildrenJson(child);
            childrenObjects.push(childObject);
        }
        return childrenObjects;
    }

    positionLevels = function() {
        for(var i=1;i<=maxLevels;i++) {
            var children = getLevelChildren(i);
             var incr = view.bounds.width/children.length;
             for(var j=0;j<children.length;j++) {
                var node = children[j];
                node.position.x = incr * (j);
                if(node.data.parentWire != null)
                {
                    node.data.parentWire.removeSegments();
                    node.data.parentWire.add(node.data.parentNode.bounds.center);
                    node.data.parentWire.lineTo(node.bounds.center);
                }
             }
        }
    }

    getLevelChildren = function(level)
    {
        var children = new Array();
        for(var i=0;i<allNodes.length;i++) {
            var levelNode = allNodes[i];
            if(levelNode.level == level)
                children.push(levelNode.node);
        }
        return children;
    }

    populateChildren = function(map, parentNode, level)
    {
        level++;
        maxLevels = level;
        var children = getChildren(map.child);
        for(var i=0;i<children.length;i++){
            var childNode =  createNode(children[i], parentNode, level);
            populateChildren(children[i], childNode, level);
        }
    }

    createNode = function(map, parentNode, level) {
        var x = getViewCenter().x; //+ paper.Point.random().x * 100;  //getViewCenter().x;
        var y = (level * 80) + 30;
        var childNode = addTile(x,y,map.child,map.child);
        if(parentNode != null){
            var wire = addConnectingWire(parentNode.bounds.center,childNode.bounds.center,map.total,map.passed)
            childNode.data = getNodeData(map, false);
            childNode.data.parentWire = wire;
            childNode.data.parentNode = parentNode;
        } else {
            childNode.data = getNodeData(map, true);
        }
        allNodes.push({level:level, node: childNode});
        return childNode;
    }

    getNodeData = function(map, isRoot) {
        return {map: map, isRoot: isRoot, parentNode:null, parentWire: null};
    }

    addConnectingWire = function(point1,point2, total, passed){
        var group = new Group();
        var path = new Path(point1);
           //setWireColor(path);
           var color = 'green';
           if(passed == 0)
           color = 'red';
           else if(passed < total)
           color = 'orange';
           path.strokeColor = color;
           path.strokeWidth = 3;
           path.blendMode = 'difference';
           path.add(point2);
        group.addChild(path);    
        return path;  
    }

    getChildren = function(parentName)
    {
        var children = new Array();
        for(var i=0;i<parentChildMap.length;i++){
            if(parentName == parentChildMap[i].parent && parentChildMap[i].parent != parentChildMap[i].child){
                children.push(parentChildMap[i]);
            }
        }
        return children;
    }

    getRootNode = function(){
        for(var i=0;i<parentChildMap.length;i++){
            var map = parentChildMap[i];
            if(map.parent == map.child)
            {
                return map;
            }
        }
    }

    populateParentChildMap = function(data) {
        for(var i=0;i<data.length;i++)
        {
            updateParentChildMap(data[i]);
        }
    }

    updateParentChildMap = function(logRow){
        for(var i=0;i<parentChildMap.length;i++)
        {
            var map = parentChildMap[i];
            if(map.parent == logRow.parentPage && map.child == logRow.currentPage)
            {
                map.total++;
                if(logRow.result){
                    map.passed++;
                } else {
                    map.failed++;
                }
                return true;
            }
        }
        parentChildMap.push(getNewParentChildMap(logRow));
    }

    getNewParentChildMap = function(logRow){
        var passedCount = 0;
        var failedCount = 0;
        if(logRow.result){
            passedCount = 1;
        }
        else {
            failedCount = 1;
        }
        
        return { parent: logRow.parentPage, child: logRow.currentPage, total: 1, passed: passedCount, failed: failedCount };
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
           // var rect =  new Path.Rectangle(text.bounds,6);
           var rect =  new Path.Rectangle(text.bounds,6);
           var expand = 5;
           rect.bounds.left -= expand;
           rect.bounds.top -= expand;
           rect.bounds.width += expand * 2;
           rect.bounds.height += expand * 2;
            
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
      setChildTileColors(group);
            group.onMouseDown = function(event){
                
                //Trigger data apis
            }
            group.onFrame = function(event){
                 // position frames;
            }
            return group;
          }
    getDataObject = function(id, title, isChild, isParent, isSelectedHistory, isNewlySelected){
        return {id: id, title: title, isChild: isChild, 
                isParent: isParent, isSelectedHistory: isSelectedHistory, isNewlySelected:false, targetPosition: null, 
                parentTile: null, count:0, parentWire: null,isExpanding: false, isCollapsing:false, isMovingToHistory:false,
                historyPanelPosition:null, isMovingToCenter:false, historyIndex:null
            };
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

      getViewCenter = function()
     {
         return new paper.Point(view.center.x + 150, view.center.y);
     }

    //  {"origin":"OnbardingEstoreFlow_E2E","parentPage":"Start","currentPage":"EmailPrepopulated","result":true},
    //  {"origin":"OnbardingEstoreFlow_E2E","parentPage":"EmailPrepopulated","currentPage":"Login","result":true},
    //  {"origin":"SBT_E2E_Japanese","parentPage":"Start","currentPage":"SBTLogin","result":true},
    //  {"origin":"SBT_E2E_Japanese","parentPage":"SBTLogin","currentPage":"CleanDownloadDirectory","result":true},
    //  {"origin":"OnbardingRetailFlow_AddAnotherDevice","parentPage":"Start","currentPage":"Login","result":true},
    //  {"origin":"OnbardingEstoreFlow_E2E","parentPage":"Login","currentPage":"AgreeandDownload","result":false},
    //  {"origin":"OnbardingRetailFlow_AddAnotherDevice","parentPage":"Login","currentPage":"Enterproductkey","result":true},
    //  {"origin":"BundleDownload_Addon","parentPage":"Start","currentPage":"Login","result":true},
    //  {"origin":"SBT_E2E_Japanese","parentPage":"CleanDownloadDirectory","currentPage":"SBTEnterKeyandDownload","result":false},
    //  {"origin":"OnbardingRetailFlow_AddAnotherDevice","parentPage":"Enterproductkey","currentPage":"PrimeflowEnrollment","result":false},
    //  {"origin":"BundleDownload_Addon","parentPage":"Login","currentPage":"BundledDownload","result":true},
    //  {"origin":"BundleDownload_Addon","parentPage":"BundledDownload","currentPage":"BundledDownload","result":true},
    //  {"origin":"BundleDownload_Addon","parentPage":"BundledDownload","currentPage":"BundledDownload","result":true},
    //  {"origin":"BundleDownload_Addon","parentPage":"BundledDownload","currentPage":"BundledDownload","result":true},
    //  {"origin":"DeviceDetails_Protected_Mobile","parentPage":"Start","currentPage":"Login","result":true},
    //  {"origin":"DeviceDetails_Protected_Mobile","parentPage":"Login","currentPage":"GetStarted","result":true},
    //  {"origin":"DeviceDetails_Protected_Mobile","parentPage":"GetStarted","currentPage":"DeviceStatus","result":true},
    //  {"origin":"DeviceDetails_Protected_Mobile","parentPage":"DeviceStatus","currentPage":"DeviceDetails","result":true},


     getSampleData = function(){
         return [{"origin":"Estore Flow","parentPage":"Login","currentPage":"Login","result":true},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Agree \u0026 Download","result":true},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Accounts - Subscriptions","result":true},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Accounts - Billing","result":false},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Device List","result":true},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Device Details","result":true},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Agree \u0026 Download","result":false},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Accounts - Subscriptions","result":true},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Accounts - Billing","result":false},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Device List","result":true},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Device Details","result":true},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Agree \u0026 Download","result":true},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Accounts - Subscriptions","result":false},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Accounts - Billing","result":false},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Device List","result":false},
         {"origin":"Estore Flow","parentPage":"Login","currentPage":"Device Details","result":true},
         {"origin":"Estore Flow","parentPage":"Agree \u0026 Download","currentPage":"Browser Instructions","result":true},
         {"origin":"Estore Flow","parentPage":"Agree \u0026 Download","currentPage":"Browser Instructions","result":false},
         {"origin":"Estore Flow","parentPage":"Agree \u0026 Download","currentPage":"Browser Instructions","result":true},
         {"origin":"Estore Flow","parentPage":"Agree \u0026 Download","currentPage":"Browser Instructions","result":true},
         {"origin":"Estore Flow","parentPage":"Agree \u0026 Download","currentPage":"Send Invite","result":true},
         {"origin":"Estore Flow","parentPage":"Agree \u0026 Download","currentPage":"Send Invite","result":true},
         {"origin":"Estore Flow","parentPage":"Agree \u0026 Download","currentPage":"Send Invite","result":true},
         {"origin":"Estore Flow","parentPage":"Agree \u0026 Download","currentPage":"Send Invite","result":true},

         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"Send Invite","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"Send Invite","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"Send Invite","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"Send Invite","result":true},

         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"Auto Renewal","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"Auto Renewal","result":false},
         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"Auto Renewal","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"Auto Renewal","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"PGA Confirmation","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"PGA Confirmation","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Subscriptions","currentPage":"PGA Confirmation","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Billing","currentPage":"New Billing","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Billing","currentPage":"New Billing","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Billing","currentPage":"New Billing","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Billing","currentPage":"New Billing","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Billing","currentPage":"Existing Billing","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Billing","currentPage":"Existing Billing","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Billing","currentPage":"Existing Billing","result":true},
         {"origin":"Estore Flow","parentPage":"Accounts - Billing","currentPage":"Existing Billing","result":true},
         {"origin":"Estore Flow","parentPage":"Device List","currentPage":"Device Details","result":true},
         {"origin":"Estore Flow","parentPage":"Device List","currentPage":"Device Details","result":true},
         {"origin":"Estore Flow","parentPage":"Device List","currentPage":"Device Details","result":true},
         {"origin":"Estore Flow","parentPage":"Device List","currentPage":"Device Details","result":true},
         {"origin":"Estore Flow","parentPage":"Device List","currentPage":"Rename Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device List","currentPage":"Rename Device","result":false},
         {"origin":"Estore Flow","parentPage":"Device List","currentPage":"Rename Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device List","currentPage":"Rename Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device Details","currentPage":"Rename Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device Details","currentPage":"Rename Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device Details","currentPage":"Rename Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device Details","currentPage":"Rename Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device Details","currentPage":"Delete Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device Details","currentPage":"Delete Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device Details","currentPage":"Delete Device","result":true},
         {"origin":"Estore Flow","parentPage":"Device Details","currentPage":"Delete Device","result":false},
     ];
     }