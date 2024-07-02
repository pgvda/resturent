import { useState, useEffect } from "react";

import './EmployeePagestyle.scss'

const EmployeePage = ()=> {

    const [employeeData, setemployeeData] = useState([]);
    const [employeeEmail, setEmployeeEmail] = useState('');
    const [emplpyeeName, setEmployeeName] = useState('');
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/employees/show/employee', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setemployeeData(data);
                    console.log('Customer data:', data);
                } else {
                    console.error('Failed to fetch customer data');
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
        const employeeDataSet = { name: emplpyeeName, email: employeeEmail };

        try {
            const response = await fetch('http://localhost:5000/employees/add/employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeDataSet),
            });

            if (response.ok) {
                console.log('Customer added:', employeeDataSet);
              
                setEmployeeName('');
                setEmployeeEmail('');
                
                const newEmployee = await response.json();
                setemployeeData([...employeeDataSet, newEmployee]);
            } else {
                console.error('Failed to add customer');
            }

        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const deleteEmployee = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/employees/delete/employee/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setemployeeData(employeeData.filter(employee => employee.id !== id));
                console.log('Customer deleted');
            } else {
                console.error('Failed to delete customer');
            }

        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const editEmployee = (employee)=> {
        setEmployeeName(employee.name)
        setEmployeeEmail(employee.email)
        setUpdateId(employee.id)
    }

    const updateEmployee = async(e)=>{
        e.preventDefault();
        if (updateId === null) return;

        const EmployeeDataSet = { name: emplpyeeName, email: employeeEmail };

        try {
            const response = await fetch(`http://localhost:5000/employees/edit/employee/${updateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(EmployeeDataSet),
            });

            if (response.ok) {
                console.log('Menu updated:', EmployeeDataSet);

                setEmployeeName('');
                setEmployeeEmail('');
                setUpdateId(null);

                const updatedEmployee = await response.json();
                setemployeeData(employeeData.map(employee => employee.id === updateId ? updatedEmployee : employee));
            } else {
                console.error('Failed to update menu');
            }

        } catch (error) {
            console.error('Error updating menu:', error);
        }
    }

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
                            <p>{employee.id}</p>
                            <p>{employee.name}</p>
                            <p>{employee.email}</p>
                            <button onClick={()=>deleteEmployee(employee.id)}>delete</button>
                            <button onClick={()=>editEmployee(employee)}>Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmployeePage;