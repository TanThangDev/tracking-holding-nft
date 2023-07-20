# Tracking Holding NFT

Check if NFT holders have listed NFT for sale within certain time period.

## Setup environment

```bash
$ cp .env.example .env
```

List of environment variables:

- `SIMPLEHASH_API_KEY`: API key to access SimpleHash API [https://simplehash.com/](https://simplehash.com/)
- `CONTRACT_ADDRESS`: NFT contract address
- `CHAIN`: Blockchain network (e.g. `arbitrum`, `ethereum`)
- `FROM_TIMESTAMP`: Start timestamp to check if NFT holders have listed NFT for sale (e.g. `2023-07-10T03:42:47Z`)
- `TO_TIMESTAMP`: End timestamp to check if NFT holders have listed NFT for sale (e.g. `2023-07-20T03:42:47Z`)

## Usage

- You can save list holders to CSV file just in time to check if NFT holders have listed NFT for sale.

```bash
 npm run holders
```

- Check if NFT holders have listed NFT for sale within certain time period.

```bash
 npm run trackings
```

Data will be saved to `./data` folder.

- `holders.json`: List of NFT
- `listings.json`: List of NFT holders who have listed NFT for sale within certain time period
- `addresses.json`: List of NFT holders who have listed NFT for sale within certain time period (unique)
- `addresses.csv`: List of NFT holders who have listed NFT for sale within certain time period (unique)

## License

[MIT](LICENSE)
