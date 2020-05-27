module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true
        },
        src: ['test/**/*.js']
      },
    },

    watch: {
      js: {
        options: {
          spawn: false,
        },
        files: '**/*.js',
        tasks: ['default']
      }
    },

    browserSync: {
      bsFiles: {
        src: [
          'public/css/*.css',
          'public/html/*.html',
          'public/js/*.js',
          'public/*.*'
        ]
      },
      options: {
        server: {
          baseDir: "./"
        }
      }

    }
  });

  // On watch events, if the changed file is a test file then configure mochaTest to only
  // run the tests from that file. Otherwise run all the tests
  var defaultTestSrc = grunt.config('mochaTest.test.src');
  grunt.event.on('watch', function (action, filepath) {
    grunt.config('mochaTest.test.src', defaultTestSrc);
    if (filepath.match('test/')) {
      grunt.config('mochaTest.test.src', filepath);
    }
  });
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['browserSync']);
};