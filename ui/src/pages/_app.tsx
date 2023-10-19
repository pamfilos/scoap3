import React from "react";
import { ConfigProvider } from "antd";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";

import "@/styles/globals.css";
import theme from "../theme/themeConfig";
import Layout from "@/components/shared/Layout";

interface AppProps {
  Component: any;
  pageProps: any;
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <ConfigProvider theme={theme}>
    <Layout>
      <Head>
        <title>SCOAP3 Repository</title>
      </Head>
      <NextNProgress />
      <Component {...pageProps} />
    </Layout>
  </ConfigProvider>
);

export default App;
