import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Download, AlertTriangle, Check, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import RoompeerFooter from "@/components/roompeer/RoompeerFooter";
import SEOHelmet from "@/components/seo/SEOHelmet";

// Mock data - in production this would come from your backend/Stripe
const mockBillingData = {
  currentPlan: "pro", // "free" or "pro"
  renewalDate: "2025-01-08",
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2026,
  },
  billingHistory: [
    { id: "inv_001", date: "2024-12-08", amount: 9.99, status: "paid", description: "Roompeer Pro - Monthly" },
    { id: "inv_002", date: "2024-11-08", amount: 9.99, status: "paid", description: "Roompeer Pro - Monthly" },
    { id: "inv_003", date: "2024-10-08", amount: 9.99, status: "paid", description: "Roompeer Pro - Monthly" },
  ],
};

const RoompeerBilling = () => {
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [billingData] = useState(mockBillingData);

  const isPro = billingData.currentPlan === "pro";

  const proFeatures = [
    "Unlimited swipes",
    "See who likes you",
    "Advanced filters",
    "Profile boost",
    "Read receipts",
    "Incognito mode",
    "Priority support",
  ];

  const handlePauseSubscription = () => {
    // In production, this would call your backend
    console.log("Pausing subscription...");
    setCancelDialogOpen(false);
  };

  const handleCancelSubscription = () => {
    // In production, this would call your backend
    console.log("Cancelling subscription...");
    setCancelDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-body">
      <SEOHelmet
        title="Billing Settings | Roompeer"
        description="Manage your Roompeer subscription, payment methods, and billing history."
      />
      <RoompeerNavbar />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-youngNight hover:text-azul"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-youngNight mb-8">
          Billing & Subscription
        </h1>

        <div className="space-y-8">
          {/* Current Plan */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-youngNight flex items-center gap-3">
                Current Plan
                {isPro && (
                  <Badge className="bg-azul text-white">PRO</Badge>
                )}
              </CardTitle>
              <CardDescription className="font-body">
                Manage your subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isPro ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-heading text-2xl font-bold text-youngNight">
                        Roompeer Pro
                      </p>
                      <p className="text-muted-foreground">€9.99/month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Next billing date</p>
                      <p className="font-semibold text-youngNight">
                        {new Date(billingData.renewalDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/roompeer-pricing")}
                      className="border-azul text-azul hover:bg-azul hover:text-white"
                    >
                      Change Plan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="font-heading text-2xl font-bold text-youngNight">
                      Free Plan
                    </p>
                    <p className="text-muted-foreground">
                      Limited features - upgrade to unlock more
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/roompeer-pricing")}
                    className="bg-azul hover:bg-azul/90 text-white"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          {isPro && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-youngNight flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription className="font-body">
                  Your saved payment information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-youngNight">
                        {billingData.paymentMethod.brand} •••• {billingData.paymentMethod.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-azul text-azul hover:bg-azul hover:text-white">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing History */}
          {isPro && billingData.billingHistory.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-youngNight">
                  Billing History
                </CardTitle>
                <CardDescription className="font-body">
                  Your past invoices and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-heading">Date</TableHead>
                      <TableHead className="font-heading">Description</TableHead>
                      <TableHead className="font-heading">Amount</TableHead>
                      <TableHead className="font-heading">Status</TableHead>
                      <TableHead className="font-heading text-right">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingData.billingHistory.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-body">
                          {new Date(invoice.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="font-body">{invoice.description}</TableCell>
                        <TableCell className="font-body">€{invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-azul hover:text-azul/80">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Cancel Subscription */}
          {isPro && (
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-youngNight flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Cancel Subscription
                </CardTitle>
                <CardDescription className="font-body">
                  We'd hate to see you go
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 font-body">
                  If you cancel, you'll lose access to all Pro features at the end of your billing period.
                </p>
                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      Cancel Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-youngNight">
                        Are you sure you want to cancel?
                      </DialogTitle>
                      <DialogDescription className="font-body">
                        You'll lose access to these Pro features:
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      <ul className="space-y-2">
                        {proFeatures.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-muted-foreground font-body">
                            <X className="h-4 w-4 text-destructive" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <p className="font-semibold text-youngNight mb-2 flex items-center gap-2">
                        <Pause className="h-4 w-4 text-azul" />
                        Consider pausing instead?
                      </p>
                      <p className="text-sm text-muted-foreground font-body">
                        Take a break without losing your Pro benefits. You can resume anytime.
                      </p>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                      <Button
                        variant="outline"
                        onClick={handlePauseSubscription}
                        className="border-azul text-azul hover:bg-azul hover:text-white w-full sm:w-auto"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Subscription
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleCancelSubscription}
                        className="w-full sm:w-auto"
                      >
                        Yes, Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <RoompeerFooter />
    </div>
  );
};

export default RoompeerBilling;