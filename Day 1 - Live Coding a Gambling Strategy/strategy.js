const axios = require("axios");

const cookie = `locale=en; currency_currency=btc; currency_hideZeroBalances=false; currency_currencyView=crypto; fiat_number_format=en; sidebarView=hidden; quick_bet_popup=false; sportMarketGroupMap={}; oddsFormat=decimal; cookie_last_vip_tab=progress; fullscreen_preference=false; intercom-id-cx1ywgf2=4af81e7d-9217-42d4-bdd0-74b1ec33e0d8; intercom-device-id-cx1ywgf2=854d2523-25c4-411c-a297-ebd0523fc319; cookie_consent=true; session=8507867cbae3ce03bbc0c5c6227f760471c46444d79234088c5152b7395e4ef24dfe344e7d592fd272981562aa937f24; session_info={"id":"27e0f004-a7ee-4b02-840e-4a8d0a9af99a","sessionName":"Chrome (Mac)","ip":"104.28.198.131","country":"CA","city":"Toronto","active":true,"updatedAt":"Fri, 12 Sep 2025 05:56:07 GMT","__typename":"UserSession"}; leftSidebarView_v2=minimized; cf_clearance=jw5hSl6xRdksH7PqrhjO1YdLYGD7iLGOj2M2wdUNkqg-1757658749-1.2.1.1-AVjy7XngWoMG7gl1yfx50dQtDFSkGtnkvKwbKnMEQ_UWS2Y033wOMeIeknwWFl01eRWf1SBtS5wyEoHPrYsqUL_2XO4CzhlOH0kTsdlnADBU7piiqqhw0utVT01trYAkzdpMbfYrP1SKZrqpEMrVgT_pFsB0AJYpWcr_aFN2WlpTKv4_NWVFJChdZIgF_yNAF3Q3C9WnYOUuSCgXPDdAO.4NZnbBEgrWMxIMpN3uWjs; mp_e29e8d653fb046aa5a7d7b151ecf6f99_mixpanel=%7B%22distinct_id%22%3A%22ecd2bb78-bbd4-4908-befb-a1561251db6b%22%2C%22%24device_id%22%3A%22ccccce69-2374-4d5b-a915-46b3e8accc06%22%2C%22%24initial_referrer%22%3A%22%24direct%22%2C%22%24initial_referring_domain%22%3A%22%24direct%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%2C%22%24user_id%22%3A%22ecd2bb78-bbd4-4908-befb-a1561251db6b%22%7D; intercom-session-cx1ywgf2=SUU3QkZ6bmdyNDJmR0JaTUJnYnkzTmhkcGxGQUlCTVN3VWtETXAzb2gvTGV3RFRIenJZQ29zT05sbXExRHV6bXNsdFRFb1hMdy9kTDFSbUtQT0JpTUZlWDNiU2hMR3BNSjVsZzhOY2hxekU9LS1hSXpQOXRlY2dXY1VuVldrS1BYWElRPT0=--477f1073c45edeeb96a52bdc48fc0eec507e9631; __cf_bm=JDKq5CXG6spd1bT14zopYMZ9s98aQcXO_1bFsO1TlU4-1757658763-1.0.1.1-NS.9ojle38l6nE7Z07BNB2DIDaYYZab9B1uZDH_tp3xBGUCf9yEd0teMV9ZLwib6mpVoszmqsa9H0wPCU2SmwdmLS22WXuOKZYvK8xOlrkw; _cfuvid=3YPWx26ilLV9YhJ4dhKZcDURIGDFc5d7tqjDwyGxv9Q-1757658763377-0.0.1.1-604800000; _dd_s=aid=60534b38-be40-4396-9cf3-787816d1a5ee&logs=1&id=7345b5b7-f2a9-41f0-80a1-3ced49a655b0&created=1757656560335&expire=1757659669534&rum=0`;


const ACCESS_TOKEN = "8507867cbae3ce03bbc0c5c6227f760471c46444d79234088c5152b7395e4ef24dfe344e7d592fd272981562aa937f24";
const LOCKDOWN_TOKEN = "s5MNWtjTM5TvCMkAzxov";


//bypass cloudflare using puppeteer
const cloudscraper = require('cloudscraper');

async function bypassCloudflare() {
    try {
        const response = await cloudscraper.post({
            uri: 'https://stake.com/_api/casino/dice/roll',
            headers: {
                'x-access-token': ACCESS_TOKEN,
                'x-lockdown-token': LOCKDOWN_TOKEN,
                'content-type': 'application/json'
            },
            json: {
                target: 54,
                condition: "above",
                identifier: "NnX_pqZE6k2y5ZqvLRS-z",
                amount: 0.00000001,
                currency: "btc"
            }
        });
        return response;
    } catch (error) {
        console.error('Cloudflare bypass error:', error);
    }
}
bypassCloudflare();

async function sendRequest(amount) {
    try {
        const response = await axios({
            method: 'post',
            url: "https://stake.com/_api/casino/dice/roll",
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "cookie": cookie,
                "origin": "https://stake.com",
                "priority": "u=1, i",
                "referer": "https://stake.com/casino/games/dice",
                "sec-ch-ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
                "x-access-token": ACCESS_TOKEN,
                "x-lockdown-token": LOCKDOWN_TOKEN
            },
            data: {
                target: 54,
                condition: "above",
                identifier: "NnX_pqZE6k2y5ZqvLRS-z",
                amount: amount,
                currency: "btc"
            }
        });

        return response.data;
    } catch (error) {
        //console.error("Request error:", error.response?.data || error.message);
        throw error;
    }
}

const DEFAULT_AMOUNT = 0.00;
async function main() {
    let amount = DEFAULT_AMOUNT;
    let lossesInARow = 0;
    while(1) {
        console.log(`Betting ${amount}`)
        try {
            const response = await sendRequest(amount);
            if (response.diceRoll.state.result < 50.5) {
                console.log(`Lost`)
                lossesInARow++;
                amount = amount * 2;
            } else {
                console.log(`Won`)
                lossesInARow = 0;
                amount = DEFAULT_AMOUNT;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            if (lossesInARow >= 13) {
                console.log("Stopping")
                process.exit(0);
            }
        } catch (e) {
            console.error("Error occurred:", e);
            console.log("Error came");
        }
    }
}

main();


