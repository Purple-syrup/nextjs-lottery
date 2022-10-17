import Head from "next/head";
import styles from "../styles/Home.module.css";
// import ManualHeader from "../components/ManualHeader";

import Header from "../components/Header";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart contract lottery</title>
                <meta name="description" content="Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <ManualHeader/> */}
            <Header/>
            hello!
            {/* // header connect button nav bar */}
        </div>
    );
}
