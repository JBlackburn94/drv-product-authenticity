"use client";
import { useState } from "react";
import supabase from "../lib/supabase";
import Image from "next/image";
import drvLogo from "../public/DRV-Logo.webp";

export default function Home() {
  const [code, setCode] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [inputCount, setInputCount] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseMessage("");

    const { data, error } = await supabase
      .from("authenticity_codes")
      .select("id, code, input_count")
      .eq("code", code)
      .single();

    if (error || !data) {
      setResponseMessage("Code not found!");
      return;
    }

    const { error: updateError } = await supabase
      .from("authenticity_codes ")
      .update({ input_count: data.input_count + 1 })
      .eq("id", data.id);

    if (updateError) {
      setResponseMessage("Something went wrong whilst updating.");
      return;
    }

    setInputCount(data.input_count + 1);
    setResponseMessage("Code is valid 🎉!");
  };

  return (
    <main className="flex flex-col md:flex-row gap-8 h-screen w-full p-8 border border-green">
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-black mb-6">Product Authenticator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-code" className="block font-medium">
              Enter your code
            </label>
            <input
              type="text"
              id="auth-code"
              name="auth-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ABC1234"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition"
          >
            Check Code
          </button>
        </form>
        {responseMessage && (
          <p
            className={`mt-4 text-center ${
              responseMessage.includes("Code not found")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {responseMessage}
          </p>
        )}
        {inputCount !== null && !responseMessage.includes("Code not found") && (
          <p className="mt-4 text-center">
            Code has been entered <strong>{inputCount}</strong>{" "}
            {inputCount === 1 ? "time" : "times"}.
          </p>
        )}
      </div>
      <div className="flex-1">
        <Image src={drvLogo} alt="Dr Vapes logo." priority />
        <div className="p-6">
          <h2 className="text-xl font-semibold">How it works?</h2>
          <p className="text-gray-700">
            The Product Authenticity Tracker allows you to verify the
            authenticity of your product by entering a unique code provided with
            your purchase. If the code is valid, we will increment the count
            each time the code is checked. This feature ensures that the product
            you're purchasing is genuine and gives you the peace of mind that
            you're buying a verified product.
          </p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Where to find your code?</h3>
            <p>
              On your bottle, locate the scratch label and remove the outer
              film. Your code will be beneath this.
            </p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Why use this tool?</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Verify the authenticity of your purchase</li>
              <li>Ensure peace of mind with your product</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
