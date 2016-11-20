module.exports = function (grunt) {
    var src_root = 'src';
    var dest_root = 'www';

    var ts_options = {
        module: 'amd',
        target: 'es6',
        removeComments: true,
        sourceMap: false,
    };

    grunt.initConfig({
        ts: {
            app: {
                src: [src_root + '/**/*.ts'],
                dest: dest_root,
                options: ts_options
            }
        },
        copy: {
            src: {
                files: [
                    {
                        expand: true, cwd: src_root, dest: dest_root,
                        src: ['**/*.html', 'js/**/*.js', 'content/**/*.css', 'content/font/*.*', 'images/*.*'],
                    },
                ],
            }
        },
        stylus: {
            src: {
                options: {
                    compress: false,
                },
                files: [
                    {
                        expand: true,
                        cwd: src_root,
                        src: ['content/**/*.styl'],
                        dest: dest_root,
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: src_root,
                        src: ['core/chitu.mobile.styl'],
                        dest: dest_root,
                        ext: '.mobile.css'
                    }]
            },
        },
        less: {
            app: {
                files: [{
                    expand: true,
                    cwd: `${src_root}/content/app`,
                    src: ['**/*.less'],
                    dest: `${dest_root}/content/app`,
                    ext: '.css'
                }]
            },
            bootstrap: {
                files: [{
                    src: [`${src_root}/content/bootstrap-3.3.5/bootstrap.less`],
                    dest: `${dest_root}/content/css/bootstrap.css`
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('default', ['ts', 'copy', 'stylus', 'less']);
}