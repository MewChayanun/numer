import { useState, useEffect } from "react";
import './bisection.css';
import { evaluate, derivative } from 'mathjs';

function Newton() {
  const [xInnital, setXInnital] = useState(2);
  const [epsilon, setEpsilon] = useState(0.0001);
  const [func, setfunc] = useState("x^2-7");
  const [result, setResult] = useState(0);
  const [table, setTable] = useState([]);
  const [data, setData] = useState([]);
  const [calculated, setCalculated] = useState(false);

  const Calculate = (e) => {
    e.preventDefault()
    let innitial = parseFloat(xInnital)
    let eps = epsilon
    let xI = innitial
    let xold = 0
    let error = 1, i = 0
    const Arraydata = []
    Arraydata.push({ iteration: i, xI, error })
    while (error > eps) {
      xold = xI
      xI = xI - (F(xI) / FDerivative(xI))
      error = Math.abs(xI - xold)
      Arraydata.push({ iteration: i + 1, xI, error })
      i++
    }
    setResult(xI)
    setTable(Arraydata)
    setCalculated(true)

  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/equations');
        const result = await res.json();

        //เช็คว่า type เท่ากันไหม
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
    const response = await fetch('http://localhost:4000/api/Add-equations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType: "Newton",
        func,
        xL: parseFloat(xInnital),
        xR: 0,
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
  const F = (x) => {
    return evaluate(func, { x });
  }
  const FDerivative = (x) => {
    const expr = derivative(func, 'x')
    return expr.evaluate({ x })
  }

  const inputXInnital = (e) => {
    console.log(e.target.value)
    setXInnital(e.target.value);
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
    setXInnital(2);
    setEpsilon(0.0001);
    setfunc("x^2-7");
    setResult(0);
    setTable([]);
    setCalculated(false);
  }
  const handleOptionChangeFunc = async (e) => {
    const selectedEquation = e.target.value;
    const selected = data.find(item => item.equation === selectedEquation);

    if (selected) {
      console.log("Selected equation:", selected.equation);
      console.log("Selected x:", selected.xl);
      console.log("Selected table:", selected.table);
      console.log("Selected result:", selected.answer);

      setfunc(selected.equation);
      setXInnital(selected.xl);
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
          <h1 className="form-title">Newton Method Calculator</h1>
          <div>
            <input type="string" value={func} step="any" id="func" placeholder="input function" onChange={inputFunc} />
          </div>
          <div>
            <input type="number" value={xInnital} step="any" id="xr" placeholder="input innitial x" onChange={inputXInnital} />
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
      <div className="results-container">
        <div className="table-and-chart">
          {calculated && table.length > 0 && (
            <>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Iteration</th>
                    <th width="30%">X</th>
                    <th width="30%">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((element, index) => (
                    <tr key={index}>
                      <td>{element.iteration}</td>
                      <td>{element.xI.toFixed(6)}</td>
                      <td>{element.error.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div >
  )

}

export default Newton;


