// Prevent conflicts between javascript frameworks
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
