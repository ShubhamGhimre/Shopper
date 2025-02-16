import React, { useEffect, useState } from 'react'
import "./ListProduct.css"
import cross_icon from "../../assets/cross_icon.png"

const ListProduct = () => {

    const [allproducts, setAllProducts] = useState([]);

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);
            })
    }

    useEffect(() => {
        fetchInfo();
    },[])

    const remove_Product = async (id)=> {
        await fetch('http://localhost:4000/deleteproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id})
        })
        await fetchInfo();
    }

    return (
        <div className='listproduct'>
            <h1>All Products List</h1>
            <div className="listproduct-format-main">
                <p>Products</p>
                <p>Titles</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allproducts.map((product,index)=>{
                    return <> <div key={index} className="listproduct-format-main listproduct-format">
                        <img className='listproduct-product-icon' src={product.image} alt="" />
                        <p>{product.name}</p>
                        <p>${product.old_price}</p>
                        <p>${product.new_price}</p>
                        <p>{product.category}</p>
                        <img src={cross_icon} className='listproduct-remove-icon' alt="" onClick={()=>{remove_Product(product.id)}} />
                    </div>
                    <hr />
                    </>
                })}
            </div>
        </div>
    )
}

export default ListProduct