export interface IHolding {
  nft_id: string;
  owner_address: string;
  token_id: string;
  quantity: number;
  first_acquired_date: string;
  last_acquired_date: string;
}

export interface IListing {
  id: string;
  permalink: string;
  bundle_item_number: null;
  listing_timestamp: string;
  expiration_timestamp: string;
  seller_address: string;
  auction_type: string;
  quantity: number;
  quantity_remaining: number;
  price: string;
  marketplace_id: string;
  collection_id: string;
  nft_id: string;
  payment_token: {
    payment_token_id: string;
    name: string;
    symbol: string;
    address: string;
    decimals: number;
  };
  is_private: false;
}
