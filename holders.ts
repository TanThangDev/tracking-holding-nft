import "dotenv/config";
import Simplehash from "./simplehash";
import { IHolding } from "./type";
import fs from "fs";

const config = {
  contract_address: process.env.CONTRACT_ADDRESS,
  chain: process.env.CHAIN,
};

const holders = async () => {
  // validate config
  if (!config.contract_address) {
    throw new Error("CONTRACT_ADDRESS is required.");
  }

  if (!config.chain) {
    throw new Error("CHAIN is required.");
  }

  const simplehash = new Simplehash(process.env.SIMPLEHASH_API_KEY);

  console.log("Getting all holdings...");
  const data: IHolding[] = await simplehash.getAllHoldings({
    contract_address: config.contract_address,
    chain: config.chain,
  });

  console.log("Saving holdings.json...");
  fs.writeFileSync(
    "./data/holders.json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );

  console.log(`Saved holdings.json with ${data.length} holdings.`);
};

holders();
