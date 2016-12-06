function encodeURL(url)
{
	// caracteres que no se tendran en cuenta
	var SAFECHARS = "0123456789" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "!~*'()";
	var HEX = "0123456789ABCDEF";

	var encoded = "";
	for (var i = 0; i < url.length; i++ ) {
		var ch = url.charAt(i);
		if (ch == " ") {
			encoded += "+";
		} else if (SAFECHARS.indexOf(ch) != -1) {
			encoded += ch;
		} else {
			var charCode = ch.charCodeAt(0);
			if (charCode > 255) {
				alert( "Unicode Character '" 
					+ ch 
					+ "' cannot be encoded using standard URL encoding.\n" +
					"(URL encoding only supports 8-bit characters.)\n" +
					"A space (+) will be substituted." );
				encoded += "+";
			} else {
				encoded += "%";
				encoded += HEX.charAt((charCode >> 4) & 0xF);
				encoded += HEX.charAt(charCode & 0xF);
			}
		}
	} // for

	return encoded;
};
