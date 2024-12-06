import { Controller } from '../decorators';
// import { pinFileToIPFS } from '../utils/uploadFileToPinata';
import { Request, Response } from 'express';
import { createMetadataJson } from '../utils/createMetadataJson';
import fs from 'fs';
// import uploadOnchain from '../utils/uploadOnchain';
import qr from 'qrcode';
import Qr from '../models/qr.model';
// import checkNFTExists from '../utils/checkIfNftExists';
import { createNftForApp } from '../utils/mintNft';

export default class Product {
  @Controller()
  public static async register(req: Request, res: Response) {
    if (!req.files) return res.status(400).json('No picture attached');

    const { name, description, sn } = req.fields;
    if (!name || !description || !sn) {
      return res.status(400).json('Provide name, descriptiona and serial number');
    }

    const picture = req.files.image;
    if (!picture) return res.status(400).json('Image not attached');
    if (picture.type === null || picture.type == '') return res.status(400).json('Picture not attached');

    //MINT NFT
    const result = await createNftForApp(picture.path, name, description, [{ trait_type: 'S/N', value: sn }]);

    const qrCodeDataURI = await qr.toDataURL(JSON.stringify(result.explorerUrl));
    console.log(qrCodeDataURI);

    await Qr.create({
      manufacturer: req.user,
      link: qrCodeDataURI,
    });

    res.status(201).json({
      transaction: `NFT Minted! Check it out at: ${result.transactionUrl}`,
      nft: `NFT URL! See it at: ${result.explorerUrl}`,
      qrCodeDataURI,
    });
  }
}
