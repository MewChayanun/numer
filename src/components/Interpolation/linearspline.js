import { useState, useEffect } from "react";
import './styleInterpolation.css';
function LinearSpline() {
  const [Xtarget, setXtarget] = useState(0);
  const [result, setResult] = useState(0);
  const [pointCount, setPointCount] = useState(2);
  const [points, setPoints] = useState([{ x: "", y: "" }, { x: "", y: "" }]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/Interpolation');
        const result = await res.json();

        //เช็คว่า type เหมือนกันไหม
        const filteredResult = result.filter(item => item.methodType === "LinearSpline");
        setData(filteredResult);

        console.log(filteredResult);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  const PostDataBase = async (e) => {
    e.preventDefault();
    console.log(Xtarget)
    const response = await fetch('http://localhost:4000/api/Add-Interpolation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType: "LinearSpline",
        points,
        xTarget: Xtarget,
        answer: result,
        n: pointCount,
      }),
    });

    const dbResult = await response.json();
    console.log('Response Status:', response.status);
    console.log('Result from API:', dbResult);

    if (!response.ok) {
      console.error('Failed to save equation:', dbResult.message);
      alert("Fail")
      return;
    }
    alert("Success")
  }
  const Calculate = (e) => {
    e.preventDefault();
    let xFind = parseFloat(Xtarget);
    let size = points.length;
    let result = null;

    for (let i = 0; i < size - 1; i++) {
      let x1 = parseFloat(points[i].x);
      let x2 = parseFloat(points[i + 1].x);
      let y1 = parseFloat(points[i].y);
      let y2 = parseFloat(points[i + 1].y);

      if (xFind >= x1 && xFind <= x2) {

        result = y1 + ((y2 - y1) / (x2 - x1)) * (xFind - x1);
        break;
      }
    }

    if (result === null) {
      result = NaN;
    }

    setResult(result);
  };

  const ResetNew = () => {
    setResult(0);
    setPointCount(2);
    setPoints([{ x: "", y: "" }, { x: "", y: "" }]);
  };

  const handlePointCountChange = (e) => {
    const count = parseInt(e.target.value) || 2;
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

  const logData = () => {
    console.log(points);
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
        <div className="form-title" >
          <h1 >Linear Spline Method Calculator</h1>
        </div>
        <form>
          <div className="inputPoint">
            <input
              type="number"
              value={pointCount}
              step="any"
              placeholder="input n"
              onChange={(e) => handlePointCountChange(e)}
            />
          </div>
        </form>

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
            <input type="number" value={Xtarget} step="any" placeholder="input x" onChange={handleXtarget} />
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
    </div>
  );
}

export default LinearSpline;
