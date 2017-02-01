module.exports = function (grunt) {

    var src_user_root = 'src';
    var dest_user_root = 'www';

    var ts_options = {
        module: 'amd',
        target: 'es6',
        removeComments: true,
        sourceMap: false,
    };

    grunt.initConfig({
        shell: {
            ts_user: {
                command: 'tsc -p src',
                options: {
                    failOnError: false
                }
            },
        },
        concat: {
            controls: {
                files: [
                    {
                        expand: true, cwd: `${dest_user_root}/modules`, src: ['controls/*.js'],
                        dest: `${dest_user_root}/modules/controls.js`
                    }
                ]
            }
        },
        babel: {
            es5: {
                options: {
                    sourceMap: false,
                    presets: ["es2015"],
                },
                files: [
                    { expand: true, cwd: `${dest_user_root}/modules`, src: ['**/*.js', '**/*.jsx'], dest: dest_user_root + '/modules.es5', ext: '.js' },
                ]
            }
        },
        copy: {
            // src_user: {
            //     files: [
            //         {
            //             expand: true, cwd: src_user_root, dest: dest_user_root,
            //             src: ['js/**/*.js', 'content/**/*.css', 'content/font/*.*', 'images/**/*.*', 'ui/**/*.*', 'index.html'],
            //         },
            //         { expand: true, cwd: src_user_root + '/modules', dest: dest_user_root + '/pages', src: ['**/*.html'] },
            //         { expand: true, cwd: 'build', dest: dest_user_root, src: ['**/*.js'] }
            //     ],
            // },
            ios: {
                files: [{ expand: true, cwd: '.', src: 'www/**/*.*', dest: 'platforms/ios' }]
            },
            android: {
                files: [{ expand: true, cwd: '.', src: 'www/**/*.*', dest: 'platforms/android/assets' }]
            }
        },
        less: {
            user: {
                files: [{
                    expand: true,
                    cwd: src_user_root + `/modules`,
                    src: ['**/*.less'],
                    dest: `${dest_user_root}/content/app`,
                    ext: '.css'
                },
                { expand: false, src: `${src_user_root}/content/bootstrap-3.3.5/bootstrap.less`, dest: `${dest_user_root}/content/css/bootstrap.css` }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['shell', 'less', 'concat', 'copy']);
}