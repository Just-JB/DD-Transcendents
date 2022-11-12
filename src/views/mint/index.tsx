import { FC, useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import useUserSOLBalanceStore from "stores/useUserSOLBalanceStore";
import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex, CandyMachine } from "@metaplex-foundation/js";
import styled from "styled-components";
import { Paper, Chip, FormControl, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { toDate } from "utils/nfts";
import MintButton from "components/MintButton";
import Countdown from "react-countdown";

const Card = styled(Paper)`
  display: inline-block;
  background-color: #3F8190 !important;
  margin: 5px;
  min-width: 40px;
  padding: 24px;
  color: #ffff !important;

  h1 {
    margin: 0px;
    color: #fff;
    font-size: bold;
  }
`;

const Price = styled(Chip)`
  position: absolute;
  margin: 12px;
  font-weight: bold;
  font-size: 1.2em !important;
  font-family: "Mont-Light", sans-serif !important;
  background: #F3E8CB !important;
  color: #34275D !important;
`;

export const MintView: FC = ({ }) => {
    const [isActive, setIsActive] = useState(false);
    const [radioValue, setRadioValue] = useState("SOL")
    const [candyMachine, setCandyMachine] = useState<CandyMachine>();    

    const wallet = useWallet();
    const { connection } = useConnection();
    const connection1 = new Connection("https://solana-mainnet.g.alchemy.com/v2/BDLQF86L5t8T-Q0dgK5S5w7E-45439Q2")

    const balance = useUserSOLBalanceStore((s) => s.balance);
    const { getUserSOLBalance } = useUserSOLBalanceStore();

    // useEffect(() => {
    //     const fetchCandyMachine = async () => {
    //     const metaplex = Metaplex.make(connection1);
    //     const candyMachine = await metaplex.candyMachines().findByAddress({
    //         address: new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE),
    //     });

    //     setCandyMachine(candyMachine);
    //     };

    //     if (wallet.publicKey) {
    //     console.log(wallet.publicKey.toBase58());
    //     getUserSOLBalance(wallet.publicKey, connection);
    //     fetchCandyMachine();
    //     }
    // }, [wallet.publicKey, connection, getUserSOLBalance]);

    const renderGoLiveDateCounter = ({ days, hours, minutes, seconds }: any) => {
        return (
        <div>
            <Card elevation={1}>
            <h1>{days}</h1>Days
            </Card>
            <Card elevation={1}>
            <h1>{hours}</h1>
            Hours
            </Card>
            <Card elevation={1}>
            <h1>{minutes}</h1>Mins
            </Card>
            <Card elevation={1}>
            <h1>{seconds}</h1>Secs
            </Card>
        </div>
        );
    };

    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <div className="max-w-md mx-auto bg-lighter rounded-md p-6 my-2">
                    <h1 className="text-center mb-4 font-bold font-black-mustang text-6xl font-black">
                        Mint Your Transcendent
                    </h1>
                    <div className="relative">
                        <Price label={"2.25 SOL"} /> {/* Update for Phase 2 */}
                        <img className="rounded-md" src="/transcendents.gif" />
                    </div>
                    <p className="font-bold text-xl pt-4 text-center">Mint is paused</p>
                    <div>
                        {candyMachine?.candyGuard && (
                        <>
                            {!isActive ? (
                            <div className="text-center mt-4 ">
                                <Countdown
                                date={toDate(
                                    candyMachine?.candyGuard.guards.startDate.date
                                )}
                                onComplete={() => {
                                    setIsActive(true);
                                }}
                                renderer={renderGoLiveDateCounter}
                                onMount={() => {
                                    if (
                                    toDate(
                                        candyMachine?.candyGuard.guards.startDate.date
                                    ) > new Date()
                                    ) {
                                    setIsActive(false);
                                    } else {
                                    setIsActive(true);
                                    }
                                }}
                                />
                                <p className="font-bold text-xl">Until Phase 2</p>
                            </div>
                            ) : (
                            <>
                                {/* <p className="text-center m-2">
                                Total Minted:{" "}
                                <span className="text-lg font-bold">
                                    {candyMachine.itemsMinted?.toNumber()} /{" "}
                                    {candyMachine?.itemsLoaded}
                                </span>
                                </p> */}
                                <div className="text-center">
                                {false && ( // Change for phase 2
                                    <FormControl>
                                        <RadioGroup row value={radioValue} onChange={(e: any) => setRadioValue(e.target.value)}>
                                            <p className="mt-2 mr-2 font-bold">Pay with</p>
                                            <FormControlLabel value="SOL" control={<Radio color="default" />} label="SOL" />
                                            <FormControlLabel value="dHALO" control={<Radio color="default" />} label="dHALO" />
                                        </RadioGroup>
                                    </FormControl>
                                )}
                                
                                {/* <MintButton currency={"other"} /> */}
                                {/* {wallet.publicKey && <p>Public Key: {wallet.publicKey.toBase58()}</p>} */}
                                {wallet && (
                                    <p>SOL Balance: {(balance || 0).toLocaleString()}</p>
                                )}
                                </div>
                            </>
                            )}
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}