module.exports = function (grunt) {

    var src_admin_root = '.';
    var dest_admin_root = '../build/admin';

    var ts_options = {
        module: 'amd',
        target: 'es6',
        removeComments: true,
        sourceMap: false,
    };

    grunt.initConfig({
        shell: {
            ts_admin: {
                command: 'tsc -p .',
                options: {
                    failOnError: false
                }
            },
        },
        babel: {
            options: {
                sourceMap: false,
                presets: ["es2015"]
            },
            dist: {
                files: [
                    { expand: true, cwd: dest_admin_root + '/modules', src: ['**/*.js'], dest: dest_admin_root + '/modules.es5' }
                ]
            }
        },
        copy: {
            src_admin: {
                files: [
                    {
                        expand: true, cwd: src_admin_root, dest: dest_admin_root,
                        src: ['js/**/*.js', 'content/**/*.css', 'content/font/*.*', 'images/*.*', 'index.html', 'ui/**/*.*'],
                    },
                    { expand: true, cwd: src_admin_root + '/modules', dest: dest_admin_root + '/pages', src: ['**/*.html'] },
                    //{ expand: true, cwd: src_admin_root, src: ['node_modules/**/*.*'], dest: dest_admin_root }
                ],
            }
        },
        less: {
            user: {
                files: [{
                    expand: true,
                    cwd: `modules`,
                    src: ['**/*.less'],
                    dest: `${dest_admin_root}/content/app`,
                    ext: '.css'
                }]
            },
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('default', ['shell', 'less', 'copy', 'babel']);
}