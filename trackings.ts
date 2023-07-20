import "dotenv/config";
import Simplehash from "./simplehash";
import { IHolding, IListing } from "./type";
import fs from "fs";

const config = {
  contract_address: process.env.CONTRACT_ADDRESS,
  chain: process.env.CHAIN,
  from_timestamp: process.env.FROM_TIMESTAMP,
  to_timestamp: process.env.TO_TIMESTAMP,
};

const trackings = async () => {
  // validate config
  if (!config.contract_address) {
    throw new Error("CONTRACT_ADDRESS is required.");
  }

  if (!config.chain) {
    throw new Error("CHAIN is required.");
  }

  if (!config.from_timestamp) {
    throw new Error("FROM_TIMESTAMP is required.");
  }

  if (!config.to_timestamp) {
    throw new Error("TO_TIMESTAMP is required.");
  }

  const simplehash = new Simplehash(process.env.SIMPLEHASH_API_KEY);
  const data: IListing[] = await simplehash.getAllListings({
    contract_address: config.contract_address,
    chain: config.chain,
    from_timestamp: new Date(config.from_timestamp).getTime() / 1000,
    to_timestamp: new Date(config.to_timestamp).getTime() / 1000,
  });

  console.log(`Get ${data.length} listings.`);

  // Save listings.json
  fs.writeFileSync(
    "./data/listings.json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );

  // Loading holders.json
  const holders: IHolding[] = JSON.parse(
    fs.readFileSync("./data/holders.json", "utf-8")
  );

  // Get address not in listings
  const addresses = holders
    .map((holding) => holding.owner_address.toLowerCase())
    .filter((address) => {
      return !data.find(
        (listing) => listing.seller_address.toLowerCase() === address
      );
    });

  const uniqueAddresses = [...new Set(addresses)];

  console.log(`Get ${uniqueAddresses.length} addresses not in listings.`);
  fs.writeFileSync(
    "./data/addresses.json",
    JSON.stringify(uniqueAddresses, null, 2),
    "utf-8"
  );
};

trackings();
