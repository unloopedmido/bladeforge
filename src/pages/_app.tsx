import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";

import { api } from "@/utils/api";

import "@radix-ui/themes/styles.css";
import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        enableSystem
        defaultTheme="system"
        disableTransitionOnChange
      >
        <Theme
          accentColor="bronze"
          grayColor="sand"
          radius="large"
          scaling="90%"
          panelBackground="translucent"
        >
          <Component {...pageProps} />
        </Theme>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
