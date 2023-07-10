import { TaskQueue } from "./11-web-spider-v4/TaskQueue.js";
import { readdir, readFile } from 'fs';

/**
 * ### 주어진 디렉터리에서 주어진 키워드를 포함하는 모든 텍스트파일을 찾는 함수
 * - 모든 검색 완료 후 매칭되는 파일 리스트를 콜백을 사용하여 리턴.
 * - 매칭되는 파일이 없으면 빈 배열을 리턴.
 * - 재귀적으로 검색하기.
 * - 디렉터리 및 파일검색, 키워드 검색을 병렬적으로 수행하기.
 * - 제어 가능한 병렬 작업의 수를 유지하기.
 * 
 * ### 검색 로직은 listNestedFiles 를 기반으로 약간 수정/추가 해서 만들고 동시성 제어는 예제 TeskQueue를 이용.
 * 
 * @param {string} dir 로컬 파일시스템의 디렉터리 경로
 * @param {string} keyword 텍스트 파일 내에서 찾을 키워드
 * @param {(err, files) => any} cb 
 */
function recursiveFind(dir, keyword, cb) {

  const fileList = [];

  const workQueue = new TaskQueue(500);
  workQueue.on('error', cb);
  workQueue.on('empty', () => cb(null, fileList));

  const next = (nextDir, nextCb) => {
    readdir(nextDir, {withFileTypes: true}, (err, files) => {
      if (err) {
        return nextCb(err);
      };

      const findTxtFileIncludingKeyword = (fileName, taskCb) => {
        readFile(`${nextDir}/${fileName}`, 'utf8', (err, fileContent) => {
          if (err) {
            return taskCb(err);
          };
          if (fileContent.includes(keyword)) {
            fileList.push(`${nextDir}/${fileName}`);
          };
          taskCb();
        });
      };

      files
      .map(f => { // txt 파일 대상 검색
        if (f.isFile() && f.name.endsWith('.txt')) {
          workQueue.pushTask(findTxtFileIncludingKeyword.bind(null, f.name));
        }
        return f;
      })
      .filter(f => f.isDirectory())
      .map(f => f.name)
      .filter(f => f.charAt(0) !== '.') // 숨김폴더 제외
      .forEach(f => {
        workQueue.pushTask((taskCb) => {
          next(`${nextDir}/${f}`, taskCb);
        });
      });
  
      nextCb();
    });
  };

  workQueue.pushTask((taskCb) => {
    next(dir, taskCb);
  });

}



// --------------------------------------------------------------------------------



recursiveFind('../../', 'number', (err, files) => {
  if (err) {
    return console.error(err);
  };
  console.log(files);
});