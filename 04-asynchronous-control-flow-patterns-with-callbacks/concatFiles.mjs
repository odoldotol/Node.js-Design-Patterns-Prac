import { readFile, writeFile } from 'fs';

/**
 * ### srcFiles 의 순서를 지키며 모든 파일의 내용을 dest 로 복사
 * - 아마도 Promise, Async/Await, Array.reduce 를 사용하지 않는것이 이 문제의 의도에 포함되어있을것 같으니 사용하지 말자.
 * @param {string[]} srcFiles 
 * @param {string} dest 
 * @param {(err, destData: string) => void} cb 
 */
function concatFiles(srcFiles, dest, cb) {
  let destData = '';
  let index = 0;

  next();

  function next() {
    if (index === srcFiles.length) {
      writeFile(dest, destData, (err) => {
        if (err) {
          return cb(err);
        };
      });

      return cb(null, destData);
    };

    readFile(srcFiles[index], 'utf8', (err, data) => {
      if (err) {
        return cb(err);
      };

      destData += data;
      index++;
      next();
    });
  }
}

concatFiles(['./srcFiles/fileA', './srcFiles/fileB', './srcFiles/fileC'], './destFile', (err, destData) => {
  if (err) {
    return console.log(err);
    // throw err;
  };
  console.log(destData);
});