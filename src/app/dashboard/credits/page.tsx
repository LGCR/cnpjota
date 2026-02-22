import { AddCreditsDialog } from "@/components/add-credits-dialog";
import { PaymentStatusAlert } from "@/components/payment-status-alert";
import { TransactionHistory } from "@/components/transaction-history";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AddCreditsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-purple flex items-center justify-center shadow-medium">
                  <img
                    src="/cnpjota.png"
                    alt="CNPJota"
                    className="w-10 h-10 rounded-xl object-cover shadow-medium"
                  />
                </div>
                <span className="text-xl font-bold gradient-text">CNPJota</span>
              </Link>
            </div>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Suspense fallback={null}>
          <PaymentStatusAlert />
        </Suspense>

        <div className="space-y-10">
          <AddCreditsDialog />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}
