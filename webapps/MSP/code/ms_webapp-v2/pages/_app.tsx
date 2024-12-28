import React, {useEffect, ReactElement} from "react";
import {observer} from "mobx-react-lite";
import {NextComponentType} from "next";
import Head from "next/head";
import {AppContext, AppInitialProps, AppProps} from "next/app";
import {Auth0Provider} from "@auth0/auth0-react";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";

import "../styles/globals.scss";
import "../styles/datePickerStyleOverride.scss";
import "../components/stream/styles/index.scss";

import isBrowser from "../utils/is-browser";
import {CustomToastContainer} from "../components/core/Toast";
import appEnvConstants from "../services/app-env-constants";

Modal.setAppElement("#__next");

const auth0Config = {
    domain: appEnvConstants.auth0.domain,
    clientId: appEnvConstants.auth0.clientId,
    redirectUri: appEnvConstants.auth0.redirectURI,
    audience: appEnvConstants.auth0.audience,
    scope: appEnvConstants.auth0.scope,
};

interface Props {
    Component: any;
    pageProps: any;
}

const MyApp: NextComponentType<AppContext, AppInitialProps, AppProps> =
    observer(({Component, pageProps}: Props): ReactElement => {
        useEffect(() => {
            if (isBrowser) {
                // Focus
                require("focus-visible");
            }
        }, []);

        return (
            <>
                <Head>
                    <meta charSet="utf-8"/>
                    <meta
                        name="viewport"
                        content="initial-scale=1.0, width=device-width"
                    />
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
                    <link rel="manifest" href="/site.webmanifest"/>
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5d52b1"/>
                    <meta name="msapplication-TileColor" content="#5d52b1"/>
                    <meta name="theme-color" content="#ffffff"/>
                    <title>MSP</title>
                </Head>
                <Auth0Provider {...auth0Config}>
                    <CustomToastContainer/>
                    <Component {...pageProps} />
                </Auth0Provider>
            </>
        );
    });

export default MyApp;
