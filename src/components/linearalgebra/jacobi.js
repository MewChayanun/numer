import React, { useState, useEffect } from "react";
import './styleLinear.css';

const JacobiMethod = () => {
  const [numRows, setNumRows] = useState(2);
  const [matrix, setMatrix] = useState([]);
  const [result, setResult] = useState([]);
  const [showMatrix, setShowMatrix] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [iterations, setIterations] = useState([]); // Track iterations
  const [data, setData] = useState([]);
  const maxMatrixSize = 10;
  const tolerance = 1e-6; // Convergence threshold
  const maxIterations = 100; // Maximum number of iterations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/Gauss');
        const result = await res.json();

        //เช็คว่า type เหมือนกันไหม
        const filteredResult = result.filter(item => item.methodType === "jacobi");
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
        methodType: "jacobi",
        equation: matrix,
        size: numRows,
        answer: result,
        table: iterations
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

    if (newNumRows >= 2 && newNumRows <= maxMatrixSize) {
      setNumRows(newNumRows);
    } else {
      alert(`Please enter a number between 2 and ${maxMatrixSize}`);
    }
  };

  const ResetMatrix = () => {
    setNumRows(2);
    setMatrix([]);
    setResult([]);
    setShowMatrix(false);
    setCalculated(false);
    setIterations([]); // Reset iterations on reset
  };

  const handleInputChange = (event, row, col) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = event.target.value;
    setMatrix(newMatrix);
  };

  const handleCalculate = () => {
    const matrixA = [];
    const matrixB = [];

    for (let i = 0; i < numRows; i++) {
      matrixA[i] = [];
      for (let j = 0; j < numRows; j++) {
        matrixA[i][j] = parseFloat(matrix[i][j]);
      }
      matrixB[i] = parseFloat(matrix[i][numRows]);
    }

    let solutions = Array(numRows).fill(0); // Initial guess
    let prevSolutions = Array(numRows).fill(0);
    let converged = false;

    // Reset iterations array for new calculations
    const newIterations = [];

    for (let iteration = 0; iteration < maxIterations && !converged; iteration++) {
      converged = true;
      for (let i = 0; i < numRows; i++) {
        let sum = matrixB[i];
        for (let j = 0; j < numRows; j++) {
          if (i !== j) {
            sum -= matrixA[i][j] * prevSolutions[j];
          }
        }
        solutions[i] = sum / matrixA[i][i];

        // Check for convergence
        if (Math.abs(solutions[i] - prevSolutions[i]) > tolerance) {
          converged = false;
        }
      }

      // Store current iteration results
      newIterations.push([...solutions]);

      // Update previous solutions for the next iteration
      prevSolutions = [...solutions];
    }

    // Update state with iteration results
    setIterations(newIterations);

    if (!converged) {
      alert("Jacobi method did not converge within the maximum iterations.");
    } else {
      setResult(solutions);
      setCalculated(true);
    }
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
    const newMatrix = Array.from({ length: numRows }, () => Array.from({ length: numRows + 1 }, () => ""));
    setMatrix(newMatrix);
    setShowMatrix(true);
  };

  const renderIterationsTable = () => {
    return (
      <table className="iterations-table">
        <thead>
          <tr>
            <th>Iteration</th>
            {Array.from({ length: numRows }, (_, index) => (
              <th key={index}>{`x${index + 1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {iterations.map((iteration, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {iteration.map((value, idx) => (
                <td key={idx}>{value.toFixed(6)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
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
      setResult(selected.answer);
      setIterations(selected.table);
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
          <div className="form-title">
            <h1>Jacobi Method</h1>
          </div>
          <div>
            <input type="number" value={numRows} onChange={handleNumRowsChange} />
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
              {`x${index + 1} = ${res.toFixed(6)}`}
            </div>
          ))}
        </div>
      )}
      {calculated && (
        <div className="table">
          {renderIterationsTable()}
        </div>
      )}
    </div>
  );
};

export default JacobiMethod;
