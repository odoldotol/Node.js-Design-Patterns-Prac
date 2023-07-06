import { readdir } from 'fs';

/**
 * ### 로컬 파일시스템의 디렉터리경로를 입력으로 받으며 비동기적으로 반복하여 발견되는 모든 서브 디렉터리를 비동기적으로 반환.
 * - 콜백 지옥을 가능하면 피할것.
 * - 필요하다면 헬퍼함수를 자유롭게 만들어 사용해도 됨.
 * @param {string} dir 
 * @param {*} cb 
 * @returns {void}
 */
function listNestedFiles(dir, cb) {}