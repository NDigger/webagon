// import { lockdown } from 'ses';

// lockdown()

// export function createSandbox(level) {
//   const realm = new globalThis.Realm();

//   realm.global.level = level;

//   function runUserCode(userCode) {
//     return realm.evaluate(userCode);
//   }

//   return { runUserCode };
// }