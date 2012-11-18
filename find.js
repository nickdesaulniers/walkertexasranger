var fs = require('fs');
var music_folders = require('./config.json').music_folders;
var supported_extension_re = /\.(mp3|ogg|wav)$/;
var file_dict = {};
var async = require('async'); //this is an external library, that you will need to `npm install async`
var path = require('path');
var errors = [];

function escapeshell (cmd) {
  return cmd.replace(/(["\s'$`\\\(\)])/g,'\\$1');
}

//asynchronously loop through each directory in parallel
async.forEach(music_folders, function(dir, _dirCb) {
  //read the directory for a list of files
  fs.readdir(dir, function(err, files) {
    //asynchronously loop through each file in the directory
    async.forEach(files, function(fileName, _fileCb) {
      if(!supported_extension_re.test(fileName)) {
        _fileCb();
        return;
      }

      //stat each file to check for existance, and save inode info
      fs.stat(path.join(dir, fileName), function(err, stats) {
        //\Normally you would pass the err to the callback, but 
        //the way async library works is it would end our loop
        //when it got an error, so lets just store it off for later

        //if the file exists
        if(!err) {
          file_dict[stats.ino] = fileName;
        } else {
          errors.push({
            dir: dir,
            file: fileName,
            error: err
          });
        }
        
        //call async's callback so it nkows this check is done
        _fileCb();
      });
    });
  //after all files in a directory are added, let async know we finished this iteration
  }, _dirCb);
}, function() {
  //this will be called after all directories are checked
  //and if any error occurred we will have stored them in `errors`
  console.log(file_dict, errors);
});
