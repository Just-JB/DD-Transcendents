import type { NextPage } from "next";
import Head from "next/head";
import { MintView } from "../views";

const MintPage: NextPage = (props: any) => {
  return (
    <div>
      <Head>
        <title>Transcendents Mint</title>
        <meta
          name="Mint a Transcendent NFT"
          content="Divine Dogs"
        />
      </Head>
      <MintView />
    </div>
  );
};

export default MintPage;