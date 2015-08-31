module.exports = {

	sanitizeFileName: function (filename) {
		var segments, segment;

		segments = filename.split('/'),
		segment  = segments.shift();
		segments = segment.split('-');
		segment  = segments.shift();
		segments = segment.split('(');
		segment  = segments.shift();
		filename = segment.replace(/\./g, ' ');

		// Remove brackets
		filename = filename.replace(/\[.*?\]/g, '');

		return filename.trim();
	}
	
};