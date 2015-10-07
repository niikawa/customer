module.exports = function(grunt) {
    // initConfigの中に各タスクの設定を行っていきます。
    grunt.initConfig({ 
        // watchタスク: ファイルの変更を監視します。
        autoprefixer: {
            target: {
                expand: true,
                src: 'client/css/**/*.css',
                dest: 'release/'
            }
        },        
        cssmin: {
            target: {
                expand: true,
                // dist/css以下のcss。ただしmin.cssで終わっていないものに限る
                src: ['release/client/css/**/*.css', '!*.min.css'],
                // 出力先はそのまま
                dest: './',
                // ファイルの拡張子をファイル名.min.cssにする
                ext: '.min.css'
            }
        },
        uglify: {
            target: {
                files: [{
                    expand: true,
                    // jsフォルダ以下にあるすべてのjs
                    src: 'client/scripts/**/*.js',
                    // 出力先フォルダ
                    dest: 'release'
                }]
            }
        },
        watch: {
            // ここにwatchタスクの設定を記述します。
       }
    });
 
    // grunt.loadNpmTasks('プラグイン名');でプラグインを読み込みます。
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
 
    // gruntコマンドのデフォルトタスクにwatchを追加します。
    grunt.registerTask('css', ['autoprefixer','cssmin']);
    grunt.registerTask('all', ['autoprefixer','cssmin', 'uglify']);
};