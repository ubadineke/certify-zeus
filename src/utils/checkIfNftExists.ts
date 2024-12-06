import { Connection, PublicKey } from '@solana/web3.js';

const solanaNftUrlPattern =
  /^https:\/\/explorer\.solana\.com\/address\/([A-Za-z0-9]+)\?cluster=(mainnet|testnet|devnet)$/;

export default async function checkNFTExistsFromUrl(url: string): Promise<boolean> {
  try {
    // Validate the URL format
    const match = solanaNftUrlPattern.exec(url);
    if (!match) {
      throw new Error('Invalid Solana NFT URL format');
    }

    // Extract the mint address and cluster from the URL
    const [, mintAddress, cluster] = match;

    // Connect to the appropriate Solana cluster
    const connection = new Connection(`https://api.${cluster}.solana.com`);

    // Validate the mint address by fetching account info
    const mintPublicKey = new PublicKey(mintAddress);
    const mintAccountInfo = await connection.getAccountInfo(mintPublicKey);

    if (!mintAccountInfo) {
      throw new Error('NFT does not exist on the Solana blockchain');
    }

    console.log(`NFT exists on ${cluster} for mint address: ${mintAddress}`);
    return true;
  } catch (error) {
    // If an error is thrown, the token doesn't exist
    return false;
    throw new Error('NFT does not exists.');
  }
}
