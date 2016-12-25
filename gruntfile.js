module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks("grunt-tslint");
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['clean', 'copy', 'ts']);
  grunt.registerTask('dev'  , ['build', 'concurrent:watch']);
  grunt.registerTask('test' , ['build', 'tslint', 'mochaTest']);

  grunt.initConfig({
    clean: {
      dist: ['dist']
    },
    copy: {
      assets: {
        files: [
          {
            expand: true,
            cwd: 'src/assets',
            src: ['**'],
            dest: 'dist/assets'
          }
        ]
      }
    },
    ts: {
      compile: {
        tsconfig: true,
        options: {
          compiler: 'node_modules/typescript/bin/tsc',
          emitGruntEvents: true
        },
        files: [{
          src: ['<%= watch.ts.files %>'],
          dest: 'dist'
        }],
      }
    },
    mochaTest: {
      test: {
        options: {
          quiet: false
        },
        src: ['dist/test/**/*.js']
      }
    },
    tslint: {
        options: {
          configuration: "tslint.json",
          force: false
        },
        files: { src: ["<%= watch.ts.files %>"] }
    },
    concurrent: {
      watch: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    nodemon: {
      dev: {
        script: 'bin/www',
        options: {
          nodeArgs: ['--debug'],
          watch: [
            'dist',
            'gruntfile.js',
            'env/.env',
          ],
          delay: 100,
          ext: 'js'
        }
      }
    },
    watch: {
      ts: {
        files: [
          'src/**/*.ts',
          '!src/.baseDir.ts',
        ],
        tasks: ['ts', 'tslint' , 'mochaTest'],
        options: {
          debounceDelay: 100
        },
      }
    }
  });
};