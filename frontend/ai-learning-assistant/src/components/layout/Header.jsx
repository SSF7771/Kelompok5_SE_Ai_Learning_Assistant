import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Bell,
  User,
  Menu,
  CreditCard,
  Plus,
  X,
  Sparkles,
  Coins,
} from "lucide-react";
import { createStripeCheckoutSession, claimTokens } from "../../services/stripeService.js";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const Header = ({ toggleSidebar }) => {
  const { user, refreshProfile } = useAuth();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [loadingPackage, setLoadingPackage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Create a ref flag to prevent duplicate runs
  const hasClaimedTokensRef = useRef(false);

  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const tokensToAdd = searchParams.get('tokens');

    const grantTokens = async () => {
      if (hasClaimedTokensRef.current) 
        return;

      try {
        if (paymentSuccess === 'true' && tokensToAdd) {
          // Lock it IMMEDIATELY before any async operation starts
          hasClaimedTokensRef.current = true;

          // Add the tokens to the database
          await claimTokens(tokensToAdd);
          
          // Fetch fresh user profile (to update the token balance)
          if (refreshProfile) 
            await refreshProfile();
          
          toast.success(`Successfully added ${tokensToAdd} tokens!`);

          // Clear the query parameters from the URL so it doesn't trigger twice
          setSearchParams({});
        }
      } catch (err) {
        console.error("Failed to grant tokens:", err);
        toast.error("Failed to credit tokens to your account.");
        hasClaimedTokensRef.current = false;
      }
    };

    grantTokens();
  }, [searchParams, setSearchParams, refreshProfile]);

  // Token packages & deals
  const tokenPackages = [
    {
      id: "starter",
      name: "Starter Pack",
      tokens: 50,
      priceInUSD: 200,
      displayPrice: "$2.00",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro Booster",
      tokens: 135,
      priceInUSD: 500,
      displayPrice: "$5.00",
      popular: true,
      savings: "Save 15%",
    },
    {
      id: "ultimate",
      name: "Ultimate Mega Pack",
      tokens: 225,
      priceInUSD: 1500,
      displayPrice: "$15.00",
      popular: false,
      savings: "Save 30%",
    },
  ];

  // Function to handle Stripe Top-up in IDR
  const handleTopUp = async (tokenAmount, priceInUSD, packageId) => {
    try {
      setLoadingPackage(packageId);

      const data = await createStripeCheckoutSession(tokenAmount, priceInUSD);

      if (data?.url) window.location.href = data.url;
      else {
        alert("Failed to initialize payment gateway.");
        setLoadingPackage(null);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message || "Something went wrong.");
      setLoadingPackage(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center justify-between h-full px-6">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={toggleSidebar}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:block"></div>

          <div className="flex items-center gap-3">
            <button className="relative inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
              <Bell
                size={20}
                strokeWidth={2}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* USER PROFILE */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200/60">
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors duration-200 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-200">
                  <User size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.email || "user@gamil.com"}
                  </p>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Coins size={15} strokeWidth={3} color="orange" />
                    <p className="text-xs font-medium text-slate-600">
                      <span className="font-bold text-slate-900">
                        {user?.tokens || 0}
                      </span>{" "}
                      Tokens
                    </p>
                    <button
                      onClick={() => setIsTopUpOpen(true)}
                      className="inline-flex items-center justify-center w-4 h-4 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white rounded-full transition-all duration-200 shadow-sm"
                      title="Top up tokens"
                    >
                      <Plus size={10} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TOP-UP MODAL */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Top Up AI Tokens
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose a deal to fuel your workflow instantly
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Packages Choices */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {tokenPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
                    pkg.popular
                      ? "border-blue-500 bg-blue-50/20 shadow-lg shadow-blue-500/5 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {pkg.name}
                      </h4>
                      {pkg.savings && (
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {pkg.savings}
                        </span>
                      )}
                    </div>

                    <div className="my-4">
                      <span className="text-2xl font-extrabold text-slate-900">
                        {pkg.tokens}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">
                        Tokens
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mb-6">
                      {pkg.displayPrice} USD
                    </div>
                  </div>

                  <button
                    disabled={loadingPackage !== null}
                    onClick={() => handleTopUp(pkg.tokens, pkg.priceInUSD, pkg.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    } ${loadingPackage !== null ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loadingPackage === pkg.id ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <CreditCard size={14} />
                        Select Deal
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                Secure payments processed securely via Stripe. Tokens will be
                instantly credited to your account upon success.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
