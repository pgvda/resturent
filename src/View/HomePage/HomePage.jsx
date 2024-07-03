import React, { useEffect, useState } from "react";
import axios from "axios";
import './HomePageStyle.scss';
import { API_URL } from "../../Utils/Api";

const HomePage = () => {
    const [customerData, setCustomerData] = useState([]);
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${API_URL}/customers/show/customer`, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
    
            if (response.status === 200) {
              setCustomerData(response.data);
              console.log('Customer data:', response.data);
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
        const customerDataSet = { customerName: customerName, customerEmail: customerEmail };
      
        try {
          const response = await axios.post(`${API_URL}/customers/add/customer`, customerDataSet, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.status === 200) {
            console.log('Customer added:', customerDataSet);
    
            setCustomerName('');
            setCustomerEmail('');
            
            setCustomerData([...customerData, response.data]);
          } else {
            console.error('Failed to add customer');
          }
      
        } catch (error) {
          console.error('Error adding customer:', error);
        }
      };
      const deleteCustomer = async (id) => {
        try {
          const response = await axios.delete(`${API_URL}/customers/delete/customer/${id}`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.status === 200) {
            setCustomerData(customerData.filter(customer => customer._id !== id));
            console.log('Customer deleted');
          } else {
            console.error('Failed to delete customer');
          }
      
        } catch (error) {
          console.error('Error deleting customer:', error);
        }
      };

    const editCustomer = (customer)=>{
        setCustomerName(customer.customerName)
        setCustomerEmail(customer.customerEmail)
        setUpdateId(customer._id)

    }

    const updateCustomer = async (e) => {
        e.preventDefault();
        console.log(updateId);
        if (updateId === null) return;
      
        const customerDataSet = {
          customerName: customerName,
          customerEmail: customerEmail,
          customerPassword: '12345678'
        };
      
        try {
          const response = await axios.put(`${API_URL}/customers/update/customer/${updateId}`, customerDataSet, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.status === 200) {
            console.log('Customer updated:', customerDataSet);
      
            setCustomerName('');
            setCustomerEmail('');
            setUpdateId(null);
      
            const updatedCustomer = response.data;
            setCustomerData(customerData.map(customer => customer._id === updateId ? updatedCustomer : customer));
          } else {
            console.error('Failed to update customer');
          }
        } catch (error) {
          console.error('Error with updating data:', error);
        }
      };
      
    

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
                            <p>{customer.customerName}</p>
                            <p>{customer.customerEmail}</p>
                            <button onClick={()=>deleteCustomer(customer._id)}>delete</button>
                            <button onClick={()=>editCustomer(customer)}>Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
