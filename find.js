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
    var fstats;
    if (supported_extension_re.test(file_name)) {
      if(fs.existsSync(file_name)) {
        fstats = fs.statSync(file_name);
        file_dict[fstats.ino] = file_name;
      }
    }
  });
  console.log(file_dict);
});
