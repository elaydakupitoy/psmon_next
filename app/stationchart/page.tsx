"use client";

import { useState } from "react";
import Link from "next/link";
import LineChart from "../component/LineChart";

export default function StationsPage() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <div>

                
         
                

                                
                        {/* Container with left, center, and right elements */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between", // pushes items to edges
                    alignItems: "center",            // vertically align them
                    marginBottom: "5px",
                  }}
                >
                  {/* Left element */}
                  <div>
                    <Link
                      href="/"
                      className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Home
                    </Link>
                  </div>

                  {/* Center element */}
                  <div>
                    <span className="text-gray-700 font-semibold">Stations Data Graph</span>
                  </div>

                  {/* Right element: Date Picker */}
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="inline-block mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                  />
                </div>

      <LineChart date={selectedDate} />
    </div>
  );
}