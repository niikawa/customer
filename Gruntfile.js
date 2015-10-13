module.exports = function(grunt) {
    var pkg = grunt.file.readJSON( 'package.json' );
    grunt.initConfig({ 
        pkg: pkg,
        clean: [ 'release' ],
        copy: {
            html: {
                files: [ {
                    expand: true,
                    cwd: 'client',
                    src: [ '**/*' ],
                    dest: 'release'
                } ]
            }
        },
        babel: {
            dist: {
                files: [{
                  "expand": true,
                  "cwd": "release/scripts/controllers",
                  "src": ["*.js", "**/*.js"],
                  "dest": "release/scripts/controllers/",
                  "ext": ".js"
                }]
            }
        },        
        //オートプレフィックス
        autoprefixer: {
            target: {
                expand: true,
                src: 'release/css/**/*.css',
                dest: 'release/'
            }
        },
        ngAnnotate: {
          controllers: {
            src: 'release/scripts/controllers/*.js',
            dest: 'release/scripts/controllers.js'
          },
          directives: {
            expand: true,
            cwd: 'release/scripts',
            src: ['directives/**/*.js'],
            dest: 'release/scripts'
          }
        },
        useminPrepare: {
            html: 'release/index.html',
            options: {
                root: 'release/',
                dest: 'release/'
            }
        },
        usemin: {
            html: 'release/index.html',
            options: {
                //root: 'client/',
                dest: 'release'
            }
        },
        // //ファイル連結
        // concat: {
        //     generated: {
        //         files: [{
        //             src : 'release/client/css/**/*.css',
        //             dest: 'release/style/app.css'
        //         }]}
        // },
        // //CSS圧縮
        // cssmin: {
        //     target: {
        //         expand: true,
        //         src: ['release/style/app.css', '!*.min.css'],
        //         // 出力先はそのまま
        //         dest: './',
        //         // ファイルの拡張子をファイル名.min.cssにする
        //         ext: '.min.css'
        //     }
        // },
        // uglify: {
        //     generated: {
        //         files: [{
        //             expand: true,
        //             // jsフォルダ以下にあるすべてのjs
        //             src: 'release/scripts/**/*.js',
        //             // 出力先フォルダ
        //             dest: 'release'
        //         }]
        //     }
        // },
        //JS圧縮
        // babel: {
        //     dist: {
        //         files: [{
        //           "expand": true,
        //           "cwd": "test",
        //           "src": ["*.js", "**/*.js"],
        //           "dest": "dist/",
        //           "ext": ".js"
        //         }]
        //     }
        //   },        
        // uglify: {
        //     generated: {
        //         files: [{
        //             expand: true,
        //             src: './dist/test.js',
        //             // 出力先フォルダ
        //             dest: './test/test.min.js'
        //         }]
        //     }
        // },
        watch: {
            // ここにwatchタスクの設定を記述します。
       }
    });
 
    // grunt.loadNpmTasks('プラグイン名');でプラグインを読み込みます。
    Object.keys( pkg.devDependencies ).forEach( function( devDependency ) {
        if( devDependency.match( /^grunt\-/ ) ) {
            grunt.loadNpmTasks( devDependency );
        }
    } );
 
    // gruntコマンドのデフォルトタスクにwatchを追加します。
    grunt.registerTask('es5', ['babel','uglify']);
    grunt.registerTask('css', ['autoprefixer','cssmin']);
    grunt.registerTask('build', ['clean','copy','autoprefixer','ngAnnotate','useminPrepare','babel','uglify','concat','cssmin','usemin']);
    
    
};