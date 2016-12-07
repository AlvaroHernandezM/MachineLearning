function cleanString(string) {
	return string.toLowerCase().trim().replace(/á/,"a").replace(/é/,"e").replace(/í/,"i").replace(/ó/,"o").replace(/ú/,"u");
}