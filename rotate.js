var Rotate = (function(){

      function radians(angle) {
		if (typeof angle == 'number') return angle;
		return {
			rad: function(z) {
				return z;
			},
			deg: function(z) {
				return Math.PI / 180 * z;
			}
		}[String(angle).match(/[a-z]+$/)[0] || 'rad'](parseFloat(angle));
	}

    var HAS_CANVAS = (function(){

        var canvas = document.createElement('canvas');
        return !!(canvas && canvas.getContext);  
    })();

    var HAS_FILTER = (function(){

        return document.createElement('span').style.filter !== undefined;
    })();

    return function(img, angle) {
 
           angle = radians(angle);

           var sin = Math.sin(angle),
               cos = Math.cos(angle);

           if(HAS_CANVAS) return (function(){

                 img.style.visibility = 'hidden';

                 var loader = new Image();

                     loader.onload = function(){

                          var sin = Math.sin(angle),
                              cos = Math.cos(angle);

                          var canvas = document.createElement('canvas');

                          var imgWidth = img.width || loader.width;
                          var imgHeight = img.height || loader.height;

                          //compute the needed space
                          var fullWidth = Math.abs(sin) * imgHeight +  Math.abs(cos) * imgWidth;
                          var fullHeight = Math.abs(cos) * imgHeight +  Math.abs(sin) * imgWidth;


                          //safari 2 requires setAttribute
                          canvas.setAttribute('width',fullWidth);
                          canvas.setAttribute('height',fullHeight);

                          img.parentNode.replaceChild(canvas, img);

                          var g = canvas.getContext('2d');

                              g.translate(fullWidth / 2, fullHeight / 2);

                              g.rotate(angle);

                              g.drawImage(loader,-imgWidth/2, -imgHeight/2, imgWidth, imgHeight);
                     };

                     loader.src = img.src;
           })();

           if(HAS_FILTER) return (function(){

                 img.style.filter = [
                     'progid:DXImageTransform.Microsoft.Matrix(M11="',
                             cos,
                     '", M12="',
                             -sin,
                     '", M21="',
                             sin,
                     '", M22="',
                             cos,
                     '", sizingMethod="auto expand")'
                 ].join('');
                  
           })();
   } 
})();