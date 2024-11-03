import React, { useState, useEffect } from "react";
import './styleLinear.css';

const LU_Decompose = () => {
  const [numRows, setNumRows] = useState(2);
  const [calculated, setCalculated] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrix, setMatrix] = useState(
    Array.from({ length: numRows }, () =>
      Array.from({ length: numRows + 1 }, () => "")
    )
  );
  const [result, setResult] = useState([]);
  const [data, setData] = useState([]);
  const maxMatrixSize = 10;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/Gauss');
        const result = await res.json();

        //เช็คว่า type เหมือนกันไหม
        const filteredResult = result.filter(item => item.methodType === "LU");
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
        methodType: "LU",
        equation: matrix,
        size: numRows,
        answer: result
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
    } else {
      alert(`Please enter a number between 1 and ${maxMatrixSize}`);
    }
  };

  const handleInputChange = (event, row, col) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = event.target.value;
    setMatrix(newMatrix);
  };

  const handleCalculate = () => {
    const A = matrix.map((row) => row.slice(0, -1).map((value) => parseFloat(value)));
    const B = matrix.map((row) => parseFloat(row[row.length - 1]));
    let L = Array.from({ length: A.length }, (_, i) =>
      Array.from({ length: A.length }, (_, j) => (i === j ? 1 : 0))
    );
    let U = A.map((row) => [...row]);

    // Gaussian elimination to form L and U
    for (let i = 0; i < A.length; i++) {
      for (let j = i + 1; j < A.length; j++) {
        L[j][i] = U[j][i] / U[i][i];
        for (let k = i; k < A.length; k++) {
          U[j][k] -= L[j][i] * U[i][k];
        }
      }
    }

    let Y = [];
    for (let i = 0; i < A.length; i++) {
      Y[i] = B[i];
      for (let j = 0; j < i; j++) {
        Y[i] -= L[i][j] * Y[j];
      }
      Y[i] /= L[i][i];
    }

    let resultX = [];
    for (let i = A.length - 1; i >= 0; i--) {
      resultX[i] = Y[i];
      for (let j = i + 1; j < A.length; j++) {
        resultX[i] -= U[i][j] * resultX[j];
      }
      resultX[i] /= U[i][i];
    }

    setResult(resultX);
    setCalculated(true);
  };
  const renderTable = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const rowInputs = [];
      for (let j = 0; j <= numRows; j++) {
        rowInputs.push(
          <input
            key={j}
            type="text"
            value={matrix[i][j]}
            onChange={(event) => handleInputChange(event, i, j)}
            className="matrix-input"
          />
        );
      }
      rows.push(
        <div key={i} className="matrix-row">
          {rowInputs}
        </div>
      );
    }
    return rows;
  };
  const handleGenerateMatrix = (e) => {
    e.preventDefault();
    const newMatrix = Array.from({ length: numRows }, () => Array.from({ length: numRows + 1 }, () => ""))
    setMatrix(newMatrix);
    setShowMatrix(true);
  };

  const ResetMatrix = () => {
    setNumRows(2);
    setMatrix([]);
    setResult([]);
    setShowMatrix(false);
    setCalculated(false)
  }
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
      <form onSubmit={handleGenerateMatrix}>
        <div className="form-container">
          <div className="form-title" >
            <h1 >LU Decompose</h1>
          </div>
          <div>
            <input
              type="number"
              value={numRows}
              onChange={handleNumRowsChange}
              className="num-rows-input"
            />
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
            <button type="submit" className="calculate">Generate Matrix</button>
            <button type="button" className="calculate" onClick={ResetMatrix}>Reset</button>
          </div>
        </div>
      </form>
      <div className="matrix-container">
        {showMatrix && renderTable()}
      </div>
      <div className="button-container">
        {showMatrix && (<button type="submit" onClick={handleCalculate} className="calculate">Calculate</button>)}
        {showMatrix && (<button type="button" onClick={PostDataBase} className="calculate">add database</button>)}
      </div>
      {calculated && (
        <div className="result-container">
          {result.map((res, index) => (
            <div key={index} className="result">
              {`x${index + 1} = ${res}`}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default LU_Decompose;
