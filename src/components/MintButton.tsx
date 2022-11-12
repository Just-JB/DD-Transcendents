import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, TransactionSignature, Connection } from '@solana/web3.js';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { useState } from 'react';

const MintButton = ({currency}) => {
    const [loading, setLoading] = useState(false)
    const { connection } = useConnection();
    const connection1 = new Connection("https://solana-mainnet.g.alchemy.com/v2/BDLQF86L5t8T-Q0dgK5S5w7E-45439Q2")
    const wallet = useWallet();

    const onClick = async () => {
        if (!wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }

        setLoading(true)

        const metaplex = Metaplex.make(connection1).use(walletAdapterIdentity(wallet))

        const candyMachineAddress = new PublicKey("ECa1CLrqdeUXPTwGC7ZJTLxf7d4JaDwenamw4XcS4T44") 

        const cm = await metaplex.candyMachines().findByAddress({ address: candyMachineAddress });        

        if (currency === "SOL") {
            console.log("Minting with $SOL");

            try {
                const res = await metaplex.candyMachines().mint({
                    candyMachine: cm,
                    collectionUpdateAuthority: new PublicKey("8ibbzzBxaH35R8jwKxveGo8mSw1hKRkoUiPvowY8qP6j"),
                    group: cm.candyGuard.groups[0].label
                })            

                notify({ type: 'success', message: "Success", txid: res.response.signature})

                setLoading(false)
            } catch (error) {
                console.log(error);
                
                notify({ type: 'error', message: "Error"})
                setLoading(false)
            }
            
        } else if (currency === "dHALO") {
            console.log("Minting with $dHALO");
            
            try {
                const res = await metaplex.candyMachines().mint({
                    candyMachine: cm,
                    collectionUpdateAuthority: new PublicKey("8ibbzzBxaH35R8jwKxveGo8mSw1hKRkoUiPvowY8qP6j"),
                    group: "P1HALO"
                })            

                notify({ type: 'success', message: "Success", txid: res.response.signature})

                setLoading(false)
            } catch (error) {
                notify({ type: 'error', message: "Error"})
                setLoading(false)
            }
        } else {
            
            try {
                const res = await metaplex.candyMachines().mint({
                    candyMachine: cm,
                    collectionUpdateAuthority: new PublicKey("8ibbzzBxaH35R8jwKxveGo8mSw1hKRkoUiPvowY8qP6j"),
                    group: "day" // change
                }) 

                notify({ type: 'success', message: "Success", txid: res.response.signature})

                setLoading(false)
            } catch (error) {
                console.log(error);
                
                notify({ type: 'error', message: "Error"})
                setLoading(false)
            }
        }
    }

    return (
        <div>
            <button
                className={"px-8 m-2 btn btn-block border-0 bg-button hover:from-pink-500 hover:to-yellow-500 " + (loading && " loading")}
                onClick={() => onClick()}
            >
                <span>Mint</span>
            </button>
        </div>
    );
};

export default MintButton;
