import { MaxUint256 } from "ethers";
import { getUsdcContract } from "./clob-client/examples/approveAllowances";
import { JsonRpcProvider } from "./clob-client/node_modules/@ethersproject/providers";
import { Wallet } from "./clob-client/node_modules/@ethersproject/wallet";
import { Chain, ClobClient, getContractConfig, Side } from "./clob-client/src/index";
import type { Depth } from "./types";
const POLYMARKET_API_KEY = process.env.POLYMARKET_API_KEY;
const POLYMARKET_API_SECRET = process.env.POLYMARKET_API_SECRET;
const POLYMARKET_PASS_PHRASE = process.env.POLYMARKET_PASS_PHRASE;
const ETH_PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!ETH_PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set");
}

const host = process.env.CLOB_API_URL || "https://clob.polymarket.com";
const rpcUrl = process.env.RPC_URL;
const provider = new JsonRpcProvider(rpcUrl);
const signer = new Wallet(ETH_PRIVATE_KEY, provider);

const clobClient = new ClobClient(host, Chain.POLYGON, signer, {
    key: POLYMARKET_API_KEY!,
    secret: POLYMARKET_API_SECRET!,
    passphrase: POLYMARKET_PASS_PHRASE!,
});

export async function approveAllowance(tokenId: string) {
    console.log("approve al;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owance")
    const usdc = getUsdcContract(true, signer);
    const contractConfig = getContractConfig(Chain.POLYGON);
    
    const txn = await usdc.approve(contractConfig.conditionalTokens, MaxUint256, {
        gasPrice: 100_000_000_000,
        gasLimit: 200_000,
    });
    console.log(txn);
    console.log(`Setting USDC allowance for CTF: ${txn.hash}`);
    await txn.wait();
    
}

export async function createOrder(tokenId: string, price: number, size: number) {
    // Then create and post order
    const order = await clobClient.createOrder({
        tokenID: tokenId,
        price,
        side: Side.BUY,
        size,
        feeRateBps: 0,
    });
    const res = await clobClient.postOrder(order);
    console.log(res);
    return res;
}

export async function getDepth(tokenId: string): Promise<Depth> {
    const response = await clobClient.getOrderBook(
        tokenId
    );
    let depth: Depth = {buy: {}, sell: {}};
    response.bids.map(bid => {
        depth.buy[bid.price.toString()] = bid.size.toString();
    })
    response.asks.map(ask => {
        depth.sell[ask.price.toString()] = ask.size.toString();
    })
    return depth;
}