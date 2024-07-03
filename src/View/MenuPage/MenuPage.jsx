import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Utils/Api";

const MenuPage = () => {
    const [menuData, setMenuData] = useState([]);
    const [price, setPrice] = useState('');
    const [menuName, setMenuName] = useState('');
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await axios.get(`${API_URL}/menus/show/menu`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    setMenuData(response.data);
                    console.log('Menu data:', response.data);
                } else {
                    console.error('Failed to fetch menu data');
                }
            } catch (error) {
                console.error('Error fetching data from backend:', error);
            }
        };

        fetchMenuData();
    }, []);

    const handleNameChange = (e) => {
        setMenuName(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const addMenu = async (e) => {
        e.preventDefault();
        const menuDataSet = { menuName: menuName, menuPrice: price };

        try {
            const response = await axios.post(`${API_URL}/menus/add/menu`, menuDataSet, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log('Menu added:', menuDataSet);

                setMenuName('');
                setPrice('');

                const newMenu = response.data;
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
                console.log('Menu deleted');
            } else {
                console.error('Failed to delete menu');
            }

        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    };

    const editMenu = (menu) => {
        setMenuName(menu.menuName);
        setPrice(menu.menuPrice);
        setUpdateId(menu._id);
    };

    const updateMenu = async (e) => {
        e.preventDefault();
        if (updateId === null) return;

        const menuDataSet = { name: menuName, price: price };

        try {
            const response = await fetch(`http://localhost:5000/menu/edit/menu/${updateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuDataSet),
            });

            if (response.ok) {
                console.log('Menu updated:', menuDataSet);

                setMenuName('');
                setPrice('');
                setUpdateId(null);

                const updatedMenu = await response.json();
                setMenuData(menuData.map(menu => menu.id === updateId ? updatedMenu : menu));
            } else {
                console.error('Failed to update menu');
            }

        } catch (error) {
            console.error('Error updating menu:', error);
        }
    };

    return (
        <div className="home_page_main_div">
            <div className="add_customer_div">
                <h2>{updateId ? "EDIT ITEM" : "ADD ITEM"}</h2>
                <form onSubmit={updateId ? updateMenu : addMenu}>
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
                    <button type="submit">{updateId ? "Update Item" : "Add Item"}</button>
                </form>
            </div>
            <div className="show_customer_details">
                <div>
                    {menuData.map((menu) => (
                        <div className="customer_section" key={menu.id}>
                            <p>{menu.id}</p>
                            <p>{menu.menuName}</p>
                            <p>{menu.menuPrice}/=</p>
                            <button onClick={() => deleteMenu(menu._id)}>Delete</button>
                            <button onClick={() => editMenu(menu)}>Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MenuPage;
