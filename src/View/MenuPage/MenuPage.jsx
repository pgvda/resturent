import { React, useState, useEffect } from "react";

const MenuPage = () => {

    const [menuData, setMenuData] = useState([]);
    const [price, setPrice] = useState('');
    const [menuName, setMenuName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/menu/show/menu', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMenuData(data);
                    console.log('Customer data:', data);
                } else {
                    console.error('Failed to fetch menu data');
                }
            } catch (error) {
                console.error('Error fetching data from backend:', error);
            }
        };
        fetchData();
    }, []);

    const handleNameChange = (e) => {
        setMenuName(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const addMenu = async (e) => {
        e.preventDefault();
        const menuDataSet = { name: menuName, price: price };

        try {
            const response = await fetch('http://localhost:5000/menu/add/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuDataSet),
            });

            if (response.ok) {
                console.log('Customer added:', menuDataSet);

                setMenuName('');
                setPrice('');

                const newMenu = await response.json();
                setMenuData([...menuData, newMenu]);
            } else {
                console.error('Failed to add menu');
            }

        } catch (error) {
            console.error('Error adding menu:', error);
        }
    };

    const deleteMenu = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/menu/delete/menu/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setMenuData(menuData.filter(menu => menu.id !== id));
                console.log('menu deleted');
            } else {
                console.error('Failed to delete menu');
            }

        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    };
    
    return (
        <div className="home_page_main_div">
            <div className="add_customer_div">
                <h2>ADD ITEM</h2>
                <form onSubmit={addMenu}>
                    <input
                        type='text'
                        placeholder="Name"
                        className="customer_input"
                        value={menuName}
                        onChange={handleNameChange}
                    />
                    <input
                        type="text"
                        placeholder="Price"
                        className="customer_input"
                        value={price}
                        onChange={handlePriceChange}
                    />
                    <button type="submit">Add Item</button>
                </form>
            </div>
            <div className="show_customer_details">
                <div>
                    {menuData.map((menu) => (
                        <div className="customer_section" key={menu.id}>
                            <p>{menu.id}</p>
                            <p>{menu.name}</p>
                            <p>{menu.price}/=</p>
                            <button onClick={() => deleteMenu(menu.id)}>delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MenuPage;