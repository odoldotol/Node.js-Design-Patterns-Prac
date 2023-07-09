import { readdir, writeFile } from 'fs';
import { promisify } from 'util';

/**
 * ### 로컬 파일시스템의 디렉터리경로를 입력으로 받으며 비동기적으로 반복하여 발견되는 모든 서브 디렉터리를 비동기적으로 반환.
 * - 콜백 지옥을 가능하면 피할것.
 * - 필요하다면 헬퍼함수를 자유롭게 만들어 사용해도 됨.
 * 
 * ### => 나는, 객체로 트리구조 표현해서 콜백에 전달하도록 했다.
 * @param {string} dir 
 * @param {*} cb 
 * @returns {void}
 */
function listNestedFiles(dir, cb) {

  const works = new Set();

  const rootDirObj = {};
  
  const next = (nextDir, nextObj, nextCb) => {
    works.add(nextDir);
    
    readdir(nextDir, {withFileTypes: true}, (err, files) => {
      if (err) {
        return cb(err);
      };

      files
      .filter(f => f.isDirectory())
      .map(f => f.name)
      .filter(f => f.charAt(0) !== '.') // 숨김폴더 제외
      .forEach(f => {
        nextObj[f] = {};
        next(`${nextDir}/${f}`, nextObj[f], (err) => {
          if (err) {
            return cb(err);
          };
        });
      });
  
      nextCb(null, nextObj);

      works.delete(nextDir);
      if (works.size === 0) {
        cb(null, rootDirObj);
      }
    });
  };

  next(dir, rootDirObj, (err, obj) => {
    if (err) {
      return cb(err);
    };
  });

}





//--------------------------------------------------------------------------------


// 실행 하는 부분은 promisify 이용해보았다.
promisify(listNestedFiles)('../')
.then(result => {
  promisify(writeFile)(
    './listNestedFiles.json',
    JSON.stringify(result, null, 2)
  ).then(
    () => console.log('done'),
    err => console.error(err)
  );
}).catch(err => {
  console.error(err);
});