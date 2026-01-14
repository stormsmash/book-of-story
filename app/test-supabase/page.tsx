"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabase() {
  const [status, setStatus] = useState<string>("Testing connection...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data: insertData, error: insertError } = await supabase
          .from("test_connection")
          .insert([
            {
              timestamp: new Date().toISOString(),
              message: "Hello Supabase!",
            },
          ])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        const { data: selectData, error: selectError } = await supabase.from("test_connection").select("*").limit(1);

        if (selectError) {
          throw selectError;
        }

        if (selectData && selectData.length > 0) {
          setStatus("Success! Connected to Supabase.");
        } else {
          setStatus("Connected, but no documents found (write might have failed silently? check console).");
        }
      } catch (e: any) {
        console.error("Error testing supabase:", e);
        setError(e.message);
        setStatus("Failed to connect.");
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className={`p-4 rounded ${error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{status}</div>
      {error && <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">{error}</pre>}
    </div>
  );
}
