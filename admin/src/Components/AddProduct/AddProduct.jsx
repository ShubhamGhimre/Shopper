import React, { useState } from 'react'
import "./AddProduct.css"
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
    const [image, setImage] = useState(false);

    const [productDetails, setProductDetails] = useState({
        name: '',
        old_price: '',
        new_price: '',
        category: 'Women',
        image: ''
    })

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }
    const changeHandeler = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value,
        })
    }

    const add_Product = async () => {
        
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product', image);

        // Uploading image to object 

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
            
        }).then((resp) => resp.json()).then((data) => {
            responseData = data;
        })

        if(responseData.success){
            product.image = responseData.image_url;
            console.log(product);
            
            // Adding product to database
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data) => {
                data.success?alert("Product added Sucessfully"): alert("error occured");
            })
        }
        
    }
    return (
        <div className='addproduct'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandeler} type="text" name="name" id="" placeholder='Type Here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandeler} type="text" name='old_price' placeholder='Type Here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer price</p>
                    <input value={productDetails.new_price} onChange={changeHandeler} type="text" name='new_price' placeholder='Type Here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandeler} className='add-product-selector' name="category">
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="Kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className='addproduct_thumnail-img' />
                </label>
                <input type="file" name='image' id='file-input' onChange={imageHandler} style={{ display: 'none' }}
                />
            </div>
            <button onClick={() => { add_Product() }} className='addproduct-btn'>ADD</button>
        </div>
    )
}

export default AddProduct