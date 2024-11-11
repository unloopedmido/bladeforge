import "@/styles/globals.css";
import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import { Montserrat } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar";
import Head from "next/head";
import Footer from "@/components/footer";

const MontserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      <Head>
        <title>BladeForge - Your Idle Factory</title>
        <meta name="google-adsense-account" content="ca-pub-1225793953305332" />
        <meta
          name="title"
          content="BladeForge - Forge Swords and Upgrade Your Luck in This Idle Factory Game"
        />
        <meta
          name="description"
          content="BladeForge is a web-based idle game where you forge unique swords, upgrade your luck, and dominate the leaderboards. Start your bladesmithing adventure today!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cored.studio/" />
        <meta
          property="og:title"
          content="BladeForge - Forge Swords and Upgrade Your Luck in This Idle Factory Game"
        />
        <meta
          property="og:description"
          content="BladeForge is a web-based idle game where you forge unique swords, upgrade your luck, and dominate the leaderboards. Start your bladesmithing adventure today!"
        />
        <meta
          property="og:image"
          content="https://cdn.discordapp.com/attachments/983379763857072149/999014212888182906/CoredINCpfp.png?ex=6705747d&is=670422fd&hm=108974efd45b9877a9de0fc69086f7f19956adb107d8f971052edbaac801e786&"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cored.studio" />
        <meta
          property="twitter:title"
          content="BladeForge - Forge Swords and Upgrade Your Luck in This Idle Factory Game"
        />
        <meta
          property="twitter:description"
          content="BladeForge is a web-based idle game where you forge unique swords, upgrade your luck, and dominate the leaderboards. Start your bladesmithing adventure today!"
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
        <div className={MontserratFont.className}>
          <div className="flex h-full min-h-screen flex-col">
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </div>
          <Toaster richColors />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
