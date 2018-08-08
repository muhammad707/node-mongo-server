var white = 2;
var black = 4;
var i = 0;

 while (white != black) {
 	if ((white - 2) < 0 || (white - 2) == 0) {
 		white = ((white - 2) == 0) ? 5 : (white - 2) + 5;
 	} else {
 		white  = white  - 2;
 	}
 	black = (black + 1) > 5 ? (black + 1) - 5 : black + 1;
 	++i;
 }
 console.log(i);