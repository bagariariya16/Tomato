import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/storeContext'
import axios from 'axios'
// import Razorpay from "razorpay";
// import dotenv from "dotenv";

// dotenv.config();

const PlaceOrder = () => {

    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (event) => {
        console.log("order placed");
        event.preventDefault();
        // const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        });
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2,
        };
        try {

            const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
            console.log(orderData.amount);
            //let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } })
            if (response.data.success) {
                const { session_url } = response.data;
                //window.location.replace(session_url);
                const options = {
                    key: 'rzp_test_esx3uKHSgoKf4t', // Razorpay API key
                    amount: orderData.amount * 100, // Amount in paise
                    currency: "INR",
                    name: "Tomato",
                    description: "Test Transaction",
                    image: "/logo.png", // Optional logo
                    //order_id: orderId, // Razorpay order ID
                    handler: function (response) {
                        // After payment is successful
                        axios.post(url + '/api/order/verify', {
                            payment_id: response.razorpay_payment_id,
                            order_id: orderId,
                            signature: response.razorpay_signature,
                        }).then(res => {
                            if (res.data.success) {
                                window.location.href = `${url}/payment-success`;
                            } else {
                                alert("Payment Failed");
                            }
                        });
                    },
                    prefill: {
                        name: `${data.firstName} ${data.lastName}`,
                        email: data.email,
                        contact: data.phone,
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();

            }
            else {
                alert("Error in placing order", error);
            }

        } catch (error) {
            console.log(error);
            alert("Error in payment");
        }
    };

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className="title">
                    Delivery Information
                </p>
                <div className="multi-fields">
                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
                    <input required name='lastName' onChange={onChangeHandler} value={data.lastNamestName} type="text" placeholder='Last name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                <div className="multi-fields">
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>
                <div className="multi-fields">
                    <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>
                <input required name='phone' type="text" placeholder='Phone' />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Total</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                        </div>
                    </div>
                    <button type='submit' >Proceed to Payment</button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
