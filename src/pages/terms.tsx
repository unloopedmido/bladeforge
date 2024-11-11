import React from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Shield, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TermsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div className="text-muted-foreground space-y-2">{children}</div>
  </div>
);

export default function TermsOfService() {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <ScrollText className="mr-1 h-3 w-3" />
              Legal
            </Badge>
            <h1 className="mb-3 text-4xl font-bold">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using BladeForge
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="border-purple-500/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                BladeForge Terms and Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <TermsSection title="1. Acceptance of Terms">
                <p>
                  By accessing or using BladeForge, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
                </p>
              </TermsSection>

              <TermsSection title="2. Authentication">
                <p>
                  BladeForge uses Discord OAuth for authentication. By logging in, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Allow BladeForge to access your Discord ID, Discord E-Mail and basic profile information</li>
                  <li>Be bound by Discord&apos;s Terms of Service and Privacy Policy</li>
                  <li>Not attempt to bypass or manipulate the authentication system</li>
                  <li>Accept that future authentication methods (such as Google OAuth) may be added</li>
                </ul>
              </TermsSection>

              <TermsSection title="3. Fair Play Policy">
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">Important Notice:</span>
                  </div>
                  <p>
                    The use of fast auto-clickers (More than 5 clicks per second), macros, scripts, bots, or any other automation tools is strictly prohibited. Users found using such tools will be automatically and temporarily banned from the platform. Repeated violations may result in permanent account termination.
                  </p>
                </div>
              </TermsSection>

              <TermsSection title="4. User Content">
                <p>
                  You retain rights to any content you submit, post, or display on BladeForge. By submitting content, you grant us a worldwide, non-exclusive license to use, copy, modify, and distribute your content.
                </p>
              </TermsSection>

              <TermsSection title="5. VIP Membership">
                <ul className="list-disc pl-6 space-y-2">
                  <li>VIP benefits are provided on a subscription basis through Patreon</li>
                  <li>Benefits are activated only while your subscription is active</li>
                  <li>Refunds are handled according to Patreon&apos;s refund policy</li>
                  <li>VIP status is linked to your Discord account</li>
                </ul>
              </TermsSection>

              <TermsSection title="6. Game Modifications">
                <p>
                  We reserve the right to modify, suspend, or discontinue any aspect of BladeForge at any time, including game mechanics, features, and benefits. We will strive to provide reasonable notice of significant changes.
                </p>
              </TermsSection>

              <TermsSection title="7. Data Storage">
                <p>
                  Your game progress and settings are stored and associated with your Discord ID. If you revoke BladeForge&apos;s access to your Discord account, you may lose access to your game data. We recommend connecting with our support team before revoking access if you wish to preserve your progress.
                </p>
              </TermsSection>

              <TermsSection title="8. Limitation of Liability">
                <p>
                  BladeForge is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of our service.
                </p>
              </TermsSection>

              <div className="text-sm text-muted-foreground text-center pt-4">
                <p>Last updated: October 28, 2024</p>
                <p>Contact us at cored.developments@gmail.com with any questions about these terms.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}