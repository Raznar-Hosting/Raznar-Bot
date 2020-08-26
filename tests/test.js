const { AsyncFunction } = require('../objects/misc.js');

async function handle() {
    return false;
}

console.log(handle instanceof AsyncFunction);