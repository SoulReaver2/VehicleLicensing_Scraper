//@ts-check

const async = require("async");

const t = Date.now();

const tic = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise 1");
  }, 1000);
});
tic.then((alpha) => console.log(alpha + " : " + (t - Date.now())));

setTimeout(() => {
  const ti = t - Date.now();
  console.log("8: ", ti);
}, 2000);

setTimeout(() => {
  const ti = t - Date.now();
  console.log("As: ", ti);
}, 1000);

const task1 = (callback) => {
  setTimeout(() => {
    callback(null, "Task 1 finished");
  }, 1000);
};

const task2 = (callback) => {
  setTimeout(() => {
    callback(null, "Task 2 completed");
  }, 1500);
};

const task3 = (callback) => {
  setTimeout(() => {
    callback(null, "Task 3 completed");
  }, 1000);
};

// Executing tasks in parallel
async.parallel([task1, task2, task3], callback);

function callback(err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
}
