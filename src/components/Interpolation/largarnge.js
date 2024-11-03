import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import './styleInterpolation.css';

function Lagrange() {
  const [Xtarget, setXtarget] = useState(0);
  const [result, setResult] = useState(0);
  const [pointCount, setPointCount] = useState(2);
  const [points, setPoints] = useState([{ x: "", y: "" }, { x: "", y: "" }]);
  const [chartData, setChartData] = useState({});
  const [data, setData] = useState([]);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/Interpolation');
        const result = await res.json();
        const filteredResult = result.filter(item => item.methodType === "Lagrange");
        setData(filteredResult);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const PostDataBase = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/api/Add-Interpolation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType: "Lagrange",
        points,
        xTarget: Xtarget,
        answer: result,
        n: pointCount,
        chart: chartData
      }),
    });

    const dbResult = await response.json();
    if (!response.ok) {
      console.error('Failed to save equation:', dbResult.message);
      alert("Fail");
      return;
    }
    alert("Success");
  };

  const Calculate = (e) => {
    e.preventDefault();
    let xFind = parseFloat(Xtarget);
    let result = 0;
    let size = points.length;

    for (let i = 0; i < size; i++) {
      let term = parseFloat(points[i].y);
      for (let j = 0; j < size; j++) {
        if (j !== i) {
          term *= (xFind - parseFloat(points[j].x)) / (parseFloat(points[i].x) - parseFloat(points[j].x));
        }
      }
      result += term;
    }

    setResult(result);
    setCalculated(true);
    const chartX = points.map(point => parseFloat(point.x));
    const chartY = points.map(point => parseFloat(point.y));

    setChartData({
      labels: chartX,
      datasets: [
        {
          label: 'Original Points',
          data: chartY,
          fill: false,
          borderColor: 'blue',
          tension: 0.1
        },
        {
          label: 'Interpolated Point',
          data: [...chartY, result], // Append the interpolated point
          fill: false,
          borderColor: 'red',
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 10
        }
      ]
    });
  };

  const ResetNew = () => {
    setResult(0);
    setPointCount(2);
    setPoints([{ x: "", y: "" }, { x: "", y: "" }]);
    setChartData({});
    setCalculated(false);
  };

  const handlePointCountChange = (e) => {
    const count = parseInt(e.target.value);
    setPointCount(count);
    const newPoints = Array(count).fill({ x: "", y: "" });
    setPoints(newPoints);
  };

  const handlePointChange = (index, axis, value) => {
    const updatedPoints = [...points];
    updatedPoints[index] = { ...updatedPoints[index], [axis]: value };
    setPoints(updatedPoints);
  };

  const handleXtarget = (e) => {
    setXtarget(e.target.value);
  };

  const handleOptionChangeFunc = async (e) => {
    const selectedEquation = e.target.value;
    const selected = data.find(item => item.answer === parseFloat(selectedEquation));
    if (selected) {
      setXtarget(selected.xTarget);
      setPoints(selected.points);
      setResult(selected.answer);
      setPointCount(selected.n);
    } else {
      console.error("Selected equation not found in data.");
    }
  };

  return (
    <div className="calculator-container">
      <div className="form-container">
        <div className="form-title">
          <h1>Lagrange Method Calculator</h1>
        </div>
        <div className="inputPoint">
          <select value={pointCount} onChange={handlePointCountChange}>
            <option value={2}>2 Points</option>
            <option value={3}>3 Points</option>
            <option value={5}>5 Points</option>
          </select>
        </div>

        <form onSubmit={Calculate}>
          <div className="formcontainer">
            <div>
              {points.map((point, index) => (
                <div key={index} className="pointInputs" style={{ display: 'flex' }}>
                  <input
                    type="number"
                    value={point.x}
                    step="any"
                    placeholder={`x${index + 1}`}
                    onChange={(e) => handlePointChange(index, "x", e.target.value)}
                  />
                  <input
                    type="number"
                    value={point.y}
                    step="any"
                    placeholder={`y${index + 1}`}
                    onChange={(e) => handlePointChange(index, "y", e.target.value)}
                  />
                </div>
              ))}
            </div>
            <input type="number" value={Xtarget} step="any" placeholder="Input x" onChange={handleXtarget} />
            <select onChange={handleOptionChangeFunc} className="option-form">
              <option value="">Equation example</option>
              {data.map((item) => (
                <option key={item.id} value={item.answer}>
                  {`Answer: ${item.answer}`}
                </option>
              ))}
            </select>

            <div className="button-container">
              <button type="submit" className="calculate">Calculate</button>
              <button type="button" className="calculate" onClick={ResetNew}>Reset</button>
              <button type="button" className="calculate" onClick={PostDataBase}>Add Database</button>
            </div>
          </div>
          <div className="Answer">
          <h1>Answer: {result.toFixed(6)}</h1>
          </div>
        </form>
      </div>

      {calculated && (
        <div className="chart-container">
          <div>
          <Line data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Lagrange;
