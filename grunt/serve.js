'use strict';

module.exports = function (grunt) {

    // Launch in parallel a watch server and an ionic run … command.
    // Custom task that will create dynamically a parallel configuration.
    // I'm doing that in order to be able to give command line arguments from npm to that parallel task.
    grunt.registerTask('run', function (platform) {
        if (!platform) {
            grunt.fail.fatal('Syntax: grunt shell:run:<platform> [--livereload|-l]');
            return;
        }
        var livereload = grunt.option('livereload') || grunt.option('l');

        var config = {
            parallel: {
                run: {
                    options: {
                        stream: true
                    },
                    tasks: [{
                        grunt: true,
                        args: ['chokidar']
                    }, {
                        cmd: 'ionic',
                        args: ['run', platform, '-c', '-s', livereload ? '--livereload' : '']
                    }]
                }
            }
        };
        grunt.config.merge(config);

        grunt.task.run('parallel:run');
    });

    // Launch in parallel a watch server and an ioni serve … command.
    // Custom task that will create dynamically a parallel configuration.
    // I'm doing that in order to be able to give command line arguments from npm to that parallel task.
    grunt.registerTask('serve', function () {

        var livereload = grunt.option('livereload') || grunt.option('l');
        var lab = grunt.option('lab');

        // wrapper for `ionic serve` command which launch a local web server serving `www` folder.
        var config = {
            parallel: {
                serve: {
                    options: {
                        stream: true
                    },
                    tasks: [{
                        grunt: true,
                        args: ['chokidar']
                    }, {
                        cmd: 'ionic',
                        args: ['serve', '-a', '-c', '-s', '--nogulp', livereload ? '--livereload' : '', lab ? '--lab' : '']
                    }]
                }
            }
        };
        grunt.config.merge(config);

        grunt.task.run('parallel:serve');
    });

    // All othe serving tasks notably the rest of my parallel configuration.
    return {
        tasks: {

            // With that configuration, I tell chokidar to reuse the same process on change events.
            // This is very important.
            // Indeed, if you launch your first grunt process with some options like `--lab` or `--patterns` and that process
            // starts chokidar, all tasks started by it will then share the same options.
            chokidar: {
                options: {
                    spawn: false
                }
            }

        }

    };
};