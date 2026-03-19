"use client";

import BenefitsSection from "@/component/register/benifits";
import ProviderForm from "@/component/register/form";
import HelpSection from "@/component/register/help";
import HeroSection from "@/component/register/herosection";

import { createClient } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { useAuth } from "../context/authcontext";

// ✅ Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ProviderAuthPage: React.FC = () => {
  const [view, setView] = useState<"register" | "login">("register");
  const [loginStep, setLoginStep] = useState<"mobile" | "otp">("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const { loginProvider } = useAuth();
  const router = useRouter();

// inside ProviderAuthPage component
const [loadingMessage, setLoadingMessage] = useState("");
const [showLoading, setShowLoading] = useState(false);

// ✅ Send OTP only if number exists in Supabase
const handleSendOTP = async () => {
  if (mobileNumber.length !== 10) {
    alert("⚠️ Please enter a valid 10-digit mobile number.");
    return;
  }

  try {
    setShowLoading(true);
    setLoadingMessage("Checking your number...");

    const { data, error } = await supabase
      .from("providers")
      .select("id, providername")
      .eq("contactphone", mobileNumber)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      setShowLoading(false);
      alert("❌ This number is not registered. Please register first.");
      return;
    }

    // ✅ Mock OTP flow
    setLoadingMessage("Sending OTP...");
    await new Promise((r) => setTimeout(r, 1000)); // simulate delay

    setShowLoading(false);
    setLoginStep("otp");
  } catch (err) {
    console.error("Error sending OTP:", err);
    setShowLoading(false);
    alert("⚠️ Error connecting to the server. Please try again.");
  }
};



  // OTP input handling
  const handleOtpChange = (i: number, val: string) => {
    if (val.length <= 1 && /^\d*$/.test(val)) {
      const newOtp = [...otp];
      newOtp[i] = val;
      setOtp(newOtp);
      if (val && i < otp.length - 1)
        document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      document.getElementById(`otp-${i - 1}`)?.focus();
  };

  // ✅ Verify mock OTP
const handleVerifyOTP = async () => {
  const enteredOtp = otp.join("");
  if (enteredOtp !== "123456") {
    alert("❌ Invalid OTP. Please try 123456 for demo.");
    return;
  }

  try {
    setShowLoading(true);
    setLoadingMessage("Verifying your login...");

    const { data, error } = await supabase
      .from("providers")
      .select("id, providername, contactphone")
      .eq("contactphone", mobileNumber)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      setShowLoading(false);
      alert("❌ This number is not registered.");
      return;
    }

    // ✅ Save session
    localStorage.setItem("loggedInPhone", data.contactphone);
    localStorage.setItem("loggedInProviderId", data.id.toString());
    localStorage.setItem("loggedInProviderName", data.providername || "");

    loginProvider({
      id: data.id,
      name: data.providername,
      phone: data.contactphone,
    });

    // ✅ Navigate home
    setLoadingMessage("Login successful! Redirecting...");
    await new Promise((r) => setTimeout(r, 800));
    setShowLoading(false);
    router.push("/");
  } catch (err) {
    console.error("Verify OTP Error:", err);
    setShowLoading(false);
    alert("❌ Something went wrong while verifying your login.");
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {view === "register" ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* ✅ REGISTER PAGE */}
            <HeroSection />
            <BenefitsSection />
            <ProviderForm />
            <HelpSection />

            {/* Bottom Navigation */}
            <div className="text-center py-8 bg-white border-t">
              <p className="text-gray-700 text-base md:text-lg">
                Already have an account?{" "}
                <button
                  onClick={() => setView("login")}
                  className="text-[#a72c3e] font-semibold hover:underline"
                >
                  Login Here
                </button>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* ✅ LOGIN PAGE */}
            <div className="min-h-screen bg-gradient-to-br from-[#a72c3e] to-[#6b1b2a] py-20">
              <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  {/* Info Section */}
                  <div className="text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-lg text-white/90 mb-8">
                      Login to manage your Jain Event Services and connect with
                      customers.
                    </p>
                    <ul className="space-y-4 text-white/80">
                      <li>✓ Manage bookings and availability</li>
                      <li>✓ Update your profile and pricing</li>
                      <li>✓ Track earnings and performance</li>
                    </ul>
                  </div>

                  {/* Login Card */}
                  <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#a72c3e] to-[#8b2332] rounded-full mb-4 shadow-lg">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Provider Login
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600">
                        Use your registered mobile number
                      </p>
                    </div>

                    {loginStep === "mobile" ? (
                      <>
                        <label className="block text-sm font-semibold mb-3 text-[#a72c3e]">
                          Mobile Number
                        </label>
                        <div className="relative mb-6">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#fef3f4] w-10 h-10 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-[#a72c3e]" />
                          </div>
                          <input
                            type="tel"
                            maxLength={10}
                            value={mobileNumber}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setMobileNumber(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="98765 43210"
                            className="w-full pl-16 pr-4 py-3 sm:py-4 border-2 border-[#fbbf24] rounded-xl text-base sm:text-lg font-medium focus:border-[#a72c3e] focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleSendOTP}
                          disabled={isLoading}
                          className="w-full py-4 bg-gradient-to-r from-[#a72c3e] to-[#8b2332] text-white font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {isLoading ? "Checking..." : "Send OTP"}{" "}
                          {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                      </>
                    ) : (
                      <>
                        <label className="block text-sm font-semibold mb-2 text-[#a72c3e]">
                          Enter OTP
                        </label>
                        <p className="text-sm text-gray-700 mb-4">
                          Sent to +91 {mobileNumber}
                        </p>

                        <div className="flex gap-2 justify-center mb-6">
                          {otp.map((digit, i) => (
                            <input
                              key={i}
                              id={`otp-${i}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleOtpChange(i, e.target.value)
                              }
                              onKeyDown={(e) => handleKeyDown(i, e)}
                              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl focus:outline-none"
                              style={{
                                borderColor: digit ? "#a72c3e" : "#fbbf24",
                                backgroundColor: "#fffbeb",
                                color: "#a72c3e",
                              }}
                            />
                          ))}
                        </div>

                        <button
                          onClick={handleVerifyOTP}
                          className="w-full py-4 bg-gradient-to-r from-[#a72c3e] to-[#8b2332] text-white font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                        >
                          Verify & Login <ArrowRight className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => setLoginStep("mobile")}
                          className="w-full mt-4 text-[#a72c3e] font-semibold hover:bg-[#fef3f4] rounded-lg py-2 transition"
                        >
                          ← Change Number
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Text for Navigation */}
                <div className="text-center pt-10">
                  <p className="text-white text-lg">
                    New to Jain Events?{" "}
                    <button
                      onClick={() => setView("register")}
                      className="font-semibold underline hover:text-yellow-300 transition"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderAuthPage;
