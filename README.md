# Tracking Holding NFT

Check if NFT holders have listed NFT for sale within certain time period.

## Setup environment

```bash
$ cp .env.example .env
```

List of environment variables:

- `SIMPLEHASH_API_KEY`: API key to access SimpleHash API [https://simplehash.com/](https://simplehash.com/)
- `ALCHEMY_API_KEY`: API key to access Alchemy API [https://www.alchemy.com/](https://www.alchemy.com/)
- `CONTRACT_ADDRESS`: NFT contract address
- `FROM_TIMESTAMP`: Start timestamp to check if NFT holders have listed NFT for sale (e.g. `2023-07-10T03:42:47Z`)
- `TO_TIMESTAMP`: End timestamp to check if NFT holders have listed NFT for sale (e.g. `2023-07-20T03:42:47Z`)

## Usage

```bash
 npm run start
```

Data will be saved to `./data` folder.

## License

[MIT](LICENSE)
