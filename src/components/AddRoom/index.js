import { useState } from 'react';
import axios from '../../utilities/axios';
import './index.css';

const AddRoom = () => {

    const [data, setData] = useState({ name: '', detail: '', price: '', roomType: 'Deluxe', amenities:'' });

    const inputChange = event => {
        const id = event.target.name;
        const value = event.target.value;
        setData({ ...data, [id] : value });
    };

    const addRoom = () => {
        axios.post('/addRoom', {name:data.name, detail:data.detail, price:data.price,type:data.roomType, amenities:data.amenities}).then(res=>{
            alert('Room Data saved successfully');
            window.location='/';
        }).catch(err=>{
            alert('Error in saving data');
        })
    };

    return (
        <div className='addRoom'>
            <h1 className='addRoom_title'>
                Add Room
            </h1>
            <div className='addRoom_input_container'>
                <div className='addRoom_name'>Name</div>
                <input name='name' type="text" className='addRoom_value' placeholder='Room Name' value={data.name} onChange={inputChange}></input>
            </div>
            <div className='addRoom_input_container'>
                <div className='addRoom_name'>Detail</div>
                <input name='detail' type="text" className='addRoom_value' placeholder='Room Detail' value={data.detail} onChange={inputChange}></input>
            </div>
            <div className='addRoom_input_container'>
                <div className='addRoom_name'>Amenities</div>
                <input name='amenities' type="text" className='addRoom_value' placeholder='Amenities' value={data.amenities} onChange={inputChange}></input>
            </div>
            <div className='addRoom_input_container'>
                <div className='addRoom_name'>Price</div>
                <input name='price' type="number" className='addRoom_value' placeholder='Room Price' value={data.price} onChange={inputChange}></input>
            </div>
            <div className='addRoom_input_container'>
                <div className='addRoom_name'>Type</div>
                <select name='roomType' className='addRoom_select' onChange={inputChange}>
                    <option selected={data.roomType==='Deluxe'} value='Deluxe'>Deluxe</option>
                    <option selected={data.roomType==='Regular'} value='Regular'>Regular</option>
                </select>
            </div>
            <button type='button' className='addRoom_addButton' onClick={addRoom}>Add</button>
        </div>
    )
}

export default AddRoom;
