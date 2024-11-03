import { useState , useEffect } from "react";
import './bisection.css';
import { evaluate, derivative, factorial, abs, pow } from 'mathjs';

function Taylor() {
  const [xInnital, setXInnital] = useState(4);
  const [x0Innital, setX0Innital] = useState(2);
  const [N, setN] = useState(4);
  const [func, setfunc] = useState("log(x)");
  const [result, setResult] = useState(0);
  const [table, setTable] = useState([]);
  const [data, setData] = useState([]);
  const [calculated, setCalculated] = useState(false);

  const Calculate = (e) => {
    e.preventDefault()
    let n = parseFloat(N)
    let x = parseFloat(xInnital)
    let x0 = parseFloat(x0Innital)
    let error = 0
    const Arraydata = []
    let SumTaylor = F(x0)
    let PrimeFuc = func
    for (let i = 0; i < n; i++) {
      if (i > 0) {
        PrimeFuc = derivative(PrimeFuc, 'x')
        let term = PrimeFuc.evaluate({ x: x0 }) * (pow((x - x0), i) / factorial(i))
        SumTaylor += term
      }
      error = abs(F(x) - SumTaylor)
      Arraydata.push({ N: i, error: error })
    }
    setResult(error)
    setTable(Arraydata)
    setCalculated(true)


  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/equations');
        const result = await res.json();

        //เช็คว่า type เท่ากันไหม
        const filteredResult = result.filter(item => item.methodType === "Taylor");
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
        methodType: "Taylor",
        func,
        xL: parseFloat(xInnital),
        xR: parseFloat(x0Innital),
        table: table,
        epsilon: parseFloat(N),
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
  const inputN = (e) => {
    console.log(e.target.event)
    setN(e.target.value)
  }
  const F = (x) => {
    return evaluate(func, { x });
  }


  const inputXInnital = (e) => {
    console.log(e.target.value)
    setXInnital(e.target.value);
  }
  const inputX0Innital = (e) => {
    console.log(e.target.value)
    setX0Innital(e.target.value);
  }
  const inputFunc = (e) => {
    console.log(e.target.value)
    setfunc(e.target.value);
  }
  const ResetNew = () => {
    setXInnital(4)
    setX0Innital(2)
    setN(4)
    setfunc("log(x)");
    setResult(0);
    setTable([]);
    setCalculated(false)
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
      setX0Innital(selected.xr);
      setN(selected.epsilon);
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
          <h1 className="form-title">Taylor Series Method Calculator</h1>
          <div>
            <input type="string" value={func} step="any" id="func" placeholder="input function" onChange={inputFunc} />
          </div>
          <div>
            <input type="number" value={N} step="any" id="xr" placeholder="input n" onChange={inputN} />
          </div>
          <div>
            <input type="number" value={xInnital} step="any" id="xr" placeholder="input x" onChange={inputXInnital} />
          </div>
          <div>
            <input type="number" value={x0Innital} step="any" id="epsilon" placeholder="input x0" onChange={inputX0Innital} />
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
                    <th width="30%" scope="col">N</th>
                    <th width="30%">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((element, index) => (
                    <tr key={index}>
                      <td>{element.N}</td>
                      <td>{element.error.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  )

}

export default Taylor;


