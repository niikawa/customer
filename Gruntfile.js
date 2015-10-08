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
        // uglify: {
        //     generated: {
        //         files: [{
        //             expand: true,
        //             src: 'release/scripts/controllers.js',
        //             // 出力先フォルダ
        //             dest: '/'
        //         }]
        //     }
        // },
        useminPrepare: {
            html: 'release/index.html',
            options: {
                root: 'client/',
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
    grunt.registerTask('css', ['autoprefixer','cssmin']);
    grunt.registerTask('build', ['clean','copy','autoprefixer','ngAnnotate','useminPrepare','uglify','concat','cssmin','usemin']);
};