module.exports = function (grunt) {

    grunt.initConfig({
        shell: {
            ts_services:{
                command: 'tsc -p ./src',
                options: {
                    failOnError: false
                }
            }
        },
        
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('default', ['shell']);
}