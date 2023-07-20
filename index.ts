import "dotenv/config";
import AlchemyLib from "./alchemy";
import Simplehash from "./simplehash";
import fs from "fs";

import { IListing } from "./type";

const config = {
  contract_address: process.env.CONTRACT_ADDRESS,
  from_timestamp: process.env.FROM_TIMESTAMP,
  to_timestamp: process.env.TO_TIMESTAMP,
};

const main = async () => {
  // validate config
  if (!config.contract_address) {
    throw new Error("CONTRACT_ADDRESS is required.");
  }

  if (!config.from_timestamp) {
    throw new Error("FROM_TIMESTAMP is required.");
  }

  if (!config.to_timestamp) {
    throw new Error("TO_TIMESTAMP is required.");
  }

  // create directory
  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }

  const alchemy = new AlchemyLib();
  const simplehash = new Simplehash(process.env.SIMPLEHASH_API_KEY);

  const timestamp = new Date(config.from_timestamp).getTime() / 1000;

  console.log("Getting block number...");
  const block = await alchemy.blockNumber(timestamp);
  console.log("Block number:", block);

  console.log("Getting holders...");
  const holders: string[] = await alchemy.getHolders(
    config.contract_address,
    block
  );
  console.log("Have holders:", holders.length);

  console.log("Getting listings...");
  const data: IListing[] = await simplehash.getAllListings({
    contract_address: config.contract_address,
    chain: "ethereum",
    from_timestamp: new Date(config.from_timestamp).getTime() / 1000,
    to_timestamp: new Date(config.to_timestamp).getTime() / 1000,
  });
  console.log("Have listings:", data.length);

  // Get address not in listings
  const addresses = holders.filter((address) => {
    return !data.find(
      (listing) =>
        listing.seller_address.toLowerCase() === address.toLowerCase()
    );
  });

  const uniqueAddresses = [...new Set(addresses)];

  console.log(`Get ${uniqueAddresses.length} addresses not in listings.`);
  let fileName = `addresses-${config.contract_address}`;
  if (config.from_timestamp) {
    fileName += `_${config.from_timestamp.split("T")[0]}`;
  }
  if (config.to_timestamp) {
    fileName += `_${config.to_timestamp.split("T")[0]}`;
  }
  fs.writeFileSync(
    `./data/${fileName}.json`,
    JSON.stringify(uniqueAddresses, null, 2),
    "utf-8"
  );

  // cover to csv
  const csv = uniqueAddresses.join("\n");
  fs.writeFileSync(`./data/${fileName}.csv`, csv, "utf-8");
};

main();
