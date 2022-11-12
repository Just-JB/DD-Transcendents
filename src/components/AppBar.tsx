import { FC } from 'react';
import Link from 'next/link';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const AppBar: FC = (props: any) => {
  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex flex-row md:mb-2 shadow-lg">
        <div className="navbar-start">

          <label htmlFor="my-drawer" className="md:hidden btn btn-square btn-ghost">

            <svg className="inline-block w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
          
          {/* TODO: Change Logo styles + maybe add text next to it */}
          <div className="inline w-22 h-22 md:p-2">
            <img
                src="/logo-transparent.png"
                width="60"
                height="60"
                alt="OceanGuardians NFT"
              />
          </div>
        </div>

        <div className="hidden md:inline md:navbar-center">
          <div className="flex items-stretch space-x-2">
            <Link href="/">
              <a className="btn bg-lighter text-text font-bold border-0 btn-sm rounded-btn hover:bg-body drop-shadow">Home</a>
            </Link>
            <Link href="/mint">
              <a className="btn bg-lighter text-text font-bold border-0 btn-sm rounded-btn hover:bg-body drop-shadow">Mint</a>
            </Link>
          </div>
        </div>

        {/* Wallet & Settings */}
        <div className="navbar-end">
          <WalletMultiButton className="btn mr-1" />
        </div>
      </div>
      {props.children}
    </div>
  );
};
