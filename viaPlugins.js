function buildViaGallary() {
	$(".EXLDetailsContent li[id^='lds20']").parents(".EXLDetailsContent").each(function() {
		//Avoid duplicate work
		if ($(this).find(".VIAGallary").length)
			return;
		
		//Make this details tab larger
		$(this).parents(".EXLDetailsTabContent").css({
			"height": "auto",
			"max-height": "38em"
		});
		
		//Get the VIA XML from the PNX record
		var recordId = $(this).parents(".EXLResult").find(".EXLResultRecordId").attr("id");
		var pnxXML = loadPNX(recordId);
		var viaXML = $.parseXML($(pnxXML).find("addata > mis1").text().replace(/&/g, "&amp;"));
                
		//Create Gallary header
                createHeader($(this), $(pnxXML).find("lds20").text());		

		//Create a gallery area
                $(this).append('<div class="VIAGallary"></div>');
	
		//Append the converted VIA XML to the gallery, and set 'rel' parameter to make them 1 gallary 
		$(this).find(".VIAGallary").append(transformXSL(viaXML, "../uploaded_files/HVD/viaThumbnail.xsl"));
		$(this).find("a.fancybox").attr("rel", recordId);
		
                //Trim the cpations
                $(this).find(".VIAThumbnailTitle").each(function() {
                	var tlength = $(this).text().length;
                        if (tlength > 44) {
                        	$(this).attr("title", $(this).text());
                                var text = $(this).text().substr(0, 44);
                                $(this).text(text.substr(0, text.lastIndexOf(" ")) + "...");
                        }

               });

               //Make it FANCYBOX, with MetaData function call to populate the information
               $(this).find(".VIAGallary a.fancybox").fancybox({
                                openEffect: 'none',
                                closeEffect: 'none',
                                nextEffect: 'none',
                                prevEffect: 'none',
                                width: '1200',
                                height: '660',
                                margin: [20, 60, 20, 60],
                                helpers: {
                                        title: {
                                                type: 'inside'
                                        },
                                        overlay: {
                                                locked: false
                                        }
                                },
                                afterLoad: function(current, previous) {
                                        addMetaData(current, previous);
                                }


                        });

	});
}


//Builds a header based on lds20
function createHeader(element, numberOfImages) {
	var gallaryHeaderHTML = '<span class="VIAGallaryHeader">';

	if (numberOfImages == '0')
		gallaryHeaderHTML += 'Slides and Photographs Available (Not Digitized)';
	else if (numberOfImages == '1')
		gallaryHeaderHTML += 'Click on the image to enlarge and view more information</span>';
	else
		gallaryHeaderHTML += numberOfImages + ' images (Click on an image to enlarge and view more information)</span>';
	element.append(gallaryHeaderHTML);
}

//Get the MetaData based on the Image URL (unique), and puts the title with that value
function addMetaData(current, previous) {
	var metaData = $("a.fancybox[href='" + current.href + "']").parents(".VIAThumbnail").find(".VIAMetaData").html();

	var recordId = $("a.fancybox[href='" + current.href + "']").attr("rel");
	var imageId = current.href.replace(/^(.*[\/])/, "");
	imageId = imageId.substr(0, imageId.indexOf("?"));
	
	if (metaData != null && metaData.length > 0) {
		metaData = metaData.replace("LinkPrintPlaceHolder", "../uploaded_files/HVD/viaPage.html?recordId=" + recordId + "&imageId=" + imageId);
		current.title = metaData;
	}

}

