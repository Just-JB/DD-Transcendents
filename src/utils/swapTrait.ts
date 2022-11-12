import { ConnectionContext, WalletContextState, WalletContext } from "@solana/wallet-adapter-react"
import { Transaction, TransactionInstruction, PublicKey, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import {ShdwDrive} from "@shadow-drive/sdk";
import _ from "lodash";
import { NodeWallet } from "@metaplex/js";
import * as token from "@solana/spl-token";
import { Nft, NftWithToken, Sft, SftWithToken } from '@metaplex-foundation/js';

export const swapTrait = async(previewTrait: string, traitReference: string, activeNFT: (Nft | Sft | SftWithToken | NftWithToken), wallet: WalletContextState, connection: Connection) => {

    const shdwAuthority = Keypair.fromSecretKey(Uint8Array.from(
        JSON.parse(process.env.NEXT_PUBLIC_SHDWAUTH)
    ))

    const signerWallet = new NodeWallet(shdwAuthority)

    const connection1 = new Connection("https://solana-mainnet.g.alchemy.com/v2/BDLQF86L5t8T-Q0dgK5S5w7E-45439Q2")
        
    const from = activeNFT.json.attributes[_.findIndex(activeNFT.json.attributes, { "trait_type": traitReference })].value   
    const to = previewTrait;
    const memo = `Switching ${traitReference} from ${from} to ${to}`;

    let metadataJson = activeNFT.json;

    // Init Inventory array
    if (!metadataJson.inventory) {
        metadataJson.inventory = [];
    }

    // Check if swapped trait is owned already
    if (metadataJson.inventory[_.findIndex(metadataJson.inventory, { "trait_type": traitReference })]?.value === to) {
        console.log("Remove from inventory");
        // @ts-ignore
        metadataJson.inventory.splice(_.findIndex(metadataJson.inventory, { "trait_type": traitReference }));
    }

    // update actual attribute
    metadataJson.attributes[_.findIndex(metadataJson.attributes, { "trait_type": traitReference })].value = to;    

    // @ts-ignore
    metadataJson.inventory.push({
        trait_type: traitReference,
        value: from
    })    

    const name = activeNFT.uri.split('/').slice(-1)[0];

    const blob = new Blob([JSON.stringify(metadataJson)], { type: "application/json" });
    const file = new File([blob], name)

    const shdwAccount = new PublicKey("EDGh65M3bJYjdPbYx9BSP63VeMwwba15V9NryiMwr7A");

    // Setting up transaction

    const tx = new Transaction()

    const toAccount = new PublicKey("8ibbzzBxaH35R8jwKxveGo8mSw1hKRkoUiPvowY8qP6j")

    tx.add(new TransactionInstruction({
        keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(memo, 'utf8'),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
    }))

    tx.add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: toAccount,
            lamports: 0.05 * LAMPORTS_PER_SOL
        })
    )

    // tx.add(
    //     token.Token.createTransferCheckedInstruction(
    //         token.TOKEN_PROGRAM_ID,
    //         wallet.publicKey,
    //         token.NATIVE_MINT,
    //         toAccount,
    //         wallet.publicKey,
    //         [],
    //         0.05 * LAMPORTS_PER_SOL,
    //         9
    //     )
    // )

    try {
        const drive = await new ShdwDrive(connection1, signerWallet).init();

        const blockhash = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash.blockhash,
        tx.feePayer = wallet.publicKey,

        await wallet.signTransaction(tx);

        const sig = await connection.sendRawTransaction(tx.serialize());

        const confirmation = await connection.confirmTransaction({
                signature: sig,
                blockhash: blockhash.blockhash,
                lastValidBlockHeight: blockhash.lastValidBlockHeight,
        })

        if (confirmation.value.err === null) {
            const res = await drive.editFile(shdwAccount, activeNFT.uri, file, 'v2');

            return {txHash: sig, traitReference, from, to}

        } else {
            console.log("Swapping failed");
            
        }

    } catch (error) {
        console.log(error);        
    }
}