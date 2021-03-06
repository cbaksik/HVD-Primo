function buildHGLLinks() {
	$(".EXLDetailsContent li:matchField(Includes layers)").each(function() {
		$(this).find("span.EXLDetailsDisplayVal").each(function() {
			var title = $(this).text().substr(0, $(this).text().indexOf("$$"));
			var fgdcId = $(this).text().substr($(this).text().indexOf("$$") + 2);

			var newHtml = '<a href="http://' + window.location.host + '/HVD:HVD_FGDC' + fgdcId + '">' + title + '</a>';
			$(this).html(newHtml);

		});

		//Hiding lists longer than 15
		// CB commenting this out for now. Browser chokes on long lists, e.g. 007417959  which has 1,400 layers
		if ($(this).find("span.EXLDetailsDisplayVal").length > 15) {
			/*var i = 0;
			$(this).find("span.EXLDetailsDisplayVal, br").each(function() {
				if (i > 15*2) {
					$(this).addClass("EXLDetailsDisplayValHidden");
				}
				i++;
			});
			$(this).append('<br><b><a class="EXLDetailsDisplayValShowMore" href="javascript:void(0)" onclick="showLongLayerList($(this))">Show more layers</a></b>');*/		
		}
	});

	//Back to collection level
	$(".EXLDetailsContent li:matchField(Collection)").find("span.EXLDetailsDisplayVal").each(function() {
		var hollisId = $(this).text();
		var url;

		//If we're in the sandbox, link to Sandbox only.
		if (window.location.href.indexOf("harvard-primosb") == -1 && window.location.href.indexOf("stage.pd.dc04") == -1) 
			url = "http://id.lib.harvard.edu/aleph/" + hollisId + "/catalog"
		else
			url = "/HVD:everything:HVD_ALEPH" + hollisId;
		var html = '<a href="' + url + '">See other data layers in this series</a>';

		//Change link
		$(this).html(html);
	});
}

//Show more for the FGDC layers
function showLongLayerList(element) {
        $(element).parents("li:matchField(Includes layers)").find("span.EXLDetailsDisplayVal, br").each(function() {
                $(this).removeClass("EXLDetailsDisplayValHidden");
        });
	$(element).remove();
}


//Map component integration
function osmItegration() {
	$(".EXLDetailsContent li:matchField(lds40)").find("span").each(function() {
		//Avoid duplications
		if ($(this).parents(".EXLDetailsTabContent").find(".EXLDetailsMap").length)
			return;

		//Make this details tab larger
		enlargeDetailsTab($(this));

		//Initialization
		var coordinates = buildCoordinatesArray($(this).text());
		var recordId = $(this).parents(".EXLResult").find(".EXLResultRecordId").attr("id");

		//Calculate center of map Create a map initial coordinates
		var centerLongitude = (coordinates[0] + coordinates[1]) / 2;
		var centerLatitude = (coordinates[2] + coordinates[3]) / 2;

		//Creating a right side wrapper to put both existing links and the new map in
		var rightPanel = '<div class="detailsLinksAndMap"></div>';

		//Building of the HTML to inject to the right panel
		var mapHtml = $('<div class="EXLDetailsMap"><em>Geographic coverage</em>');

		if ($(this).parents(".EXLSummary").find(".EXLViewOnlineTab").length > 0) 
			$(mapHtml).append("Click View Online to access resource");
		else 
			$(mapHtml).append("Consult holding library");
		
		$(mapHtml).append('<div id="hglMap' + recordId + '" style="width: 225px; height: 225px"></div></div>');

		//Inject the HTML to the page, through the right panel.
		$(this).parents(".EXLDetailsTabContent").append(rightPanel);
		$(this).parents(".EXLDetailsTabContent").find(".detailsLinksAndMap").append(mapHtml, $(this).parents(".EXLDetailsTabContent").find(".EXLDetailsLinks"));

		//Creating the map dynamic object
		var map = L.map('hglMap' + recordId).setView([centerLatitude, centerLongitude], 9);
		//20150824 CB changing L.titleLayer ... due to change in Leaflet API, per Dave S code
		/*L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i875mjb7'
		}).addTo(map); */
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { 
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' 
		}).addTo(map);


		//Setting the Box bounderies
		if (coordinates[0] == coordinates[1] && coordinates[2] == coordinates[3])
			mapWKTPoint(map, coordinates, "Center of data set coverage area.");
		else 
			mapWKTBbox(map, coordinates, "Extent of data set.");

		L.control.defaultExtent().addTo(map);

	});


}

//This function is used to center and zoom the map based on WKT POINT(x y)
function mapWKTPoint(map, wkt, popupText) {
	if (popupText === "") {
		popupText = "<b>Center of data set coverage area.</b>";
	}

	var y = wkt[0];
	var x = wkt[2];

	// create a marker symbol on the map    		
	L.marker([x, y]).addTo(map).bindPopup(popupText);

	// pan to the marker symbol
	map.panTo(new L.LatLng(x, y));
}

//This function is used to center and zoom the map based on WKT BBOX(x1 y1, x2 y2)
function mapWKTBbox(map, wkt, popupText) {
	if (popupText === "") {
		popupText = "<b>Extent of data set.</b>";
	}

	// define rectangle geographical bounds
	var bounds = [
		[wkt[2], wkt[0]],
		[wkt[3], wkt[1]]
	];

	// create an orange rectangle
	L.rectangle(bounds, {
		color: "#ff7800",
		weight: 1
	}).addTo(map).bindPopup(popupText);

	// zoom the map to the rectangle bounds
	map.fitBounds(bounds, {
		padding: [10, 10]
	});

}

//Building the coordinates array 
function buildCoordinatesArray(inputString) {

	var coordinates;
	//Populate array with Minutes format converstion
	if (RegExp(/\$\$D([a-zA-Z])/).test(inputString)) {
		console.log("converting minuets to decimal");
		coordinates = getRegexMatches(inputString, /\$\$[DEFG](.{8})/g);
		console.log(coordinates);
		for (var i = 0; i < coordinates.length; i++) {
			var hemisphere = coordinates[i].substr(0, 1);
			var degrees = parseInt(coordinates[i].substr(1, 3));
			var minutes = parseInt(coordinates[i].substr(4, 2));
			var seconds = parseInt(coordinates[i].substr(6, 2));

			var decimalValue;
			if (hemisphere == "N" || hemisphere == "E")
				coordinates[i] = degrees + ((minutes + (seconds / 60)) / 60);
			else
				coordinates[i] = 0 - (degrees + ((minutes + (seconds / 60)) / 60));


		}
	}

	//Populate array with Degrees values
	else if (RegExp(/\$\$D(\d|-)/).test(inputString)) {
		coordinates = getRegexMatches(inputString, /\$\$\w([\d\.-]+)/g);
	}

	//Round the numbers to 6 decimal points
	for (var i = 0; i < coordinates.length; i++) {
		coordinates[i] = (Math.round(coordinates[i] * 1000000) / 1000000);
	}
	return coordinates;

}
