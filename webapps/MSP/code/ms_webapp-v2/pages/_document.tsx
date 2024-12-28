// https://github.com/zeit/next.js#custom-document
// https://github.com/zeit/next.js/blob/master/examples/with-emotion/pages/_document.js
/* eslint-disable no-useless-escape */

import React, { ReactElement } from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <div id="dropdown-root" />
        </body>
      </Html>
    );
  }
}
