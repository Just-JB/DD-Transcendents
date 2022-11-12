import { PublicKey, Connection, } from "@solana/web3.js";
import _ from 'lodash';
import { Metaplex, Nft, NftWithToken, Sft, SftWithToken } from "@metaplex-foundation/js";

export async function getNFTsByOwner(
    owner: PublicKey,
    conn: Connection
  ): Promise<(Nft | Sft | SftWithToken | NftWithToken)[]> {        

    const metaplex = new Metaplex(conn);

    const nfts = (await metaplex.nfts().findAllByOwner({ owner })).filter(nft => nft.creators[0]?.address.toBase58() === "6BK6xqE4qsgN9dxvmfvFLu624VB3SFfcW8KhSmoYDqAS"); // Update Creator address to filter by

    const promises = nfts.map(async (nft) => {
      // @ts-ignore
      return await metaplex.nfts().load({ metadata: nft, loadJsonMetadata: true})
    });

    const loadedNFTs = await Promise.all(promises);    

    return loadedNFTs;
}

export const toDate = (value?: any) => {
  if (!value) {
    return;
  }

  return new Date(value.toNumber() * 1000);
};