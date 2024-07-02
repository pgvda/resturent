import React, { useEffect, useState } from "react";
import './HomePageStyle.scss';

const HomePage = () => {
    const [customerData, setCustomerData] = useState([]);
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/customers/show/customer', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCustomerData(data);
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
        setCustomerName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setCustomerEmail(e.target.value);
    };

    const addCustomer = async (e) => {
        e.preventDefault();
        const customerDataSet = { name: customerName, email: customerEmail };

        try {
            const response = await fetch('http://localhost:5000/customers/add/customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerDataSet),
            });

            if (response.ok) {
                console.log('Customer added:', customerDataSet);
                // Clear the input fields
                setCustomerName('');
                setCustomerEmail('');
                // Refetch the customer data to update the list
                const newCustomer = await response.json();
                setCustomerData([...customerData, newCustomer]);
            } else {
                console.error('Failed to add customer');
            }

        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const deleteCustomer = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/customers/delete/customer/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setCustomerData(customerData.filter(customer => customer.id !== id));
                console.log('Customer deleted');
            } else {
                console.error('Failed to delete customer');
            }

        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const editCustomer = (customer)=>{
        setCustomerName(customer.name)
        setCustomerEmail(customer.email)
        setUpdateId(customer.id)

    }

    const updateCustomer = async (e) => {
        e.preventDefault()
        if(updateId === null) return

        const customerDataSet = {name:customerName, email:customerEmail};

        try{
            const response = await fetch(`http://localhost:5000/customers/edit/customer/${updateId}`,{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(customerDataSet),
            });

            if(response.ok){
                console.log('Customer update', customerDataSet)

                setCustomerName('')
                setCustomerEmail('');
                setUpdateId(null);

                const updatedCustomer = await response.json();
                setCustomerData(customerData.map(customer => customer.id === updateId ? updatedCustomer : customer));
            }
        } catch (error) {
            console.error('Error with updating data',error);
        }
    }
    

    return (
        <div className="home_page_main_div">
            <div className="add_customer_div">
                <h2>ADD CUSTOMER</h2>
                <form onSubmit={updateId ?updateCustomer: addCustomer}>
                    <input
                        type='text'
                        placeholder="Name"
                        className="customer_input"
                        value={customerName}
                        onChange={handleNameChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="customer_input"
                        value={customerEmail}
                        onChange={handleEmailChange}
                    />
                    <button type="submit">{updateId ? "Update Customer" : "Add customer"}</button>
                </form>
            </div>
            <div className="show_customer_details">
                <div>
                    {customerData.map((customer) => (
                        <div className="customer_section" key={customer.id}>
                            <p>{customer.id}</p>
                            <p>{customer.name}</p>
                            <p>{customer.email}</p>
                            <button onClick={()=>deleteCustomer(customer.id)}>delete</button>
                            <button onClick={()=>editCustomer(customer)}>Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
