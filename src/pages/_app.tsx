import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      <Head>
        <title>BladeForge - Your Idle Factory</title>
        <meta name="title" content="BladeForge - Your Idle Factory" />
        <meta
          name="description"
          content="Generate and sell swords in BladeForge, an exciting idle factory web-based game. Upgrade your luck and explore unique sword properties!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cored.studio/" />
        <meta property="og:title" content="BladeForge - Your Idle Factory" />
        <meta
          property="og:description"
          content="Generate and sell swords in BladeForge, an exciting idle factory web-based game. Upgrade your luck and explore unique sword properties!"
        />
        <meta
          property="og:image"
          content="https://cdn.discordapp.com/attachments/983379763857072149/999014212888182906/CoredINCpfp.png?ex=6705747d&is=670422fd&hm=108974efd45b9877a9de0fc69086f7f19956adb107d8f971052edbaac801e786&"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cored.studio" />
        <meta
          property="twitter:title"
          content="BladeForge - Your Idle Factory"
        />
        <meta
          property="twitter:description"
          content="Generate and sell swords in BladeForge, an exciting idle factory web-based game. Upgrade your luck and explore unique sword properties!"
        />
        <meta
          property="twitter:image"
          content="https://cdn.discordapp.com/attachments/983379763857072149/999014212888182906/CoredINCpfp.png?ex=6705747d&is=670422fd&hm=108974efd45b9877a9de0fc69086f7f19956adb107d8f971052edbaac801e786&"
        />
        <meta name="theme-color" content="#FFB0FF" />{" "}
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <div className={GeistSans.className}>
          <div className="flex flex-col min-h-screen h-full">
            <Navbar />
            <Component {...pageProps} />
          </div>
          <Toaster richColors />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
