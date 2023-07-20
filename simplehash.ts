import "dotenv/config";

class Simplehash {
  private apiKey = process.env.SIMPLEHASH_API_KEY;
  constructor(_apiKey: string) {
    this.apiKey = _apiKey;
  }

  async getAllHoldings({
    contract_address,
    chain,
    limit = 1000,
    next,
    owners = [],
  }: {
    contract_address: string;
    chain: string;
    limit?: number;
    next?: string;
    owners?: any[];
  }) {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-KEY": this.apiKey,
      },
    };

    let url = `https://api.simplehash.com/api/v0/nfts/owners/${chain}/${contract_address}?limit=${limit}`;

    if (next) {
      url = next;
    }

    const response = await fetch(url, options);
    const data: any = await response.json();

    if (data?.next) {
      return this.getAllHoldings({
        contract_address,
        chain,
        limit,
        next: data.next,
        owners: [...owners, ...data?.owners],
      });
    }

    return [...owners, ...data?.owners];
  }

  async getAllListings({
    contract_address,
    chain,
    from_timestamp,
    to_timestamp,
    limit = 1000,
    next,
    listings = [],
  }: {
    contract_address: string;
    chain: string;
    from_timestamp?: number;
    to_timestamp?: number;
    limit?: number;
    next?: string;
    listings?: any[];
  }) {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-KEY": this.apiKey,
      },
    };

    let url = `https://api.simplehash.com/api/v0/nfts/listings/${chain}/${contract_address}?limit=${limit}`;

    if (from_timestamp) {
      url = `${url}&from_timestamp=${from_timestamp}`;
    }

    if (to_timestamp) {
      url = `${url}&to_timestamp=${to_timestamp}`;
    }

    if (next) {
      url = next;
    }

    const response = await fetch(url, options);
    const data: any = await response.json();

    if (data?.next) {
      return this.getAllListings({
        contract_address,
        chain,
        from_timestamp,
        to_timestamp,
        limit,
        next: data.next,
        listings: [...listings, ...data?.listings],
      });
    }

    return [...listings, ...data?.listings];
  }
}

export default Simplehash;
