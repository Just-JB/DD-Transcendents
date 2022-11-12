import { useEffect, useState } from "react"
import { getNFTsByOwner } from "../utils/nfts"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Nft, NftWithToken, Sft, SftWithToken } from "@metaplex-foundation/js"

const useWalletNFTs = (reload) => {
  const { connection } = useConnection();  
  const { publicKey } = useWallet();
  const [walletNFTs, setWalletNFTs] = useState<Array<Nft | Sft | SftWithToken | NftWithToken>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true)
      const NFTs = await getNFTsByOwner(publicKey, connection);
      
      setWalletNFTs(NFTs)
      setLoading(false)
    }

    if (publicKey) {
      console.log("Fetching NFTs");
      fetchNFTs()
    }
  }, [publicKey, reload])

  return {walletNFTs, loading, reload}
}

export default useWalletNFTs;