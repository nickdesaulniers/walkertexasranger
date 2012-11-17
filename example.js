var walk = require('walk');

var options = {
  followLinks: false
};

var music_folders = require('./config.json').music_folders;
var num_folders = music_folders.length;
var count_folders = 0;

var walker;
var file_dict = {};

function on_file (root, fileStats, next) {
  file_dict[fileStats.ino] = root + '/' + fileStats.name;
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
