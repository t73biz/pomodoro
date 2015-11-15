module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			files: ['**/*'],
			tasks: ['jshint'],
			options: {
				livereload: true
    		},
		},
		jshint: {
			files: {
				src: '*.js'
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);

};
