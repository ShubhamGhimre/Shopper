import React, { useContext, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {

    const [menu, setMenu] = useState("shop")
    const { getTotalCartItems } = useContext(ShopContext)

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="logo" />
                <p>SHOPPER</p>
            </div>
            <ul className='nav-menu'>
                <li onClick={() => { setMenu("shop") }}>
                    <Link to='/' > Shop</Link>
                    {menu === "shop" ? <hr /> : null}
                </li>
                <li onClick={() => { setMenu("men") }}>
                    <Link to='/mens'> Men</Link>
                    {menu === "men" ? <hr /> : null}
                </li>
                <li onClick={() => { setMenu("women") }}>
                    <Link to='/womens'> Women</Link>
                    {menu === "women" ? <hr /> : null}
                </li>
                <li onClick={() => { setMenu("kids") }}>
                    <Link to='/kids'> Kids</Link>
                    {menu === "kids" ? <hr /> : null}
                </li>
            </ul>
            <div className='nav-login-cart'>
                {localStorage.getItem("authToken") ?
                    <button onClick={() => {
                        localStorage.removeItem("authToken");
                        window.location.replace("/")
                    }}>
                        Logout
                    </button>
                    :
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                }

                <Link to="/cart">
                    <img src={cart_icon} alt="cart" />
                </Link>
                <div className='nav-cart-count'>
                    {getTotalCartItems()}
                </div>

            </div>
        </div>
    )
}

export default Navbar