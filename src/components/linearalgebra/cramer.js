import React, { useState, useEffect } from "react";
import { det } from "mathjs";
import './styleLinear.css';

function CramerRule() {
  const [numRows, setNumRows] = useState(2);
  const [matrix, setMatrix] = useState([]);
  const [result, setResult] = useState([]);
  const [showMatrix, setShowMatrix] = useState(false); 
  const [calculated, setCalculated] = useState(false);
  const [data, setData] = useState([]);
  const maxMatrixSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/Gauss');
        const result = await res.json();

        //เช็คว่า type เหมือนกันไหม
        const filteredResult = result.filter(item => item.methodType === "Cramer");
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
        methodType: "Cramer",
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
    setCalculated(false)
  }

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

    const detA = det(matrixA);

    if (detA === 0) {
      alert("The determinant is zero");
      return;
    }

    const detX = [];
    for (let i = 0; i < matrixB.length; i++) {
      const newArr2D = JSON.parse(JSON.stringify(matrixA));
      for (let j = 0; j < matrixA.length; j++) {
        newArr2D[j][i] = matrixB[j];
      }
      detX.push(det(newArr2D));
    }

    const solutions = detX.map((det, index) => {
      return det / detA;
    });

    setResult(solutions);
    setCalculated(true)
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
            <h1 >Cramer Rule</h1>
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
        {showMatrix && (<button type="button" onClick={PostDataBase } className="calculate">add database</button>)}
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

export default CramerRule;
