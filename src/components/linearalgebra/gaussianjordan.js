import { useState, useEffect } from "react";
import './styleLinear.css';
function GaussianJordan() {
    const [Row, setRow] = useState(2);
    const [result, setResult] = useState([]);
    const [Matrix, setMatrix] = useState([]);
    const [calculated, setCalculated] = useState(false);
    const [showMatrix, setShowMatrix] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/Gauss');
                const result = await res.json();

                //เช็คว่า type เหมือนกันไหม
                const filteredResult = result.filter(item => item.methodType === "gaussjordan");
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
                methodType: "gaussjordan",
                equation: Matrix,
                size: Row,
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

    const GenerRateMatrix = (e) => {
        e.preventDefault();
        const newMatrix = Array.from({ length: Row }, () => Array.from({ length: Row + 1 }, () => ""));
        setMatrix(newMatrix);
        setShowMatrix(true);
    }

    const inputRowCol = (e) => {
        setRow(Number(e.target.value));
    }

    const handleMatrixChange = (rowIndex, colIndex, value) => {
        const updatedMatrix = [...Matrix];
        updatedMatrix[rowIndex][colIndex] = Number(value);
        setMatrix(updatedMatrix);
    }

    const ResetNew = () => {
        setRow(2);
        setResult([]);
        setMatrix([]);
        setCalculated(false);
        setShowMatrix(false);
    };

    const Calculate = () => {
        let A = Matrix.map(row => [...row]);
        let X = Array(Row).fill(0);
        const n = Row;

        for (let i = 0; i < n; i++) {
            let diagElem = A[i][i];
            for (let z = i; z <= n; z++) {
                A[i][z] /= diagElem;
            }
            for (let j = i + 1; j < n; j++) {
                const ratio = A[j][i] / A[i][i];
                for (let k = 0; k < n + 1; k++) {
                    A[j][k] = A[j][k] - ratio * A[i][k];
                }
            }
        }

        X[n - 1] = A[n - 1][n] / A[n - 1][n - 1];
        for (let i = n - 2; i >= 0; i--) {
            let sum = 0
            for (let j = i + 1; j < n; j++) {
                sum += A[i][j] * X[j]
            }
            X[i] = (A[i][n] - sum) / A[i][i]
        }

        setResult(X)
        setCalculated(true)
    };
    const handleOptionChangeFunc = async (e) => {
        const selectedEquation = e.target.value;
        const selected = data.find(item => item.equation.toString() === selectedEquation);

        if (selected) {
            console.log("Selected equation:", selected.equation);
            console.log("Selected table:", selected.table);
            console.log("Selected result:", selected.answer);

            setRow(selected.size)
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
            <form onSubmit={GenerRateMatrix}>
                <div className="form-container">
                    <div className="form-title" >
                        <h1 >Gaussian Elimination Jordan</h1>
                    </div>
                    <div>
                        <input
                            type="number"
                            value={Row}
                            step="1"
                            placeholder="Input row"
                            onChange={inputRowCol}
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
                        <button type="button" className="calculate" onClick={ResetNew}>Reset</button>
                    </div>
                </div>
            </form >
            {Matrix.length && showMatrix > 0 && (
                <div>
                    <div className="matrix-container">
                        {Matrix.map((row, rowIndex) => (
                            <div key={rowIndex} className="matrix-row">
                                {row.map((val, colIndex) => (
                                    <input
                                        key={`${rowIndex}-${colIndex}`}
                                        type="number"
                                        value={val}
                                        onChange={(e) =>
                                            handleMatrixChange(rowIndex, colIndex, e.target.value)
                                        }
                                        className="matrix-input"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="button-container">
                {showMatrix && (<button type="button" onClick={Calculate} className="calculate">Calculate</button>)}
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
}

export default GaussianJordan;
