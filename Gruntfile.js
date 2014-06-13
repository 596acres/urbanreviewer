module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            standalone: {
                src: ['js/main.js'],
                dest: 'js/bundle.js'
            }
        },

        cssmin: {
            minify: {
                src: 'css/style.css',
                dest: 'css/style.min.css'
            }
        },

        less: {
            development: {
                options: {
                    paths: ["css"],
                    yuicompress: true
                },
                files: {
                    "css/style.css": "css/style.less"
                }
            }
        },

        handlebars: {
            compile: {
                files: {
                    "handlebars_templates/handlebars_templates.js" : "handlebars_templates/*.hbs"
                }
            }
        },

        watch: {
            browserify: {
                files: [
                    "js/cartodbapi.js",
                    "js/filters.js",
                    "js/geocode.js",
                    "js/hash.js",
                    "js/highlights.js",
                    "js/main.js",
                    "js/plansmap.js",
                    "js/search.js",
                    "js/sidebar.js",
                    "js/singleminded.js"
                ],
                tasks: ["browserify"]
            },

            less: {
                files: ["css/*.less", "css/*/*.less"],
                tasks: ["less", "cssmin"]
            },

            handlebars: {
                files: ["handlebars_templates/*.hbs"],
                tasks: ['handlebars']
            }

        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
