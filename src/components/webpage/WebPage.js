import './Webpage.css';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function WebPage() {
  const handleReload = (path) => {
    if (window.location.pathname === path) {
      window.location.reload(); 
    }
  };

  return (
    <div className="OutHeader">
      <div className="InHeader">
        <div className="navBar">
        <div className="dropdown">
          </div>
          <div className="dropdown">
            <a href="#"><li>Root of equation</li></a>
            <div className="dropdown-content">
              <NavLink to="/graphical" onClick={() => handleReload('/graphical')}>graphical</NavLink>
              <NavLink to="/bisection" onClick={() => handleReload('/bisection')}>Bisection</NavLink>
              <NavLink to="/falseposition" onClick={() => handleReload('/falseposition')}>Falseposition</NavLink>
              <NavLink to="/onepoint" onClick={() => handleReload('/onepoint')}>Onepoint</NavLink>
              <NavLink to="/taylor" onClick={() => handleReload('/taylor')}>Taylor Series</NavLink>
              <NavLink to="/newton" onClick={() => handleReload('/newton')}>Newton</NavLink>
              <NavLink to="/secant" onClick={() => handleReload('/secant')}>Secant</NavLink>
            </div>
          </div>
          <div className="dropdown">
            <a href="#"><li>Linear Algebra</li></a>
            <div className="dropdown-content">
              <NavLink to="/cramer" onClick={() => handleReload('/cramer')}>Cramer</NavLink>
              <NavLink to="/gaussian" onClick={() => handleReload('/gaussian')}>Gaussian Elimination</NavLink>
              <NavLink to="/gaussianjordan" onClick={() => handleReload('/gaussianjordan')}>Gaussian Elimination Jordan</NavLink>
              <NavLink to="/matrixinversion" onClick={() => handleReload('/matrixinversion')}>Matrix Inversion</NavLink>
              <NavLink to="/LU_Decompose" onClick={() => handleReload('/LU_Decompose')}>LU Decompose</NavLink>
              <NavLink to="/Choleskey_Decompose" onClick={() => handleReload('/Choleskey_Decompose')}>Choleskey Decompose</NavLink>
              <NavLink to="/jacobi" onClick={() => handleReload('jacobi')}>Jacobi Method</NavLink>
              <NavLink to="/gaussseidal" onClick={() => handleReload('/gaussseidal')}>Gauss Seidal </NavLink>
              <NavLink to="/conjugate" onClick={() => handleReload('/conjugate')}>ConjugateGradient</NavLink>
            </div>
          </div>
          <div className="dropdown">
            <a href="#"><li>Interpolation</li></a>
            <div className="dropdown-content">
              <NavLink to="/lagrange" onClick={() => handleReload('/lagrange')}>Lagrange</NavLink>
              <NavLink to="/newtonInterpolation" onClick={() => handleReload('/newtonInterpolation')}>Newton</NavLink>
              <NavLink to="/linearspline" onClick={() => handleReload('/linearspline')}>LinearSpline</NavLink>
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
}

export default WebPage;
