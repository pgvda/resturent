import logo from './logo.svg';
import './App.css';
import HomePage from './View/HomePage/HomePage';
import EmployeePage from './View/EmployeePage/EmployeePage';
import MenuPage from './View/MenuPage/MenuPage';

function App() {
  return (
    <div className="App">
      <HomePage/>
      <EmployeePage/>
      <MenuPage/>
    </div>
  );
}

export default App;
