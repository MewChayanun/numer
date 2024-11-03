import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import './styleInterpolation.css';
function NewtonInter() {
    const [Xtarget, setXtarget] = useState(0);
    const [result, setResult] = useState(0);
    const [pointCount, setPointCount] = useState(2);
    const [points, setPoints] = useState([{ x: "", y: "" }, { x: "", y: "" }]); // Default to 2 points
    const [chartData, setChartData] = useState({});
    const [data, setData] = useState([]);
    const [calculated, setcalculated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/Interpolation');
                const result = await res.json();

                //เช็คว่า type เหมือนกันไหม
                const filteredResult = result.filter(item => item.methodType === "Newton");
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
                methodType: "Newton",
                points,
                xTarget: Xtarget,
                answer: result,
                n: pointCount,
                chart: chartData
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

    const CNewton = (x, y, i, j) => {
        if (i === j) {
            return y[i];
        }
        return (CNewton(x, y, i + 1, j) - CNewton(x, y, i, j - 1)) / (x[j] - x[i]);
    };

    const Calculate = (e) => {
        e.preventDefault();

        const xValues = points.map(point => parseFloat(point.x));
        const yValues = points.map(point => parseFloat(point.y));
        let resultLocal = yValues[0];
        let term = 1;

        for (let i = 1; i < pointCount; i++) {
            term *= (Xtarget - xValues[i - 1]);
            resultLocal += CNewton(xValues, yValues, 0, i) * term;
        }

        setResult(resultLocal);
        setcalculated(true);
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
                    data: [...chartY, result],
                    fill: false,
                    borderColor: 'red',
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 10
                }
            ]
        });
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
        setXtarget(parseFloat(e.target.value));
    };

    /*  const logData = () => {
          console.log(points);
      };
  */
    const ResetNew = () => {
        setXtarget(0);
        setPoints(Array(pointCount).fill({ x: "", y: "" }));
        setResult(0);
        setcalculated(false)
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
                    <h1 >Newton Interpolation Calculator</h1>
                </div>
                <form>
                    <div className="inputPoint">
                        <select value={pointCount} onChange={handlePointCountChange}>
                            <option value={2}>2 Points</option>
                            <option value={3}>3 Points</option>
                            <option value={5}>5 Points</option>
                        </select>
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

export default NewtonInter;
