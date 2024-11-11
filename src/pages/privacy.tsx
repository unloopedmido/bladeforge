import React from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PrivacySection = ({
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

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Eye className="mr-1 h-3 w-3" />
              Privacy
            </Badge>
            <h1 className="mb-3 text-4xl font-bold">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Your privacy is important to us. Please review our practices
              regarding your data and personal information.
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="border-green-500/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-500" />
                BladeForge Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <PrivacySection title="1. Data Collection">
                <p>
                  We collect information necessary for authentication and game functionality. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Discord ID, Discord Email, and basic profile information</li>
                  <li>Game progress data linked to your Discord account</li>
                  <li>Other data you voluntarily provide through support requests or feedback</li>
                </ul>
              </PrivacySection>

              <PrivacySection title="2. Use of Data">
                <p>
                  Collected data is used to personalize your experience and maintain your game progress. We may also use your data to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Improve gameplay and add new features</li>
                  <li>Offer support and communicate important updates</li>
                  <li>Comply with legal obligations and prevent unauthorized access</li>
                </ul>
              </PrivacySection>

              <PrivacySection title="3. Data Sharing">
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Important Notice:</span>
                  </div>
                  <p>
                    We do not sell or share your data with third parties for marketing purposes. However, we may share information with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Third-party providers (e.g., Discord) as necessary for authentication</li>
                    <li>Law enforcement if required by law or to protect BladeForge and its users</li>
                  </ul>
                </div>
              </PrivacySection>

              <PrivacySection title="4. Data Storage & Security">
                <p>
                  Your data is stored securely and is linked to your Discord account. If you choose to revoke BladeForge’s access, your game progress may be permanently deleted. We use industry-standard practices to protect your data but cannot guarantee absolute security.
                </p>
              </PrivacySection>

              <PrivacySection title="5. User Rights">
                <p>
                  You have the right to access, update, or delete your data. To do so, please reach out to our support team at cored.developments@gmail.com. Note that deleting your data may affect your ability to use BladeForge.
                </p>
              </PrivacySection>

              <PrivacySection title="6. Changes to This Policy">
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices. We will notify you of significant updates, and your continued use of BladeForge signifies acceptance of any changes.
                </p>
              </PrivacySection>

              <div className="text-sm text-muted-foreground text-center pt-4">
                <p>Last updated: October 28, 2024</p>
                <p>Contact us at cored.developments@gmail.com with any questions about this policy.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
