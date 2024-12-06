import wallet from '../wallet/dev-wallet.json';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { readFile } from 'fs/promises';
import base58 from 'bs58';

const RPC_ENDPOINT = 'https://api.devnet.solana.com';
const umi = createUmi(RPC_ENDPOINT);

export async function createNftForApp(imagePath: string, name: string, description: string, attributes: any[]) {
  try {
    //PRESETS
    if (!process.env.WALLET_KEY) {
      throw new Error('Missing SIGNER/ Not provided');
    }

    const base58PrivateKey = process.env.WALLET_KEY.trim();
    const decodedPrivateKey = base58.decode(base58PrivateKey);

    let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(decodedPrivateKey));
    const signer = createSignerFromKeypair(umi, keypair);

    umi.use(irysUploader());
    umi.use(signerIdentity(signer));
    umi.use(mplTokenMetadata());

    // ----------------------------------------//-------

    // Load and upload image
    const image = await readFile(imagePath);
    const genericFile = createGenericFile(image, name, { contentType: 'image/png' });
    const imageUri = await umi.uploader.upload([genericFile]);

    // Create metadata
    const metadata = {
      name: name,
      symbol: 'TP',
      description: description,
      image: imageUri[0].replace('arweave.net', 'devnet.irys.xyz'),
      attributes: attributes,
      properties: {
        files: [
          {
            type: 'image/png',
            uri: imageUri[0].replace('arweave.net', 'devnet.irys.xyz'),
          },
        ],
      },
      creators: [keypair.publicKey],
    };
    const metadataUri = await umi.uploader.uploadJson(metadata);

    // Mint NFT
    const mint = generateSigner(umi);
    const tx = createNft(umi, {
      mint: mint,
      name: name,
      symbol: 'TP',
      uri: metadataUri.replace('arweave.net', 'devnet.irys.xyz'),
      sellerFeeBasisPoints: percentAmount(1),
    });
    const result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);

    return {
      mintAddress: mint.publicKey,
      transactionSignature: signature,
      metadataUri: metadataUri.replace('arweave.net', 'devnet.irys.xyz'),
      explorerUrl: `https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`,
      transactionUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    };
  } catch (error) {
    console.error('Error creating NFT:', error);
    throw error;
  }
}
