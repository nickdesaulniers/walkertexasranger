var execFile = require('child_process').execFile;
var fs = require('fs');
var music_folders = require('./config.json').music_folders;
var supported_extension_re = /\.(mp3|ogg|wav)$/;
var file_dict = {};

function escapeshell (cmd) {
  return cmd.replace(/(["\s'$`\\\(\)])/g,'\\$1');
}

execFile('find', music_folders, function (error, stdout, stderr) {
  var file_names = stdout.split('\n');
  file_names.forEach(function (file_name) {
    if (supported_extension_re.test(file_name)) {
      fs.exists(file_name, function (exists) {
        if (exists) {
          file_dict[0] = file_name;
        } else {
          throw new Error('File does not exist: ' + file_name);
        }
      });
    }
  });
});
