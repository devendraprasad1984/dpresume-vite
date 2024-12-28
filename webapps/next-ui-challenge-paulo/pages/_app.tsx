import React from "react";
import { AppContext, AppInitialProps, AppProps } from "next/app";
import Head from "next/head";
import { NextComponentType } from "next";
import MainAppLayout from "./mainAppLayout";

import "../styles/app.css";
import "../styles/common.css";
import "../styles/app.media.css";

import ReactAppContext, { initAppData } from "../context/appContext";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
  Component,
  pageProps,
}) => {
  const appLevelData = initAppData();
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5d52b1" />
        <meta name="application-TileColor" content="#5d52b1" />
        <meta name="theme-color" content="#ffffff" />
        <title>Devendra Prasad</title>
      </Head>
      {/*this is out root component, and all pages will applies with changes here*/}
      <ReactAppContext.Provider value={appLevelData}>
        <MainAppLayout>
          <Component {...pageProps} />
        </MainAppLayout>
      </ReactAppContext.Provider>
    </>
  );
};

export default MyApp;
