chrome.runtime.onInstalled.addListener(function (){
    chrome.contextMenus.create({
        title: "Edit with PhotoStudio photo editor",
        id: "PhotoStudio",
        contexts: ["image"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
    if (info.menuItemId === "PhotoStudio") {
        //var var1 = info.selectionText;
        var imageurl = info.srcUrl;
        PhotoStudioEdit(imageurl);
    }
});

function PhotoStudioEdit(imageurl) 
{   

    if (
       ( imageurl.indexOf("docs.google.com") == -1 )
         && (imageurl.indexOf("redcoolmedia.net") == -1)
    ) 
    {       
  		if ( (imageurl.indexOf("http://") !=-1) || (imageurl.indexOf("https://") !=-1)) {
  			ira = encodeURIComponent("https://www.redcoolmedia.net/photoeditor/canvas/index.html?imageurl="+ imageurl);
  			gourl =  "https://www.redcoolmedia.net/appdirect/user.php?ira=" + ira;
    		window.open(gourl,'_blank');
    	}
    	else {
    		uploadPNG(imageurl);
    	}
    }
}

var authWindow;

function uploadPNG(data)
    {

        var base64ImageContent = data.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
        var blob = base64ToBlob(base64ImageContent, 'image/png');
        var formData = new FormData();
        formData.append('picture', blob);
        
        var filenamex = Math.floor(Math.random() * 2000000) + ".png";
        ira = encodeURIComponent("https://www.redcoolmedia.net/html5-audio-editor/uploadimage.php?filename="+ filenamex);
  		urlsubir =  "https://www.redcoolmedia.net/appdirect/user.php?ira=" + ira + "&ajax=true";
  		nuevaurlasubir = "";
  		
  		jQuery.ajax({
        	url: urlsubir,
        	type: "GET",
        	contentType: false,
        	processData: false,
        	xhrFields: { withCredentials:true },
        	success: function (result) {
            	if (result.isOk == false) 
            	{
            		alert("Error");
            	}
            	else {
            		nuevaurlasubir = result;
            	}
        	},
        	error: function(jqXHR, textStatus, errorThrown)
			{
  				console.log(jqXHR);
  				console.log(textStatus);
  				console.log(errorThrown);
			}
			,
        	async: false
    	});
        
        ira = encodeURIComponent('https://www.redcoolmedia.net/provisioning/preaudiostudio.php');
  		urlabrir =  "https://www.redcoolmedia.net/appdirect/user.php?ira=" + ira;
        authWindow = window.open(urlabrir, '', '');

        jQuery.ajax({
                  url: nuevaurlasubir,
                  type: "POST",
                  cache: false,
                  contentType: false,
                  processData: false,
                  data: formData})
                        .done(function(e){
                                var imageurl = "https://www.redcoolmedia.net/html5-audio-editor/data/" + filenamex;
								var xxx =  "https://www.redcoolmedia.net/photoeditor/canvas/index.html?imageurl="+ imageurl;
								ira = encodeURIComponent(xxx);
  								gourl =  "https://www.redcoolmedia.net/appdirect/user.php?ira=" + ira;
								authWindow.location = gourl;
                        })
                        .fail(function(xhr, err) {
                                alert("Error " + err + " " + xhr.responseText);
                        })
                        .always(function() {
        });


    }
    
    
function base64ToBlob(base64, mime)
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}

