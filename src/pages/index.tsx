import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props: any) => {
  return (
    <div>
      <Head>
        <title>Transcendents | Divine Dogs</title>
        <meta
          name="Transcendents | Divine Dogs"
          content="Swap the Traits of your NFTs!"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
