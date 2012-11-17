var walk = require('walk');
var fs = require('fs');
var supported_extension_re = /\.(mp3|ogg|wav)$/;

var options = {
  followLinks: false
};

var music_folders = require('./config.json').music_folders;
var num_folders = music_folders.length;
var count_folders = 0;

var walker;
var file_dict = {};

function escapeshell (cmd) {
  return cmd.replace(/(["\s'$`\\\(\)])/g,'\\$1');
}

function on_file (root, fileStats, next) {
  if (supported_extension_re.test(fileStats.name)) {
    console.log(root);
    console.log(fileStats.name);
    // messes up folders that begin with '('
    fs.exists(root + fileStats.name, function (exists) {
      if (exists) {
        file_dict[fileStats.ino] = root + fileStats.name;
      } else {
        throw new Error('File does not exist: ' + root + fileStats.name);
      }
    });
  }
  next();
}

function dir_end () {
  if (++count_folders === num_folders) {
    console.log(file_dict);
  }
}

function collect (music_folder) {
  var walker = walk.walk(music_folder, options);
  walker.on('file', on_file);
  walker.on('end', dir_end);
}

music_folders.forEach(collect);
