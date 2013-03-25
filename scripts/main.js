/* 
WebMap-Injector for ArcGIS API for Javascript 3.3
Written by Frank Garofalo and Brenda Ibold in January 2013.
webmap-injector by Frank Garofalo and Brenda Ibold
is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License. 
Please attribute the authors if you use it. */

dojo.require("esri.map");
dojo.require("dijit.dijit");
dojo.require("dojo.parser");
dojo.require("esri.arcgis.utils");
dojo.require("esri.tasks.identify");a// Prevent conflicts between javascript frameworks
jQuery.noConflict();

// When browser is ready, load jQuery
jQuery(document).ready( function () {
	// Once jQuery and Dojo are ready. Start code. 
	
	// Initialize DoJo Functions
	dojo.addOnLoad(initDojo);
	
	// Initialize jQuery Functions
	initJQuery_mainfunctions();
	
	function initJQuery_mainfunctions() { 
		console.log("TEST - initJQuery_mainfunctions()");
		//dostuff
		
		jQuery("#btn_load_webmap").click(function(e) {
			console.log("TEST - btn_load_webmap CLICK");
            var elem_this = jQuery(this);
			
			var input_webmapid = jQuery("#input_webmapid").val();
			console.log("TEST - input_webmapid: "+ input_webmapid);
			
			//if (input_webmapid != undefined && input_webmapid != null && input_webmapid.length > 0) {
				if (typeof doWebMapAsLayer == "function") {
					console.log("TEST - call for: doWebMapAsLayer()");
					doWebMapAsLayer(input_webmapid); // within dojo.js
				} else {
					console.log("ERROR - call for: doWebMapAsLayer()");
				}
			//}			
        });
	}
});
dojo.require("esri.layers.agsdynamic");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.symbol");
dojo.require("esri.arcgis.utils");
// Dojo AJAX
dojo.require("dojo._base.xhr");
dojo.require("dojo._base.Deferred");
dojo.require("dojo.io.script");
// Dojo JSON
dojo.require("dojo._base.json");

var mapObj, webMapObj_WebMapLayers;
var ctrWebmapLayers = 0;

function initDojo() {
	
	esri.config.defaults.io.alwaysUseProxy = false;
	
	mapObj = new esri.Map("mapDiv", {
		basemap: "gray",
		displayGraphicsOnPan: false,
		fadeOnZoom: true,
		extent: new esri.geometry.Extent({xmin:-13076273.521312295,ymin:3998459.1681107134,xmax: -13001365.233592922,ymax:4057162.80583365,spatialReference:{wkid:102100}}), //min: -13076273.521312295, ymin: 3998459.1681107134, xmax: -13001365.233592922, ymax: 4057162.80583365
		zoom: 12,
		slider: true
	});
	
	dojo.connect(mapObj, "onLoad", function() {
		console.log("Map onLoad event");	  
	});
}

function detectWebMapLayerTypes(layerObj, layerURL, layerTitle, layerVisibility) {
	console.log("detectWebMapLayerTypes(" + layerObj + ", " + layerURL + ", " + layerTitle + ")");
	var layerType = "";

	// Determine the Layer Type
   
	if ((layerObj instanceof esri.layers.FeatureLayer) == true) {
		// FeatureLayer
		layerType = "esri.layers.FeatureLayer";
	}
	else if ((layerObj instanceof esri.layers.GraphicsLayer) == true) {
		// GraphicsLayer
		layerType = "esri.layers.GraphicsLayer";
	}
	else if ((layerObj instanceof esri.layers.ArcGISDynamicMapServiceLayer) == true) {
		// ArcGISDynamicServiceLayer
		layerType = "esri.layers.ArcGISDynamicMapServiceLayer";
	}
	else if ((layerObj instanceof esri.layers.ArcGISImageServiceLayer) == true) {
		// ArcGISImageServiceLayer
		layerType = "esri.layers.ArcGISImageServiceLayer";
	}
	else if ((layerObj instanceof esri.layers.MapImageLayer) == true) {
		// map image layer
		layerType = "esri.layers.MapImageLayer";
	}
	else if ((layerObj instanceof esri.layers.ArcGISTiledMapServiceLayer) == true) {
		layerType = "esri.layers.ArcGISTiledMapServiceLayer";
	}
	else {
		layerType = "";
		alert("TO DO: add support for webmap layers:" + layer.layerObject);
	}

	// Add the Layer
	if (layerType.length > 1) {
		console.log("return");
		return { "layer": layerObj, "type": layerType, "url": layerURL, "title": layerTitle, "visible":layerVisibility };
	}
}

//function appendLayerFromWebMap(type, url,visibility) {
function appendLayerFromWebMap(layerObj) {

	if (layerObj.type == "esri.layers.FeatureLayer") {
		// FeatureLayer
		//tempLayer = new esri.layers.FeatureLayer(url, { "id": "webmapLayer" + ctrWebmapLayers });
		tempLayer = new esri.layers.FeatureLayer(layerObj.url, { "id": "webmapLayer" + ctrWebmapLayers });
		//    "id": "webmapLayer" + ctrWebmapLayers,
		//    "mode": esri.layers.FeatureLayer.MODE_ONDEMAND,
		//    "outFields": ['*']
		//});
	}
	else if (layerObj.type == "esri.layers.GraphicsLayer") {
		// GraphicsLayer
		//tempLayer = new esri.layers.GraphicsLayer(url, { "id": "webmapLayer" + ctrWebmapLayers });
		tempLayer = new esri.layers.GraphicsLayer(layerObj.url, { "id": "webmapLayer" + ctrWebmapLayers });
	}
	else if (layerObj.type == "esri.layers.ArcGISDynamicMapServiceLayer") {
		// map service
		tempLayer = new esri.layers.ArcGISDynamicMapServiceLayer(layerObj.url, { "id": "webmapLayer" + ctrWebmapLayers });
		tempLayer.spatialReference = mapObj.spatialReference;
		tempLayer.imageFormat = layerObj.layer.imageFormat;
		tempLayer.imageTransparency = layerObj.layer.imageTransparency;
		tempLayer.opacity = layerObj.layer.opacity;
		tempLayer.setVisibleLayers(layerObj.layer.visibleLayers);


	}
	else if (layerObj.type == "esri.layers.ArcGISImageServiceLayer") {
		// image service
		tempLayer = new esri.layers.ArcGISImageServiceLayer(layerObj.url, { "id": "webmapLayer" + ctrWebmapLayers });
	}
	else if (layerObj.type == "esri.layers.MapImageLayer") {
		// map image
		tempLayer = new esri.layers.MapImageLayer(layerObj.url, { "id": "webmapLayer" + ctrWebmapLayers });
	}
	else if (layerObj.type == "esri.layers.ArcGISTiledMapServiceLayer") {
		// RasterLayer
		tempLayer = new esri.layers.ArcGISTiledMapServiceLayer(layerObj.url, { "id": "webmapLayer" + ctrWebmapLayers });
	}
	else {
		// skip
	}
	// Increment ctrWebmapLayers by 1
	ctrWebmapLayers++;

	tempLayer.visible = layerObj.layer.visible;
	// Refresh Layer
	tempLayer.refresh();
	// Add Layer to Map
	mapObj.addLayer(tempLayer);
	// Reorder Layer to Map
	mapObj.reorderLayer(tempLayer, 1);
	// Refresh Layer
	tempLayer.refresh();
	tempLayer.show();

	return tempLayer;

}

function appendWebMapLayers(array_webMapLayers) {
	console.log("TEST - appendWebMapLayers (" + array_webMapLayers + ") / " + array_webMapLayers.length);
	if (array_webMapLayers.length > 0) {
		var tempLayer = null;
		for (var i = 0; i < array_webMapLayers.length; i++) {
			//console.log("TEST - type (" + array_webMapLayers[i].type + ")");
			//console.log("TEST - subLayers (" + array_webMapLayers[i].subLayers + ")");
			//console.log("TEST - visibleLayers (" + array_webMapLayers[i].visibleLayers + ")");
			
			//appendLayerFromWebMap(array_webMapLayers[i].type, array_webMapLayers[i].url, array_webMapLayers[i].visible);
			appendLayerFromWebMap(array_webMapLayers[i]);
		}

	}
}

function getWebMapGroupLayers(layerURL) {
	console.log("TEST - getWebMapGroupLayers(" + layerURL + ")");

	if (layerURL.lastIndexOf("?") <= 0) {
		//Add ?f=json AND callback to URL
		layerURL = layerURL + "?f=json"; //&callback=vp"; //"?f=pjson"; 
	} else {
		//Add callback to URL
		//layerURL = layerURL + "?callback=vp";
	}
	console.log("TEST - layerURL: " + layerURL);

	// Dojo API: http://dojotoolkit.org/documentation/tutorials/1.7/deferreds/
	// Create a deferred and get the user list
	var def = new dojo._base.Deferred();
	
	// Set up the callback and errback for the deferred
	def.then(function (res) {
		//console.log("resolve: " + res);
		console.log("resolve to JSON: " + dojo.toJson(res));
		console.log("resolve Name: " + res.name);
		console.log("resolve Type: " + res.type);
		console.log("resolve URL: " + layerURL);

		var temp_layer = null;

		if (res.type == "Feature Layer") {
			temp_layer = appendLayerFromWebMap("esri.layers.FeatureLayer", layerURL);

			// http://help.arcgis.com/en/webapi/javascript/arcgis/jssamples/#sample/fl_featurecollection
			////loop through the items and add to the feature layer
			//var features = [];
			//dojo.forEach(response.items, function (item) {
			//    var attr = {};
			//    attr["description"] = item.description;
			//    attr["title"] = item.title ? item.title : "Flickr Photo";

			//    var geometry = esri.geometry.geographicToWebMercator(new esri.geometry.Point(item.longitude, item.latitude, map.spatialReference));

			//    var graphic = new esri.Graphic(geometry);
			//    graphic.setAttributes(attr);
			//    features.push(graphic);
			//});

			//temp_layer.applyEdits(features, null, null);
		}

		//detectWebMapLayerTypes(res, layerURL, res.name);
		//appendWebMapLayers(res);

		//arrayUtil.forEach(res, function (user) {
		//    domConstruct.create("li", {
		//        id: user.id,
		//        innerHTML: user.username + ": " + user.name
		//    }, userlist);
		//});
	}, function (err) {
		//alert("Error: " + err);
		//domConstruct.create("li", {
		//    innerHTML: "Error: " + err
		//}, userlist);
	});

	// Dojo API: http://dojotoolkit.org/documentation/tutorials/1.7/ajax/
	dojo.io.script.get({
		// The URL to get JSON from Twitter
		url: layerURL,
		// The callback paramater
		callbackParamName: "callback", // Twitter requires "callback"
		// The content to send
		content: {
			//q: "@dojo" // Searching for tweets about Dojo
		},
		// The success callback
		load: function (jsonData) {
			// Log the result to console for inspection
			//console.log("load: " + jsonData);
			def.resolve(jsonData);
		},
		// Ooops!  Error!
		error: function () {
			// Reject on error
			//console.log("error ");
			//def.reject(errorMessage);
		}
	});
	/*
	// Dojo API: http://dojotoolkit.org/documentation/tutorials/1.7/ajax/
	dojo._base.xhr.get({
		// The URL of the request
		url: layerURL,
		// Handle the result as JSON data
		handleAs: "json",
		// The callback paramater
		//callbackParamName: "callback",
		// The success handler
		load: function (jsonData) {
			console.log("load: " + jsonData);
			def.resolve(jsonData);
			//// Create a local var to append content to
			//var content = "";
			//// For every news item we received...
			//arrayUtil.forEach(jsonData.newsItems, function (newsItem) {
			//    // Build data from the JSON 
			//    content += "<h2>" + newsItem.title + "</h2>";
			//    content += "<p>" + newsItem.summary + "</p>";
			//});
			//// Set the content of the news node
			//containerNode.innerHTML = content;
		},
		// The error handler
		error: function (errorMessage) {
			// Reject on error
			def.reject(errorMessage);
			//alert("Error: " + errorMessage);
		}
	});
	*/
}

// Initialize WebMap
function initWebMapObj(in_layers) {
	console.log("TEST - initWebMapObj(" + in_layers.toString() + ")");
	
	var array_webMapLayers = [];
	var layerObj = null;
	var layerURL = null;
	var group_layers = null;

	// Detect all the Layers from the Web Map
	var layerInfo = dojo.map(in_layers, function (layer, index) {
		//console.log("TEST -layer: " + layer.title);
		//layerObj = layer.layerObject;
		//layerURL = layerObj.url;
		console.log("TEST - layerObject: " + layer);
		console.log("TEST - url (" + layer.layerObject.url + ")");
		console.log("TEST - type (" + layer.layerObject.type + ")");
		console.log("TEST - layers (" + layer.layers + ")");

		group_layers = layer.layers;
		if (group_layers != undefined && group_layers.length > 1) {
			// Group Layers
			console.log("TEST - GROUP LAYERS");
			
			//var group_layerInfo = dojo.map(group_layers, function (layer, index) {
			//    console.log("TEST - grouped layer > url (" + layer.layerObject.url + ")");
			//    console.log("TEST - grouped layer > type (" + layer.layerObject.type + ")");
			//});

			for (var j = 0; j < group_layers.length; j++) {
				//alert("TEST");
				console.log("TEST - grouped layer > layer url: " + layer.layerObject.url + '/' + group_layers[j].id);
				//console.log("TEST - grouped layer > name: " + group_layers[j].name);
				//console.log("TEST - grouped layer > title: " + group_layers[j].title);
				//array_webMapLayers.push(detectWebMapLayerTypes(group_layers[j].layerObject, layerObject.url + '/' + group_layers[j].id, group_layers[j].name));
				getWebMapGroupLayers(layer.layerObject.url + '/' + group_layers[j].id); // local function
			}
		} else {
			// Single Layer
			array_webMapLayers.push(detectWebMapLayerTypes(layer.layerObject, layer.layerObject.url, layer.title,layer.visibility));
		}
		
	});

	appendWebMapLayers(array_webMapLayers);
}

// Add a WebMap as a Layer
function doWebMapAsLayer(in_webMapId) {
	console.log("TEST - doWebMapAsLayer(" + in_webMapId + ")");
	
	var webMapDeferred = esri.arcgis.utils.createMap(in_webMapId, "webMapObj", {
		mapOptions: {
			slider: false,
			nav: false
		},
		geometryServiceURL: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
	});
	webMapDeferred.then(function (response) {

		// Display WebMap Title
		dojo.byId("display_webmap_title").innerHTML = response.itemInfo.item.title;
		// Display WebMap Sub-Title
		dojo.byId("display_webmap_subtitle").innerHTML = response.itemInfo.item.snippet;

		// Response: Map
		webMapObj_WebMapLayers = response.map;

		// Get the WebMap Extent and set the Virtual Port Extent
		var webMapExtent = new esri.geometry.Extent(webMapObj_WebMapLayers.extent);
		mapObj.setExtent(webMapExtent);

		//add the legend
		var layers = response.itemInfo.itemData.operationalLayers;
		//console.log("TEST - operationalLayers (" + dojo.toJson(layers) + ")");
		if (webMapObj_WebMapLayers.loaded) {
			initWebMapObj(layers);
		}
		else {
			dojo.connect(webMapObj_WebMapLayers, "onLoad", function () {
				initWebMapObj(layers);
				//initFunctionality(map);
			});
		}
	}, function (error) {
		console.log("WebMap creation failed: ", dojo.toJson(error));
	});

}
