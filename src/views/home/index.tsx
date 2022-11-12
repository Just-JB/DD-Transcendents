// Next, React
import { FC, useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import config from "../../../public/collectionManifest.json"

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Components
import pkg from '../../../package.json';
import ListItem from 'components/ListItem';
import NFTDisplay from 'components/NFTDisplay';

import { swapTrait } from 'utils/swapTrait';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import { notify } from 'utils/notifications';

// Hooks
import useWalletNFTs from 'hooks/useWalletNFTs';
import Link from 'next/link';
import { Nft, NftWithToken, Sft, SftWithToken } from '@metaplex-foundation/js';
import NftDownload from 'components/NftDownload';

export const HomeView: FC = ({ }) => {
  const [activeNFT, setActiveNFT] = useState<Nft | Sft | SftWithToken | NftWithToken>(null);
  const [traitReference, setTraitReference] = useState(null);
  const [previewTrait, setPreviewTrait] = useState('');    
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<{txHash: string, traitReference: string, from: string, to: string}>(null);
  const [reload, setReload] = useState(0);
  const [swapLoading, setSwapLoading] = useState(false)

  const wallet = useWallet();
  const walletNFTs = useWalletNFTs(reload);

  const refSwap = useRef(null);
  
  const { connection } = useConnection();
  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  const handleSubmit = async(e: any) => {
    e.preventDefault();

    setFormError("Swapping is not yet available");
    return;

    // Add errors - TODO: too little currency error
    if (previewTrait === activeNFT.json.attributes[_.findIndex(activeNFT.json.attributes, { "trait_type": traitReference })].value) { // TODO: compare if preview trait already active
      setFormError("This trait is already active")
    } else if (previewTrait === "") {
      setFormError("Select a trait")
    } else {
      setFormError('')
      setSwapLoading(true)
      const res = await swapTrait(previewTrait, traitReference, activeNFT, wallet, connection);
      setReload(reload + 1)      
      setReceipt(res)
      setSwapLoading(false)
      setTraitReference(null)
    }
  }

  return (
    <div className="md:hero mx-auto p-4 relative w-screen">
      <div className="md:hero-content flex flex-col w-full">
        <h1 className="text-center font-black-mustang text-6xl font-black">
          Dashboard
        </h1>
        <h4 className="md:w-full text-center text-slate-300 my-2">
          <p>View your Transcendent NFTs and swap traits</p>
        </h4>
        {/* NFT List Section */}
        {wallet.connected ? (   
          <div className="pt-4 md:flex md:flex-col md:items-center md:w-mdscreencustom lg:w-full lg:max-w-screen-lg">
            {!walletNFTs.loading ? (
              <>
              {walletNFTs.walletNFTs.length === 0 ? (
                <div className="bg-second p-4 rounded">
                  <p className="text-center">It appears you don't have any Transcendents</p>
                  <div className="flex items-center space-x-4 my-4 justify-center">
                    {/* <p className="font-bold">Mint one:</p> */}
                    {/* <Link href="/mint">
                      <a className="btn bg-lighter text-text font-bold border-0 rounded-btn hover:bg-body drop-shadow">Go to Mint</a>
                    </Link> */}
                    <a target="_blank" href="https://magiceden.io/marketplace/divinedogs_transcendents" className="text-primary-content font-bold bg-me hover:bg-mehover rounded px-6 py-2">Magic Eden</a>
                  </div>
                </div>
              ) : (
                <>
                <p className="font-bold py-2 md:text-lg">Your NFTs</p>
                <div className="flex items-center space-x-2 overflow-x-auto touch-pan-x md:w-3/4">
                  {_.map(walletNFTs.walletNFTs, (nft: Nft | Sft | SftWithToken | NftWithToken) => {                    
                    return <ListItem nft={nft} reload={reload} activeNFT={activeNFT} setActiveNFT={(nft) => {setActiveNFT(nft)}} setTraitReference={() => setTraitReference(null)} key={nft.json.name} />
                  })}
                </div>
                </>
              )}
              </>
            ) : (
              <>
              <p className="font-bold py-2 md:text-lg">Your NFTs</p>
              <div className="flex items-center space-x-2 overflow-x-auto touch-pan-x">
                <div className="w-36 md:w-44 aspect-square rounded bg-second animate-pulse"></div>
                <div className="w-36 md:w-44 aspect-square rounded bg-second animate-pulse"></div>
              </div>
              </>
            )
            }
            {/* Active NFT Section */}
            {activeNFT ? (
              <div className="pt-4 md:w-3/4">
                <h1 className="pt-4 font-black-mustang text-5xl font-black">{activeNFT.json.name}</h1>
                <label htmlFor='downloadModal' className='underline modal-group hover:cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faCamera}/>Save image</label>
                {/* First Dynamic Attributes with different Styling */ }
                <p className="font-bold py-2 md:text-lg">Attributes</p>
                <div className="flex flex-wrap">
                  {
                    _.map(activeNFT.json.attributes, attribute => {                  
                      return (
                        <div onClick={() => {attribute.trait_type !== "Fur" && setTraitReference(attribute.trait_type); setPreviewTrait(''); setFormError(""); refSwap.current.scrollIntoView({ behavior: "smooth"})}} className="mr-2 mb-2 px-2 py-1 rounded bg-lighter shadow-lg transition ease-in-out delay-50 hover:-translate-y-1 duration-100" key={attribute.trait_type}>
                          <div className="stat-title">{attribute.trait_type}</div>
                          <div className="text-sm">{attribute.value}</div>
                        </div>
                      )
                    })
                  }
                </div>
                <p className="font-bold py-2 md:text-lg">Inventory</p>
                <div className="flex flex-wrap">
                  { activeNFT.json.inventory && activeNFT.json.inventory[0] ?  (
                    _.map(activeNFT.json.inventory, attribute => {
                      // TODO: If attribute is equipped, don't display here
                      return (
                        <div onClick={() => {setTraitReference(attribute.trait_type); setPreviewTrait(''); setFormError("")}} className="mr-2 mb-2 px-2 py-1 rounded bg-lighter shadow-lg transition ease-in-out delay-50 hover:-translate-y-1 duration-100" key={attribute.value}>
                          <div className="stat-title">{attribute.trait_type}</div>
                          <div className="text-sm">{attribute.value}</div>
                        </div>
                      )
                    })
                  ) : (
                    <>
                    <p>Your inventory is empty, swap a trait below!</p>
                    </>
                  )
                  }
                </div>
                {/* Trait Swap */}
                <div>
                  <h1 ref={refSwap} className="my-4 font-black-mustang text-5xl font-black">Swap</h1>
                  {/* NFT Display */}
                  <div className="lg:flex bg-gradient-to-tr from-[#34275d] to-[#3f8190] rounded text-offWhite shadow-xl">
                  <NFTDisplay activeNFT={activeNFT} traitReference={traitReference} previewTrait={previewTrait} />
                  <div className="p-6 lg:px-6 lg:w-full">
                    <div className="grid grid-cols-3">
                    { // Swap Select
                    _.map(activeNFT.json.attributes, key => {
                      if (key.trait_type === "Fur") {
                        return;
                      }               
                      if (key.trait_type === traitReference) {
                        return (
                          <div key={key.trait_type} onClick={() => {setTraitReference(key.trait_type); setPreviewTrait(''); setFormError(""); setReceipt(null)}} className="my-1 mr-1 px-2 py-1 rounded bg-gradient-to-tr from-[#3a3a3a] to-[#3B4F78] -translate-y-1">
                            <div className="text-sm">{key.trait_type}</div>
                          </div>
                        )
                      }           
                      return (
                          <div key={key.trait_type} onClick={() => {setTraitReference(key.trait_type); setPreviewTrait(''); setFormError(""); setReceipt(null)}} className="my-1 mr-1 px-2 py-1 rounded bg-gradient-to-tr from-[#34275d] to-[#3f8190] transition ease-in-out delay-50 hover:-translate-y-1 duration-100">
                            <div className="text-sm">{key.trait_type}</div>
                          </div>
                        )
                      })
                    }
                    </div>
                    { // Select Form
                      traitReference ? (
                        <div className="my-4">
                            <p className="text-sm"><FontAwesomeIcon icon={faInfoCircle} /> Choose <span className="underline">{traitReference}</span> for <span>{activeNFT.json.name}</span></p>
                            <form>
                              <select className="my-2 select select-bordered select-ghost select-sm w-full" value={previewTrait} onChange={(e) => {setPreviewTrait(e.target.value); setFormError("")}}>
                                <option disabled value=''>{`Select ${traitReference}`}</option>
                                {
                                  _.map(Object.keys(config[traitReference].traits), trait => {
                                    return (
                                      <option key={trait} value={trait}>{trait.replace("_", " ")}</option>
                                    )
                                  })}
                              </select>
                              <p className="text-xs text-error my-2">{formError}</p>
                              <div className="flex justify-between">
                                <p className="text-xs">Current trait: <span className="font-bold">{activeNFT.json.attributes[_.findIndex(activeNFT.json.attributes, { "trait_type": traitReference })].value}</span></p>
                                {previewTrait && (
                                  <>
                                  <FontAwesomeIcon icon={faArrowRight}/>
                                  <p className="text-xs">Trait selected: <span className="font-bold underline">{previewTrait}</span></p>
                                  </>
                                )}
                              </div>
                              <button type='submit' className={"btn btn-block bg-button border-0 my-2 hover:brightness-95 " + (swapLoading && " loading")} onClick={handleSubmit}>SWAP</button>
                              <p className="text-center text-xs text-inherit stat-title">Powered by Dynamic Labs</p>
                            </form>
                        </div>
                      ) : ( // Begin of the else statements - Select Trait first
                        <p className="text-center py-8 italic">Select a Trait to Swap <FontAwesomeIcon className='animate-bounce' icon={faHandPointUp} size="lg" /></p>
                      )
                    }
                    {receipt && (
                      <div className="border-4 rounded p-2 border-header">
                        <div className="flex justify-between">
                          <p className="font-bold text-offwhite">SUCCESS!</p>
                          <div className="space-x-1">
                            <a target="_blank" className="btn btn-offwhite btn-outline btn-xs" href={'https://solscan.io/tx/' + receipt.txHash + '?cluster=mainnet'}>Solscan</a>
                          </div>
                        </div>
                        <p className="font-bold text-center my-4"><span>{`${receipt.from}`}</span> <FontAwesomeIcon icon={faArrowRight} /> <span>{`${receipt.to}`}</span></p>
                      </div>
                      )
                    }
                  </div>
                  </div>
                </div>
                <NftDownload activeNFT={activeNFT} /> {/* Put here because it requires activeNFT */}
              </div>
              
            ) : ( // Select an NFT first
            <>
              {walletNFTs.walletNFTs.length !== 0 && (
                <p className="text-center py-8 italic">Click on one of your NFTs <FontAwesomeIcon className='animate-bounce' icon={faHandPointUp} size="lg" /></p>
              )}
            </>
            )
            }
          </div>
          ) : ( // Connect your wallet first
            <>
            <div className='mx-auto mt-5'>
              <WalletMultiButton className="btn" />
            </div>
            </>
          )
        }
      </div>
    </div>
  );
};