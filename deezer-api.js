var request = require('request');
var crypto = require('crypto');

module.exports = new Deezer();



function Deezer() {
	this.apiUrl = "http://www.deezer.com/ajax/gw-light.php";
	this.apiQueries = {
		api_version: "1.0",
		api_token: "null",
		input: "3"
	};
	this.httpHeaders = {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
		"Content-Language": "en-US",
		"Cache-Control": "max-age=0",
		"Accept": "*/*",
		"Accept-Charset": "utf-8,ISO-8859-1;q=0.7,*;q=0.3",
		"Accept-Language": "de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4"
	}
	this.albumPicturesHost = "http://e-cdn-images.deezer.com/images/cover/"
	this.albumPictures = {
		big: "/800x800.jpg"
	}
	this.reqStream = null;
}

Deezer.prototype.init = function(callback) {
	var self = this;
	request.get({url: "http://www.deezer.com/", headers: this.httpHeaders, jar: true}, (function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var regex = new RegExp(/checkForm\s*=\s*[\"|'](.*)[\"|']/g);
			var _token = regex.exec(body);
			if(_token instanceof Array && _token[1]) {
				this.apiQueries.api_token = _token[1];
				callback(null);
			} else {
				callback(new Error("Unable to initialize Deezer API"));
			}
		} else {
			callback(new Error("Unable to load deezer.com"));
		}
	}).bind(this));
}

Deezer.prototype.getPlaylist = function(id, callback) {
	request.get({url: "http://api.deezer.com/playlist/" + id, headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(new Error("Wrong playlist id: " + id));
				return;
			}
			callback(null, json);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.getPlaylistSize = function(id, callback) {
	request.get({url: "http://api.deezer.com/playlist/" + id + "/tracks?limit=1", headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error || !json.total) {
				callback(new Error("Wrong playlist id: " + id));
				return;
			}
			callback(null, json.total);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.getPlaylistTracks = function(id, callback) {
	request.get({url: "http://api.deezer.com/playlist/" + id + "/tracks?limit=-1", headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(new Error("Wrong playlist id: " + id));
				return;
			}
			callback(null, json);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.getAlbum = function(id, callback) {
	request.get({url: "http://api.deezer.com/album/" + id, headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(new Error("Wrong album id: " + id));
				return;
			}
			callback(null, json);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.getAlbumSize = function(id, callback) {
	request.get({url: "http://api.deezer.com/album/" + id + "/tracks?limit=1", headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error || !json.total) {
				callback(new Error("Wrong album id: " + id));
				return;
			}
			callback(null, json.total);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.getAlbumTracks = function(id, callback) {
	request.get({url: "http://api.deezer.com/album/" + id + "/tracks?limit=-1", headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(new Error("Wrong album id: " + id));
				return;
			}
			callback(null, json);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.getArtist = function(id, callback) {
	request.get({url: "http://api.deezer.com/artist/" + id, headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(new Error("Wrong artist id: " + id));
				return;
			}
			callback(null, json);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.getArtistAlbums = function(id, callback) {
	request.get({url: "http://api.deezer.com/artist/" + id + "/albums?limit=-1", headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(new Error("Wrong artist id: " + id));
				return;
			}
			if(!json.data) {
				json.data = [];
			}
			callback(null, json);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

/*
**	CHARTS
** 	From user http://api.deezer.com/user/637006841/playlists?limit=-1
*/
Deezer.prototype.getChartsTopCountry = function(callback) {
	request.get({url: "http://api.deezer.com/user/637006841/playlists?limit=-1", headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(new Error(json.error));
				return;
			}
			if(!json.data) {
				json.data = [];
			} else {
				//Remove "Loved Tracks"
				json.data.shift();
			}
			callback(null, json);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.getTrack = function(id, callback) {
	request.post({url: this.apiUrl, headers: this.httpHeaders, qs: this.apiQueries, body: "[{\"method\":\"song.getListData\",\"params\":{\"sng_ids\":[" + id + "]}}]", jar: true}, (function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body)[0].results.data[0];
			if(json["TOKEN"]) {
				callback(new Error("Uploaded Files are currently not supported"));
				return;
			}
			var id = json["SNG_ID"];
			var md5Origin = json["MD5_ORIGIN"];
			var format = 3;
			if(json["FILESIZE_MP3_320"] <= 0) {
				if(json["FILESIZE_MP3_256"] > 0) {
					format = 5;
				} else {
					format = 1;
				}
			}
			var mediaVersion = parseInt(json["MEDIA_VERSION"]);
			json.downloadUrl = this.getDownloadUrl(md5Origin, id, format, mediaVersion);
			callback(null, json);		
		} else {
			callback(new Error("Unable to get Track " + id));
		}
	}).bind(this));
}

Deezer.prototype.search = function(text, type, callback) {
	if(typeof type === "function") { 
		callback = type;
		type = "";
	} else {
		type += "?";
	}

	request.get({url: "http://api.deezer.com/search/" + type + "q=" + text, headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(new Error("Wrong search type/text: " + id));
				return;
			}
			callback(null, json);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.hasTrackAlternative = function(id, callback) {
	request.get({url: "http://api.deezer.com/track/" + id, headers: this.httpHeaders, jar: true}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(new Error("Wrong track id: " + id), false);
				return;
			}
			if(!json.alternative) {
				callback(null, false);
				return;
			}
			callback(null, json.alternative);
		} else {
			callback(new Error("Unable to reach Deezer API"));
		}
	});
}

Deezer.prototype.getDownloadUrl = function(md5Origin, id, format, mediaVersion) {

	var urlPart = md5Origin + "¤" + format + "¤" + id + "¤" + mediaVersion;
	var md5sum = crypto.createHash('md5');
	md5sum.update(new Buffer(urlPart, 'binary'));
	md5val = md5sum.digest('hex');
	urlPart = md5val + "¤" + urlPart + "¤";
	var cipher = crypto.createCipheriv("aes-128-ecb", new Buffer("jo6aey6haid2Teih"), new Buffer(""));
	var buffer = Buffer.concat([cipher.update(urlPart, 'binary'), cipher.final()]);
	return "http://e-cdn-proxy-" + md5Origin.substring(0, 1) + ".deezer.com/mobile/1/" + buffer.toString("hex").toLowerCase();
}

Deezer.prototype.decryptTrack = function(track, callback) {
	var chunkLength = 0;
	var self = this;
	this.reqStream = request.get({url: track.downloadUrl, headers: this.httpHeaders, jar: true, encoding: null}, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var decryptedSource = decryptDownload(new Buffer(body, 'binary'), track);
			callback(null, decryptedSource);
		} else {
			callback(err || new Error(res.statusCode));
		}
	}).on("data", function(data) {
		chunkLength += data.length;
		self.onDownloadProgress(track, chunkLength);
	}).on("abort", function() {
		callback(new Error("aborted"));
	});
}

Deezer.prototype.cancelDecryptTrack = function() {
	if(this.reqStream) {
		this.reqStream.abort();
		this.reqStream = null;
		return true;
	} else {
		false;
	}
}

Deezer.prototype.onDownloadProgress = function(track, progress) {
	return;
}

function decryptDownload(source, track) {
	var interval_chunk = 3;
	var chunk_size = 2048;
	var part_size = 0x1800;
	var blowFishKey = getBlowFishKey(track["SNG_ID"]);
	var readTotal = 0;
	var i = 0;
	var read = 0;
	var position = 0;
	var first = true;

	var destBuffer = new Buffer(source.length + (chunk_size - (source.length - (parseInt(source.length / chunk_size) * chunk_size))))
	destBuffer.fill(0);

	while(position <= source.length) {
		var chunk = new Buffer(chunk_size)
		chunk.fill(0);
		source.copy(chunk, 0, position, position + chunk_size);
		if(i % interval_chunk == 0) {
			var cipher = crypto.createDecipheriv('bf-cbc', blowFishKey, new Buffer([0, 1, 2, 3, 4, 5, 6, 7]));
			cipher.setAutoPadding(false);
			chunk = cipher.update(chunk, 'binary', 'binary') + cipher.final();
		}
		if(first) {
			first = false;
		}
		destBuffer.write(chunk.toString("binary"), position, 'binary');
		position += chunk_size
		i++;
		readTotal += position;
	}
	return destBuffer;
}

function getBlowFishKey(encryptionKey) {
	if(encryptionKey < 1) {
		encryptionKey *= -1;
	}
	var hashcode = crypto.createHash('md5').update(encryptionKey.toString()).digest("hex");
	var hPart = hashcode.substring(0, 16);
	var lPart = hashcode.substring(16, 32);
	var parts = [ "g4el58wc0zvf9na1", hPart, lPart ];
	return new Buffer(xorHex(parts));
}

function xorHex(parts) {
	var data = "";
	for(var i = 0; i < 16; i++) {
		var character = parts[0].charCodeAt(i);
		for(var j = 1; j < parts.length; j++) {
			character ^= parts[j].charCodeAt(i);
		}
		data += String.fromCharCode(character);
	}
	return data;
}