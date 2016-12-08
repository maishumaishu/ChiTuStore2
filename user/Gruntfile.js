module.exports = function(grunt) {
    // var src_user_root = 'client/user';
    // var dest_user_root = 'build/user';

    var src_admin_root = '.';
    var dest_admin_root = '../build/user';

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
            // src_user: {
            //     files: [
            //         {
            //             expand: true, cwd: src_user_root, dest: dest_user_root,
            //             src: ['*.html', 'ui/**/*.html', 'js/**/*.js', 'content/**/*.css', 'content/font/*.*', 'images/*.*'],
            //         },
            //         { expand: true, cwd: src_user_root + '/modules', dest: dest_user_root + '/pages', src: ['**/*.html'] },
            //     ],
            // },
            // src_services: {
            //     files: [
            //         { expand: true, cwd: 'server', dest: 'build/services', src: ['package.json'] },
            //     ]
            // },
            src_admin: {
                files: [
                    {
                        expand: true, cwd: src_admin_root, dest: dest_admin_root,
                        src: ['js/**/*.js', 'content/**/*.css', 'content/font/*.*', 'images/*.*'],
                    },
                    { expand: true, cwd: src_admin_root + '/modules', dest: dest_admin_root + '/pages', src: ['**/*.html'] },
                ],
            }
        },
        // stylus: {
        //     src_user: {
        //         options: {
        //             compress: false,
        //         },
        //         files: [
        //             { expand: true, cwd: src_user_root, src: ['content/**/*.styl'], dest: dest_user_root, ext: '.css' },
        //             { expand: true, cwd: src_user_root, src: ['core/chitu.mobile.styl'], dest: dest_user_root, ext: '.mobile.css' }]
        //     },
        //     src_admin: {
        //         options: {
        //             compress: false,
        //         },
        //         files: [
        //             { expand: true, cwd: src_admin_root, src: ['content/**/*.styl'], dest: dest_admin_root, ext: '.css' },
        //             { expand: true, cwd: src_admin_root, src: ['core/chitu.mobile.styl'], dest: dest_admin_root, ext: '.mobile.css' }]
        //     },
        // },
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
            // admin: {
            //     files: [{
            //         expand: true,
            //         cwd: `${src_admin_root}/content/app`,
            //         src: ['**/*.less'],
            //         dest: `${dest_admin_root}/content/app`,
            //         ext: '.css'
            //     }]
            // },
            // bootstrap_user: {
            //     files: [{
            //         src: [`${src_user_root}/content/bootstrap-3.3.5/bootstrap.less`],
            //         dest: `${dest_user_root}/content/css/bootstrap.css`
            //     }]
            // },
            // bootstrap_admin: {
            //     files: [{
            //         src: [`${src_admin_root}/content/bootstrap-3.3.5/bootstrap.less`],
            //         dest: `${dest_admin_root}/content/css/bootstrap.css`
            //     }]
            // }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-less');
    //grunt.registerTask('default', ['shell', 'stylus', 'less', 'copy', 'babel']);
    grunt.registerTask('default', ['shell', 'less', 'copy', 'babel']);
}