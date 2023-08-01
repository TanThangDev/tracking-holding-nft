import "dotenv/config";

import { Alchemy, Network } from "alchemy-sdk";

class AlchemyLib {
  public alchemy: Alchemy;
  constructor() {
    const config = {
      apiKey: process.env.ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };
    this.alchemy = new Alchemy(config);
  }

  async getHolders(address: string, block?: number) {
    const options = {};
    if (block) {
      options["block"] = block.toString();
    }
    const owners = await this.alchemy.nft.getOwnersForContract(
      address,
      options
    );

    return owners.owners;
  }

  async getOwnersForCollection(address: string, block?: number) {
    const options = {
      withTokenBalances: true,
    };
    if (block) {
      options["block"] = block.toString();
    }
    const ownerAddresses: any = await this.alchemy.nft.getOwnersForContract(
      address,
      options
    );

    const dataTokenId = ownerAddresses.owners.map((owner: any) => {
      return owner.tokenBalances.map((token: any) => {
        return {
          owner: owner.ownerAddress,
          tokenId: parseInt(token.tokenId, 16),
          balance: token.balance,
        };
      });
    });

    const data = dataTokenId.flat();

    return data;
  }

  async blockNumber(timestamp: number) {
    const latestBlockNumber = await this.alchemy.core.getBlockNumber();

    let startBlock = 0;
    let endBlock = latestBlockNumber;

    while (startBlock <= endBlock) {
      const midBlock = Math.floor((startBlock + endBlock) / 2);
      const midBlockData = await await this.alchemy.core.getBlock(midBlock);
      if (midBlockData.timestamp === timestamp) {
        return midBlock;
      } else if (midBlockData.timestamp < timestamp) {
        startBlock = midBlock + 1;
      } else {
        endBlock = midBlock - 1;
      }
    }

    return endBlock;
  }
}

export default AlchemyLib;
