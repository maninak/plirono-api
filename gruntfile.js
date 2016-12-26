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

  grunt.registerTask('purge', ['clean']);
  grunt.registerTask('build', ['clean:dist', 'copy', 'ts']);
  grunt.registerTask('dev'  , ['build', 'concurrent:watch']);
  grunt.registerTask('test' , ['build', 'tslint', 'mochaTest']);

  grunt.option("force", true); // will continue tasks despite errors/warnings

  grunt.initConfig({
    clean: {
      dist: ['dist'],
      node_modules: ['node_modules']
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
            'bin/www',
            'dist',
            'env/.env',
          ],
          delay: 300,
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
          debounceDelay: 300
        },
      }
    }
  });
};