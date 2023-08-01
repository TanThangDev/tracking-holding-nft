import "dotenv/config";
import AlchemyLib from "./alchemy";
import Simplehash from "./simplehash";
import fs from "fs";
import { IListing } from "./type";
import * as csvWriterLib from "csv-writer";

const config = {
  contract_address: process.env.CONTRACT_ADDRESS,
};

const snapshot = async () => {
  // validate config
  if (!config.contract_address) {
    throw new Error("CONTRACT_ADDRESS is required.");
  }
  // create directory
  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }

  const alchemy = new AlchemyLib();
  const simplehash = new Simplehash(process.env.SIMPLEHASH_API_KEY);

  const timestamp = new Date().getTime() / 1000;

  console.log("Getting block number...");
  const block = await alchemy.blockNumber(timestamp);
  console.log("Block number:", block);

  console.log("Getting holders...");
  const holders: {
    owner: string;
    tokenId: number;
    balance: number;
  }[] = await alchemy.getOwnersForCollection(config.contract_address, block);

  console.log("Getting listings...");

  const data: IListing[] = await simplehash.getAllListings({
    contract_address: config.contract_address,
    chain: "ethereum",
  });
  const result = [];

  for (let i = 0; i < holders.length; i++) {
    const holder = holders[i];
    let item = {
      holder: holder.owner,
      tokenId: holder.tokenId,
      isListed: false,
      marketPrice: "",
      marketPlace: "",
    };

    const listing = data.find((listing) => {
      const nftId = listing.nft_id.split(".")[2];
      const tokenId = parseInt(nftId);
      return (
        listing.seller_address.toLowerCase() === holder.owner.toLowerCase() &&
        tokenId === holder.tokenId
      );
    });
    if (listing) {
      item.isListed = true;
      item.marketPrice = listing.price;
      item.marketPlace = listing.marketplace_id;
    }
    result.push(item);
  }

  //convert to csv file
  const createCsvWriter = csvWriterLib.createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: `./data/${config.contract_address}-${block}-snapshot.csv`,
    header: [
      { id: "holder", title: "holder" },
      { id: "tokenId", title: "tokenId" },
      { id: "isListed", title: "isListed" },
      { id: "marketPrice", title: "marketPrice" },
      { id: "marketPlace", title: "marketPlace" },
    ],
  });

  await csvWriter.writeRecords(result);
  console.log("The CSV file was written successfully");
};

snapshot();
