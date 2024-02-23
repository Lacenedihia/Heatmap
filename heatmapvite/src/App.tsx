import { data } from "./data";
import { Heatmap } from "./heatmap";
import { useEffect, useState } from "react";

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const rootElement: HTMLElement | null = document.getElementById("root");

  return (
    <>
      {rootElement && (
        <Heatmap
          data={data}
          width={windowSize.width}
          height={windowSize.height}
        />
      )}
      
    </>
  );
}

export default App;
