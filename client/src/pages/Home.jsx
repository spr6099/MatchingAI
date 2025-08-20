import React, { useEffect, useState } from "react";
import baseUrl from "../../baseUrl";
import axios from "axios";

const Home = () => {
  const [investors, setInvestors] = useState([]);
  const [startups, setStartups] = useState([]);
  const [activeTab, setActiveTab] = useState("investors");
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      const investorData = await axios.get(`${baseUrl}/getInvestors`);
      const startupData = await axios.get(`${baseUrl}/getStartups`);
      setInvestors(investorData.data);
      setStartups(startupData.data);
    } catch (error) {
      console.error("Error in fetching data", error.message);
    }
  };

  const handleSelect = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const result = await axios.post(`${baseUrl}/match`, {
        type: activeTab === "investors" ? "investor" : "startup",
        id: selected._id,
      });
      setMatches(result.data.matches || []);
    } catch (error) {
      console.error("Error fetching matches", error.message);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSelect();
  }, [selected]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 p-4 text-white font-bold text-xl shadow-md">
        Investor–Startup Matching
      </nav>

      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-1/3 bg-white border-r md:h-screen p-4">
          <div className="flex mb-4">
            <button
              className={`flex-1 p-2 ${
                activeTab === "investors"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("investors")}
            >
              Investors
            </button>
            <button
              className={`flex-1 p-2 ${
                activeTab === "startups"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("startups")}
            >
              Startups
            </button>
          </div>

          <ul className="space-y-2 overflow-y-auto max-h-96 md:max-h-[calc(100vh-150px)]">
            {(activeTab === "investors" ? investors : startups).map((item) => (
              <li
                key={item._id}
                onClick={() => setSelected(item)}
                className={`p-3 rounded cursor-pointer border ${
                  selected?._id === item._id
                    ? "bg-blue-600 text-white border-indigo-600 transition-colors duration-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <h3 className="font-bold">{item.name}</h3>
                {/* <p className="text-sm text-gray-500"> */}
                <p
                  className={`text-sm ${
                    selected?._id === item._id
                      ? "text-indigo-100"
                      : "text-gray-500"
                  }`}
                >
                  {activeTab === "investors"
                    ? item.focusIndustry
                    : item.industry}
                  • {item.stage}
                </p>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6">
          {loading ? (
            <div className="text-center mt-20 text-indigo-600">
              <svg
                className="animate-spin h-8 w-8 mx-auto mb-2 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Loading matches...
            </div>
          ) : selected ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Recommendations for {selected.name}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border rounded shadow-sm text-sm md:text-base">
                  <thead className="bg-indigo-100 text-left">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Industry</th>
                      <th className="p-3">Stage</th>
                      <th className="p-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.length > 0 ? (
                      matches.map((m, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="p-3">{m.name}</td>
                          <td className="p-3">
                            {m.industry || m.focusIndustry}
                          </td>
                          <td className="p-3">{m.stage}</td>
                          <td className="p-3 text-gray-600">{m.reason}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-3 text-center text-gray-500"
                        >
                          No matches yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-20 italic">
              Select an investor or startup to see matches.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
