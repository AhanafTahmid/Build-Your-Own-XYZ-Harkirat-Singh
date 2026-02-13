import { findAndExecArb } from "./index";
findAndExecArb({
    buy: {
        "0.31": "100",
    },
    sell: {
        "0.74": "100",
    }
}, {
    buy: {
        "0.44": "100",
    },
    sell: {
        "2": "1000000000",
    }
});
// expected qty