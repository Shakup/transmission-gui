module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		banner: '/* <%= pkg.info.name %> - version <%= pkg.info.version %> - ' +
			'<%= grunt.template.today("dd-mm-yyyy") %>\n' +
			'<%= pkg.info.description %>\n ' +
			'- <%= pkg.info.author.email %> */\n',
		
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: ['app/public/css/styles.min.css', 'app/public/js/scripts.min.js']
				}
			}
		},

		sass: {
			dist: {
				files: {
					'src/css/styles.css' : 'src/sass/bootstrap.scss'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 version', 'ie 9']
			},
			styles: {
				src: 'src/css/styles.css'
			}
		},

		cssmin: {
			combine: {
				files: {
					'app/public/css/styles.min.css': ['src/css/*.css']
				}
			}
		},

		uglify: {
			options: {
				mangle: true,
				sourceMap: true
			},
			dist: {
				files: {
					'app/public/js/scripts.min.js': ['src/js/*.js']
				}
			}
		},

		watch: {
			scripts: {
				files: ['src/js/*.js'],
				tasks: ['uglify']
			},
			css: {
				files: ['src/sass/**/*.scss'],
				tasks: ['sass', 'autoprefixer', 'cssmin']
			}
		},

		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 2,
				title: 'Imagify',
				success: true,
				duration: 2
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-banner');

	grunt.task.run('notify_hooks');
	
	grunt.registerTask('default', ['sass', 'autoprefixer', 'cssmin', 'uglify']);
	grunt.registerTask('addbanners', ['usebanner']);

}