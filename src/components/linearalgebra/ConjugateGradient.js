import React, { useState, useEffect } from "react";
import './styleLinear.css';

const ConjugateGradientMethod = () => {
  const [numRows, setNumRows] = useState(2);
  const [matrix, setMatrix] = useState([]);
  const [result, setResult] = useState([]);
  const [data, setData] = useState([]);
  const [showMatrix, setShowMatrix] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const maxMatrixSize = 10;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/Gauss');
        const result = await res.json();

        //เช็คว่า type เหมือนกันไหม
        const filteredResult = result.filter(item => item.methodType === "conjugate");
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
    const response = await fetch('http://localhost:4000/api/Add-Gauss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType: "conjugate",
        equation: matrix,
        size: numRows,
        answer: result,
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

  const handleNumRowsChange = (event) => {
    const newNumRows = parseInt(event.target.value);
    if (newNumRows >= 1 && newNumRows <= maxMatrixSize) {
      setNumRows(newNumRows);
      setMatrix(Array.from({ length: newNumRows }, () => Array.from({ length: newNumRows + 1 }, () => "")));
    } else {
      alert(`Please enter a number between 1 and ${maxMatrixSize}`);
    }
  };

  const handleGenerateMatrix = () => {
    const newMatrix = Array.from({ length: numRows }, () => {
      return Array.from({ length: numRows + 1 }, () => "");
    });
    setMatrix(newMatrix);
    setShowMatrix(true)
  };

  const handleInputChange = (event, row, col) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = event.target.value;
    setMatrix(newMatrix);
  };

  const handleCalculate = () => {
    const A = matrix.map((row) => row.map((value) => parseFloat(value)));

    const n = A.length;
    const maxIterations = 100;
    const errorTolerance = 1e-6;

    let x = new Array(n).fill(0);
    let r = new Array(n);
    let p = [...r];

    const result = [];

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let Ap = new Array(n).fill(0);
      let alpha = 0;
      let rsnew = 0;

      for (let i = 0; i < n; i++) {
        r[i] = 0;
        for (let j = 0; j < n; j++) {
          r[i] += A[i][j] * x[j];
        }
        r[i] = r[i] - A[i][n]; // Subtract b
        p[i] = r[i];
      }

      for (let i = 0; i < n; i++) {
        Ap[i] = 0;
        for (let j = 0; j < n; j++) {
          Ap[i] += A[i][j] * p[j];
        }
        alpha += r[i] * r[i];
      }

      alpha /= Ap.reduce((acc, val, i) => acc + val * p[i], 0);

      for (let i = 0; i < n; i++) {
        x[i] = x[i] + alpha * p[i];
        r[i] = r[i] - alpha * Ap[i];
        rsnew += r[i] * r[i];
      }

      if (Math.sqrt(rsnew) < errorTolerance) {
        break;
      }

      result.push({
        iteration,
        x: [...x],
        error: Math.sqrt(x.reduce((acc, val) => acc + val * val, 0)),
      });
    }

    setResult(result);
    setCalculated(true);
  };

  const renderTable = () => {
    return matrix.map((row, i) => (
      <div key={i} className="matrix-row">
        {row.map((value, j) => (
          <input
            key={j}
            type="text"
            value={matrix[i][j]}
            onChange={(event) => handleInputChange(event, i, j)}
            className="matrix-input"
          />
        ))}
      </div>
    ));
  };
  const ResetMatrix = () => {
    setNumRows(2);
    setMatrix([]);
    setResult([]);
    setShowMatrix(false);
    setCalculated(false);
  };
  const handleOptionChangeFunc = async (e) => {
    const selectedEquation = e.target.value;
    const selected = data.find(item => item.equation.toString() === selectedEquation);

    if (selected) {
      console.log("Selected equation:", selected.equation);
      console.log("Selected table:", selected.table);
      console.log("Selected result:", selected.answer);

      setNumRows(selected.size);
      setMatrix(selected.equation);
      setResult(selected.answer)
      setCalculated(true);
      setShowMatrix(true);

    } else {
      console.error("Selected equation not found in data.");
    }
  };

  return (
    <div className="calculator-container">
      <div className="form-container">
        <div className="form-title">
          <h1>Conjugate Gradient Method</h1>
        </div>
        <input
          type="number"
          min="2"
          value={numRows}
          onChange={handleNumRowsChange}
          className="num-rows-input"
        />
        <select onChange={handleOptionChangeFunc} className="option-form">
          <option value={null}>Equation example</option>
          {data.map((data) => (
            <option key={data.id}>
              {`${data.equation}`}
            </option>
          ))}
        </select>
        <div className="button-container">
          <button type="submit" className="calculate" onClick={handleGenerateMatrix}>Generate Matrix</button>
          <button type="button" className="calculate" onClick={ResetMatrix}>Reset</button>
        </div>
      </div>
      <div className="matrix-container">
        {showMatrix && renderTable()}
      </div>
      <div className="button-container">
        {showMatrix && (<button type="submit" onClick={handleCalculate} className="calculate">Calculate</button>)}
        {showMatrix && (<button type="button" onClick={PostDataBase} className="calculate">add database</button>)}
      </div>

      {calculated && (

        <div className="table">
          <table>

            <thead>
              <tr>
                <th>Iteration</th>
                {Array.from({ length: numRows }, (_, index) => (
                  <th key={index}>{`x${index + 1}`}</th>
                ))}
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.iteration + 1}</td>
                  {item.x.map((x, i) => (
                    <td key={i}>{x.toFixed(7)}</td>
                  ))}
                  <td>{item.error.toFixed(7)}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      )}
    </div>
  );
};

export default ConjugateGradientMethod;
