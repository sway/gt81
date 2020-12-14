import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta
          data-hid="description"
          name="description"
          content="GT81 is a personal, web-based version of the in-workout dashboard you can find in BEAT81 classes. It was built by @itshonza in 2020."
        />
        <meta data-hid="author" name="author" content="Jan Ustohal" />
        <meta
          key="title"
          data-hid="og:title"
          property="og:title"
          content="GT81 | by @itshonza"
        />
        <meta
          key="og:description"
          data-hid="og:description"
          property="og:description"
          content="GT81 is a personal, web-based version of the in-workout dashboard you can find in BEAT81 classes. It was built by @itshonza in 2020."
        />
        <meta data-hid="og:type" property="og:type" content="website" />
        <meta
          key="url"
          data-hid="og:url"
          property="og:url"
          content="https://gt81.honza.xyz/"
        />
        <meta
          key="sharing"
          data-hid="og:image"
          property="og:image"
          content="https://gt81.honza.xyz/images/sharing.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@its_honza" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
