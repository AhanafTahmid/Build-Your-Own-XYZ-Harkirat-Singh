const sss = require('shamirs-secret-sharing')

const secret = Buffer.from('how to debug this')
const shares = sss.split(secret, { shares: 3, threshold: 3 })
const smallerShares = shares.slice(0, 3);
const recovered = sss.combine(smallerShares)

console.log(shares.map(x => x.toString('hex')));
console.log(recovered.toString()) 