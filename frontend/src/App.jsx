import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL);
        setData(response.data);
        console.log("UseEffect"); 
      } catch (error) {
        console.error("Error fetching data from backend:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App" style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh"}}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <h1 style={{ margin: 0 }}>SHUBZ I VERSE</h1>
      </div>

      <h3>{data}</h3>
    </div>
  );
}

export default App;
