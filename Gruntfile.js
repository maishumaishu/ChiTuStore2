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
                        src: ['**/*.html', 'js/**/*.js', 'content/**/*.css', 'content/font/*.*'],
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
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.registerTask('default', ['ts', 'copy', 'stylus']);
}