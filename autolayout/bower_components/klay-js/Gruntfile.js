module.exports = function (grunt) {
  grunt.initConfig({
    curl: {
      'klay_layered_js_nightly_latest.zip': 'http://rtsys.informatik.uni-kiel.de/~kieler/files/nightly/klayjs/klay_layered_js_nightly_latest.zip'
    },
    unzip: {
      'klay': 'klay_layered_js_nightly_latest.zip'
    },
    clean: {
      klay_package: 'klay_layered_js_nightly_latest.zip'
    }
  });

  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['curl', 'unzip', 'clean']);
  
};
