import { useState, useEffect } from "react";

import './EmployeePagestyle.scss'
import axios from "axios";
import { API_URL } from "../../Utils/Api";

const EmployeePage = ()=> {

    const [employeeData, setemployeeData] = useState([]);
    const [employeeEmail, setEmployeeEmail] = useState('');
    const [emplpyeeName, setEmployeeName] = useState('');
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/employees/show/employee`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    setemployeeData(response.data);
                    console.log('Employee data:', response.data);
                } else {
                    console.error('Failed to fetch employee data');
                }
            } catch (error) {
                console.error('Error fetching data from backend:', error);
            }
        };
        fetchData();
    }, []);

    const handleNameChange = (e) => {
        setEmployeeName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmployeeEmail(e.target.value);
    };

    const addEmployee = async (e) => {
        e.preventDefault();
        const employeeDataSet = { employeeName: emplpyeeName, employeeEmail: employeeEmail };
      
        try {
          const response = await axios.post(`${API_URL}/employees/add/employee`, employeeDataSet, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.status === 200) {
            console.log('Employee added:', response.data);
      
            setEmployeeName('');
            setEmployeeEmail('');
            
            const newEmployee = response.data;
            setemployeeData([...employeeData, newEmployee]);
          } else {
            console.error('Failed to add employee');
          }
      
        } catch (error) {
          console.error('Error adding employee:', error);
        }
      };
      

      const deleteEmployee = async (id) => {
        try {
          const response = await axios.delete(`${API_URL}/employees/delete/employee/${id}`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.status === 200) {
            setemployeeData(employeeData.filter(employee => employee._id !== id));
            console.log('Employee deleted');
          } else {
            console.error('Failed to delete employee');
          }
      
        } catch (error) {
          console.error('Error deleting employee:', error);
        }
      };
      

    const editEmployee = (employee)=> {
        setEmployeeName(employee.employeeName)
        setEmployeeEmail(employee.employeeEmail)
        setUpdateId(employee._id)
    }

    const updateEmployee = async (e) => {
        e.preventDefault();
        if (updateId === null) return;
      
        const employeeDataSet = { employeeName: emplpyeeName, employeeEmail: employeeEmail };
      
        try {
          const response = await axios.put(`${API_URL}/employees/update/employee/${updateId}`, employeeDataSet, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.status === 200) {
            console.log('Employee updated:', employeeDataSet);
      
            setEmployeeName('');
            setEmployeeEmail('');
            setUpdateId(null);
      
            const updatedEmployee = response.data;
            setemployeeData(employeeData.map(employee => employee._id === updateId ? updatedEmployee : employee));
          } else {
            console.error('Failed to update employee');
          }
      
        } catch (error) {
          console.error('Error updating employee:', error);
        }
      };
      

    return(
<div className="employee_main_div">
            <div className="add_employee_div">
                <h2>ADD EMPLOYEE</h2>
                <form onSubmit={updateId ? updateEmployee :addEmployee}>
                    <input
                        type='text'
                        placeholder="Name"
                        className="employee_input"
                        value={emplpyeeName}
                        onChange={handleNameChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="employee_input"
                        value={employeeEmail}
                        onChange={handleEmailChange}
                    />
                    <button type="submit">{updateId ? "Update Employee " : "Add Employee"}</button>
                </form>
            </div>
            <div className="show_employee_details">
                <div>
                    {employeeData.map((employee) => (
                        <div className="employee_section" key={employee.id}>
                            
                            <p>{employee.employeeName}</p>
                            <p>{employee.employeeEmail}</p>
                            <button onClick={()=>deleteEmployee(employee._id)}>delete</button>
                            <button onClick={()=>editEmployee(employee)}>Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmployeePage;