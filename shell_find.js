var shell = require('shelljs');
var fs = require('fs');
var music_folders = require('./config.json').music_folders;
var supported_extension_re = /\.(mp3|ogg|wav)$/;
var file_dict = {};

shell.find(music_folders).filter(function (file_name) {
  return supported_extension_re.test(file_name) && fs.existsSync(file_name);
}).forEach(function (file_name) {
  file_dict[fs.statSync(file_name).ino] = file_name;
});

console.log(file_dict);