(function($){

	var
		bandwidthData = {
			'upload': [],
			'download': [],
			'labels': []
		},
		bandwidthDownloadChart = bandwidthUploadChart = null;
	
	$.ready(initialize);

	/**
	 * Helpers
	 */

	function templatize (tpl, data) {
    	var res = /{{([^}}]+)?}}/g, match;

		while (match = res.exec(tpl)) {
			tpl = tpl.replace(match[0], data[match[1]] || '');
		}

		return tpl;
	}

	function humanFileSize (bytes, decimals, showUnit) {
		if (showUnit == undefined) {
			showUnit = true;
		};

		if (decimals == undefined) {
			decimals = 2;
		};

		if ( bytes === 0 || isNaN(bytes) ) {
			return '0' + (showUnit ? 'B' : '');
		};

		var s = ['B', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb'];
		var e = Math.floor(Math.log(bytes) / Math.log(1024));

		return (bytes / Math.pow(1024, e)).toFixed(decimals) + (showUnit ? s[e] : '');
	}

	function timeRemain (time) {
		var remain = Math.ceil(time / 1000000);

		if (time === 0) {
			return 'complete';
		};

		var x = seconds = minutes = jours = days = 0;

		x = time / 1000000;
		seconds = Math.floor(x % 60);
		x /= 60;
		minutes = Math.floor(x % 60);
		x /= 60;
		hours = Math.floor(x % 24);
		x /= 24;
		days = Math.floor(x);

		_days = parseInt(remain / 86400);
		remain = remain % 86400;

		_hours = parseInt(remain / 3600);
		remain = remain % 3600;

		_minutes = parseInt(remain / 60);
		_seconds = parseInt(remain % 60);


		console.log(_days+'-'+_hours+'-'+_minutes+'-'+_seconds);

		if (days) {
			return days + 'd';
		};

		if (hours) {
			return hours + 'h';
		};

		if (minutes) {
			return minutes + 'm';
		};

		return seconds + 's';
	}

	/**
	 * Bootstrap function
	 */

	function initialize () {

		$('#btn-toggle-menu').click(function (e) {
			$('#menu-wrapper').show();

			setTimeout(function () {
				$('#menu-wrapper').addClass('active');
			}, 10);
		});

		$('#menu-wrapper').click(function (e) {
			$('#menu-wrapper').removeClass('active');

			setTimeout(function () {
				$('#menu-wrapper').hide();				
			}, 350);
		});

		$(".primary-menu").click(function (e) {
			e.stopPropagation();
		});

		$(document).delegate('.torrent-ctrl, .torrent-ctrl i', 'click', switchTorrent);
		$(document).delegate('.torrent-delete, .torrent-delete i', 'click', deleteTorrent);

		loadCover( $('#cover').data('cover') );

		for (var i = 50; i > 0; i--) {
			bandwidthData.download.push(0); 
			bandwidthData.upload.push(0); 
			bandwidthData.labels.push('');
		};

		$.get('/api/torrent/all').success(function (response) {
			$('#torrents-loader').remove();
			response.forEach(addTorrentToList);
			getStats();
			getSession();
			updateTorrents();
		});
	}

	/**
	 * Load background cover
	 */

	function loadCover (id) {
		var
			cover  = '/assets/img/covers/' + id + '.jpg',
			covers = parseInt( $('#cover').data('covers') )
			img    = new Image;

		if (!covers) return;

		img.onload = function () {

			$('#cover').css('opacity', 0);

			setTimeout(function () {
				$('#cover').css({
					'backgroundImage': 'url("' + cover + '")',
					'opacity': 1
				});

				if (covers > 1) {
					id++
					
					if ( id > parseInt($('#cover').data('covers')) ) {
						id = 1;
					};

					setTimeout(function () {
						loadCover(id);
					}, 60000);
				};
			}, 500);

		}

		img.src = cover;
	}

	/**
	 * Switch torrent mode (play/pause)
	 */

	function switchTorrent (e) {
		if (this.tagName.toLowerCase() == 'i') {
			$(this).parent().toggleClass('active');
		} else {
			$(this).toggleClass('active');
		}
	};

	/**
	 * Delete torrent
	 */

	function deleteTorrent (e) {
		
	}

	/**	
	 * Get Transmission session
	 */
	
	function getSession () {
		$.get('/api/torrent/session')
			.complete(function () {
				setTimeout(function () {
					getSession();
				}, 10000);
			})
			.success(function (response) {
				$('#free-space').html( humanFileSize(response['download-dir-free-space']) );
			});
	}

	/**
	 * Get torrents activities
	 */
	
	function getActivities () {
		$.get('/api/torrent/activities')
			.complete(function () {
				setTimeout(function () {
					getActivities();
				}, 1000);
			})
			.success(function (response) {
				
				response.forEach(function (torrent) {

					if ($('#torrent-' + torrent.id).hasElements()) {
						updateTorrent(torrent);
					} else {
						addTorrentToList(torrent);
					};

				});

			});
	}


	/**
	 * Get all torrents for updating
	 */
	
	function updateTorrents () {
		$.get('/api/torrent/all')
			.success(function (response) {

				response.forEach(updateTorrent);

				setTimeout(function () {
					updateTorrents();
				}, 1000);

			});
	}

	/**
	 * Update torrent
	 */
	
	function updateTorrent (torrent) {

		var $torrent = $('#torrent-' + torrent.id);


		if (!$torrent.hasElements()) return;

		$torrent.find('.torrent-progress div')
			.css('width', (torrent.percentDone * 100) + '%')
			.attr('class', (torrent.error > 0 ? 'error' : torrent.percentDone === 1 ? 'complete' : ''));

		$torrent.find('.torrent-meta-download span').html( humanFileSize(torrent.downloadedEver) );
		$torrent.find('.torrent-meta-upload span').html( humanFileSize(torrent.uploadedEver) );
		$torrent.find('.torrent-meta-ratio span').html( torrent.uploadRatio.toFixed(2) );
		$torrent.find('.torrent-meta-peers span').html( torrent.peersConnected + '/' + torrent['peer-limit'] );
		$torrent.find('.torrent-meta-time span').html( torrent.error > 0 ? 'unknown' : timeRemain(torrent.leftUntilDone) );

		/*'status': torrent.error > 0 ? 'error' : torrent.percentDone === 1 ? 'complete' : '',
		'active': torrent.status === 6 ? 'active' : '',
		'remain': torrent.error > 0 ? 'unknown' : timeRemain(torrent.leftUntilDone)*/

	}

	/**
	 * Get stats
	 */

	function getStats () {
		$.get('/api/torrent/stats')
			.complete(function () {
				setTimeout(function () {
					getStats();
				}, 2500);
			})
			.success(function (response) {

				var upload, download;

				upload   = response.uploadSpeed;
				download = response.downloadSpeed;

				bandwidthData.upload.shift();
				bandwidthData.download.shift();

				bandwidthData.upload.push( (upload / 1048576).toFixed(1) );
				bandwidthData.download.push( (download / 1048576).toFixed(1) );

				$('#download-speed').html( humanFileSize(download, 1) + '<em>/s</em>' );
				$('#upload-speed').html( humanFileSize(upload, 1) + '<em>/s</em>' );

				if (!bandwidthDownloadChart) {
					var
						dataDownload = {
							'labels': bandwidthData.labels,
							'datasets': [
								{
									'label': 'Download',
									'fillColor': 'rgba(41,128,185,.9)',
									'data': bandwidthData.download
								}
							]
						},
						dataUpload = {
							'labels': bandwidthData.labels,
							'datasets': [
								{
									'label': 'Download',
									'fillColor': 'rgba(41,128,185,.9)',
									'data': bandwidthData.upload
								}
							]
						};

					var options = {
						'bezierCurve': false,
						'pointDot': false,
						'responsive': true,
						'showTooltips': false,
						'animation': false,
						'scaleShowGridLines': false,
						'scaleLineColor': 'rgba(236,240,241,.2)',
						'scaleFontColor': 'rgba(236,240,241,1)',
						'datasetStrokeWidth': 1,
						'scaleLabel': '<%=value%>Mb',
						'datasetStroke': false
					};

					var ctx = $('#bandwidth-download-chart').get(0).getContext('2d');
					bandwidthDownloadChart = new Chart(ctx).Line(dataDownload, options);

					ctx = $('#bandwidth-upload-chart').get(0).getContext('2d');
					bandwidthUploadChart = new Chart(ctx).Line(dataUpload, options);
				
				} else {
					
					var i;

					for (i = 0; i < bandwidthData.download.length; i++) {
						bandwidthDownloadChart.datasets[0].points[i].value = bandwidthData.download[i];
						bandwidthUploadChart.datasets[0].points[i].value = bandwidthData.upload[i];
					};

					bandwidthDownloadChart.update();
					bandwidthUploadChart.update();

				}

			});
	}

	/**
	 * Add new torrent
	 */

	function addTorrentToList (torrent) {
		var tpl = $('#torrent-template').html();

		$('#torrents-downloads').prepend(templatize(tpl, {
			'id': torrent.id,
			'name': torrent.name,
			'progress': torrent.percentDone * 100,
			'status': torrent.error > 0 ? 'error' : torrent.percentDone === 1 ? 'complete' : '',
			'active': torrent.status === 6 ? 'active' : '',
			'info': humanFileSize(torrent.totalSize),
			'downloaded': humanFileSize(torrent.downloadedEver),
			'uploaded': humanFileSize(torrent.uploadedEver),
			'ratio': torrent.uploadRatio.toFixed(2),
			'files': torrent.files.length,
			'peers': torrent.peersConnected + '/' + torrent['peer-limit'],
			'remain': torrent.error > 0 ? 'unknown' : timeRemain(torrent.leftUntilDone)
		}));

		/*var coverSaved = localStorage.getItem(torrent.hashString);

		if (coverSaved) {

			$('#torrent-' + torrent.id)
				.addClass('movie')
				.find('figure')
				.css('backgroundImage', 'url("' + coverSaved + '")');

		} else {
			$.get('/api/tmdb/search/' + torrent.name).success(function (response) {
				if (response.results.length) {

					var coverUrl = 'https://image.tmdb.org/t/p/w185' + response.results[0].poster_path;
					
					$('#torrent-' + torrent.id)
						.addClass('movie')
						.find('figure')
						.css('backgroundImage', 'url("' + coverUrl + '")');

					localStorage.setItem(torrent.hashString, coverUrl);
				};
			});
		}*/

	}

})(Lea);