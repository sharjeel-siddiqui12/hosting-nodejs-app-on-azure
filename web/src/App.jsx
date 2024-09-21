import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [resultMessage, setResultMessage] = useState('');

  const baseUrl = window.location.href.split(":")[0] === 'https' ? '' : 'http://localhost:5001';

  useEffect(() => {
    getAllProducts();
  }, []);

  const addProduct = (e) => {
    e.preventDefault();
    
    const productData = {
      name,
      price,
      category,
      description,
    };

    if (currentProductId) {
      // Update existing product
      axios.put(`${baseUrl}/product/${currentProductId}`, productData)
        .then(response => {
          setResultMessage(response.data.message);
          clearForm();
          getAllProducts();
        })
        .catch(error => {
          setResultMessage(error.message);
        });
    } else {
      // Create new product
      axios.post(`${baseUrl}/product`, productData)
        .then(response => {
          setResultMessage(response.data.message);
          clearForm();
          getAllProducts();
        })
        .catch(error => {
          setResultMessage(error.message);
        });
    }
  };

  const getAllProducts = () => {
    axios.get(`${baseUrl}/products`)
      .then(response => {
        setProducts(response.data.data);
      })
      .catch(error => {
        setResultMessage(error.message);
      });
  };

  const editProduct = (id) => {
    axios.get(`${baseUrl}/product/${id}`)
      .then(response => {
        const product = response.data.data;
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
        setDescription(product.description);
        setCurrentProductId(product._id);
      })
      .catch(error => {
        setResultMessage(error.message);
      });
  };

  const deleteProduct = (id) => {
    axios.delete(`${baseUrl}/product/${id}`)
      .then(response => {
        setResultMessage(response.data.message);
        getAllProducts();
      })
      .catch(error => {
        setResultMessage(error.message);
      });
  };

  const clearForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setDescription('');
    setCurrentProductId(null);
  };

  return (
    <div>
      <h1>CRUD APPLICATION</h1>
      <form onSubmit={addProduct}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">{currentProductId ? 'Update Product' : 'Add Product'}</button>
      </form>

      <div id="result">{resultMessage}</div>

      <div className="productList">
        {products.map(product => (
          <div key={product._id}>
            <h1>{product.name}</h1>
            <p>{product.price}</p>
            <p>{product.category}</p>
            <p>{product.description}</p>
            <button className='btn' onClick={() => deleteProduct(product._id)}>Delete</button>
            <button className='btn' onClick={() => editProduct(product._id)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
