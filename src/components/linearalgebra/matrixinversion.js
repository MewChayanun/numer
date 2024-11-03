import React, { useState, useEffect } from "react";
import './styleLinear.css';

const MatrixInversion = () => {
    const [numRows, setNumRows] = useState(2);
    const [matrix, setMatrix] = useState(
        Array.from({ length: numRows }, () =>
            Array.from({ length: numRows + 1 }, () => "")
        )
    );
    const [result, setResult] = useState([]);
    const [calculated, setCalculated] = useState(false);
    const [showMatrix, setShowMatrix] = useState(false);
    const [data, setData] = useState([]);
    const maxMatrixSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/Gauss');
                const result = await res.json();

                //เช็คว่า type เหมือนกันไหม
                const filteredResult = result.filter(item => item.methodType === "Inversion");
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
                methodType: "Inversion",
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
        const A = matrix.map(row => row.slice(0, -1).map(value => parseFloat(value)));
        const B = matrix.map(row => parseFloat(row[row.length - 1]));
        const n = A.length;
    
        // Step 1: Create an augmented matrix [A | I]
        let augmentedMatrix = A.map((row, i) => [
            ...row,
            ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
        ]);
    
        // Step 2: Apply Gaussian elimination to transform [A | I] to [I | A^-1]
        for (let i = 0; i < n; i++) {
            // Make the diagonal element 1
            let diagElement = augmentedMatrix[i][i];
            if (diagElement === 0) {
                console.error("Matrix is singular and cannot be inverted.");
                return; // Exit if matrix is singular
            }
            for (let j = 0; j < 2 * n; j++) {
                augmentedMatrix[i][j] /= diagElement;
            }
    
            // Make the other elements in the current column 0
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    let factor = augmentedMatrix[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                    }
                }
            }
        }
    
        // Step 3: Extract A^-1 from the augmented matrix
        const inverseA = augmentedMatrix.map(row => row.slice(n, 2 * n));
    
        // Step 4: Multiply A^-1 by B to get the solution X
        let resultX = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                resultX[i] += inverseA[i][j] * B[j];
            }
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
        setMatrix(
            Array.from({ length: numRows }, () =>
                Array.from({ length: numRows + 1 }, () => "")
            )
        );
        setCalculated(false);
        setShowMatrix(true);
    };

    const resetMatrix = () => {
        setNumRows(2);
        setMatrix([]);
        setResult([]);
        setCalculated(false);
        setShowMatrix(false);
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
                    <div className="form-title">
                        <h1>Matrix Inversion</h1>
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
                        <button type="button" className="calculate" onClick={resetMatrix}>Reset</button>
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
                        <div key={index} className="result">{`x${index + 1} = ${res}`}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatrixInversion;
