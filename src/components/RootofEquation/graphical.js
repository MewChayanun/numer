import { useState, useEffect } from "react";
import './bisection.css';
import { evaluate } from 'mathjs';

function Graphical() {
  const [xL, setxL] = useState(0);
  const [xR, setxR] = useState(10);
  const [epsilon, setEpsilon] = useState(0.000001);
  const [func, setfunc] = useState("43x-180");
  const [result, setResult] = useState(0);
  const [table, setTable] = useState([]);
  const [data, setData] = useState([]);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/equations');
        const result = await res.json();

        //เช็คว่า type เหมือนกันไหม
        const filteredResult = result.filter(item => item.methodType === "Graphical");
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
    const response = await fetch('http://localhost:4000/api/Add-equations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType: "Graphical",
        func,
        xL: parseFloat(xL),
        xR: parseFloat(xR),
        table: table,
        epsilon: parseFloat(epsilon),
        answer: parseFloat(result)
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



  const Calculate = async (e) => {
    e.preventDefault()

    let xl = parseFloat(xL);
    let xr = parseFloat(xR);
    let eps = epsilon
    const Arraydata = []
    let count = 1
    let y = 0, z = 0
    let x = 0
    if (F(xl) * F(xr) > 0) {
      alert("this interval has no answer")
      return;
    }
    for (let i = xl; i <= xr; i++) {
      if (F(i) * F(i + 1) < 0) {
        y = i;
        x = i
        z = i + 1;
        Arraydata.push({ iteration: count++, x })
      }
      Arraydata.push({ iteration: count++, x })
    }

    if (y == 0 && z == 0) {
      return 0;
    }
    let resultX = 0
    let g = 0;
    for (let i = y; i <= z; i += eps) {
      if (F(i) * F(i + eps) < 0) {
        resultX = i;
        x = i;
        Arraydata.push({ iteration: count++, x })
        break;
      }
      console.log(g++)
    }
    setResult(resultX)
    console.log(Arraydata)
    setTable(Arraydata)
    setCalculated(true)
  }
  const F = (x) => {
    return evaluate(func, { x });
  }

  const inputXL = (e) => {
    console.log(e.target.value)
    setxL(e.target.value);
  }
  const inputXR = (e) => {
    console.log(e.target.value)
    setxR(e.target.value);
  }
  const inputEp = (e) => {
    console.log(e.target.value)
    setEpsilon(e.target.value);
  }
  const inputFunc = (e) => {
    console.log(e.target.value)
    setfunc(e.target.value);
  }
  const ResetNew = () => {
    setxL(0);
    setxR(10);
    setEpsilon(0.000001);
    setfunc("43x-180");
    setResult(0);
    setTable([]);
    setCalculated(false);
  }
  const handleOptionChangeFunc = async (e) => {
    const selectedEquation = e.target.value;
    const selected = data.find(item => item.equation === selectedEquation);

    if (selected) {
      console.log("Selected equation:", selected.equation);
      console.log("Selected xL:", selected.xl);
      console.log("Selected xR:", selected.xr);
      console.log("Selected table:", selected.table);
      console.log("Selected result:", selected.answer);

      setfunc(selected.equation);
      setxL(selected.xl);
      setxR(selected.xr);
      setTable(selected.table || []);
      setResult(selected.answer || 0);
      setCalculated(true);
    } else {
      console.error("Selected equation not found in data.");
    }
  };

  return (
    <div className="calculator-container">
      <form onSubmit={Calculate}>
        <div className="form-container">
          <div className="form-title" >
            <h1 >Grapical Method Calculator</h1>
          </div>
          <div>
            <input type="string" value={func} step="any" id="func" placeholder="input function" onChange={inputFunc} />
          </div>
          <div>
            <input type="number" value={xL} step="any" id="xl" placeholder="input xl" onChange={inputXL} />
          </div>
          <div>
            <input type="number" value={xR} step="any" id="xr" placeholder="input x2" onChange={inputXR} />
          </div>
          <div>
            <input type="number" value={epsilon} step="any" id="epsilon" placeholder="input epsilon" onChange={inputEp} />
          </div>
          <select onChange={handleOptionChangeFunc} className="option-form">
            <option value={null}>Equation example</option>
            {data.map((data) => (
              <option key={data.id}>
                {`${data.equation}`}
              </option>
            ))}
          </select>
          <div className="button-container">
            <button type="submit" className="calculate">Calculate</button>
            <button type="button" className="calculate" onClick={ResetNew}>Reset</button>
            <button type="button" className="calculate" onClick={PostDataBase}>Add Database</button>
          </div>
          <div className="answer">
            <h1>Answer: {result.toFixed(6)}</h1>
          </div>
        </div>
      </form>
    </div>
  )

}

export default Graphical;


