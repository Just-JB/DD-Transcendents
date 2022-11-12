// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas, Image, loadImage } from "canvas"
import axios from "axios";
import manifest from "../../../public/collectionManifest.json"
import _ from "lodash"
import Frame from "canvas-to-buffer"

export const config = {
  api: {
    responseLimit: false,
  },
}

const handler = async(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const id = req.query.nid;
  const linkToMetadata = `https://shdw-drive.genesysgo.net/BKtsfuKr82gkH8oHWTgPhANtGizG1BEPbX4jYBkZxsKg/${id}.json`;

  const { data } = await axios.get(linkToMetadata);
  
  const canvas = createCanvas(3000, 3000);
  
  const ctx = canvas.getContext("2d");

  const promises = _.map(Object.keys(manifest), async (key: string) => {                        
    const index = _.findIndex(data.attributes, { "trait_type": key });    

    if (index >= 0 && data.attributes[index]) {   
                             
        const imagePromise = await loadImage(manifest[key].traits[data.attributes[index].value.replace(" ", "_")])

        return {imagePromise, order: manifest[key].order.split('-')[1]}
    }
  });

  const images = (await Promise.all(promises)).sort((a,b) => a.order - b.order);

  images.forEach((img: {imagePromise: Image, order: string}) => {    
     img !== undefined && ctx.drawImage(img.imagePromise, 0, 0)
  })

  const frame = new Frame(canvas, {
    quality: 0.5,
    image: {
      types: ["jpeg"]
    }
  })

  const buffer = frame.toBuffer();

  console.log(buffer.byteLength / 1000000)

  res.writeHead(200), {
    "Content-Type": "image/jpeg",
    "Content-Length": buffer.length,
  }
  res.end(buffer, 'binary')
}

export default handler
