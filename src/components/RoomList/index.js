import React, { useEffect, useState } from "react";
// import roomData from '../../utilities/room-data.json';
import './index.css';
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "../../utilities/axios";
import Modal from 'react-modal';

const RoomList = ({ title = "Room List", isUpdate }) => {

    const navigate = useNavigate();

    const [deluxeRooms, setDeluxeRooms] = useState([]);
    const [regularRooms, setRegularRooms] = useState([]);

    const [openModal, setOpenModal] = useState({ show: false, data: {} });

    const images = ['https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=', 'https://rooms.richardsmotelfamilyoflodgings.com/wp-content/uploads/2019/09/Room_610_4-27-2018_3.jpg']

    const [startDate, setStartDate] = useState(new Date().setHours(0, 0, 0, 0));
    const [endDate, setEndDate] = useState(new Date().setHours(0, 0, 0, 0));
    console.log(startDate);

    const getLists = () =>{
        axios.get('/rooms?type=Deluxe').then(res => {
            setDeluxeRooms(res.data);
        }).catch(err => {
            console.log(err);
        })
        axios.get('/rooms?type=Regular').then(res => {
            setRegularRooms(res.data);
        }).catch(err => {
            console.log(err);
        })
    };

    useEffect(() => {
        getLists();
    }, []);

    useEffect(() => {
        if (!window.location.search) {
            navigate(`?startDate=${startDate.valueOf()}&endDate=${endDate.valueOf()}`);
        } else {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const start = urlSearchParams.get('startDate');
            const end = urlSearchParams.get('endDate');
            if (start) {
                setStartDate(
                    new Date(Number(start))
                )
            }
            if (end) {
                setEndDate(
                    new Date(Number(end))
                )
            }
        }

    }, [window.location.search]);

    const bookHandler = room => {
        if(!localStorage.getItem('isLoggedIn')){
            window.alert('User not logged in');
            return;
        }
        if (isUpdate) {
            navigate(`/update/${room.roomId}`);
        } else {
            setOpenModal({ show: true, data: room });
        }
    }

    const modalBookHandler = () => {
        const bookedDates = [];
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            bookedDates.push(Math.floor(date.getTime() / 1000)); // add epoch timestamp to array
        }
        console.log(bookedDates);
        const finalData = { ...openModal.data };
        finalData.bookedDates = bookedDates;
        axios.put(`/updateRoom/${finalData.roomId}`, finalData).then(res=>{
            getLists();
        });
        axios.post('/addBooking', {
            price: finalData.price,
            roomId: finalData.roomId,
            email: localStorage.getItem('email'),
            roomType: finalData.type,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            status: 'accepted'
        }).then(res=>{
            setOpenModal({ show: false, data: {} });
        });
    };

    const getData = (list, index) => {
        const tempList = list.filter(room => {
            let booked = 1;
            (room.bookedDates || []).forEach(date => {
                if (date >= startDate && date <= endDate) {
                    booked = 0;
                    return;
                }
            });
            return booked;
        });
        if (tempList.length === 0) {
            return <div className="roomlist-noroom">No Room Available</div>
        }
        return <div className="roomlist-rooms">
            {tempList.map(room => (
                <div className="roomlist-card">
                    <img src={images[index]} alt="Room" width='300' height="300"></img>
                    <div className="roomlist-card-container">
                        <div className="roomlist-rooms-roomname">{room.name}</div>
                        <div className="roomlist-rooms-detail">{room.detail}</div>
                        <div className="amenities">
                            <span>Amenities</span>
                            <div className="amenities_data">
                                {/* {(room.amenities || []).map(val => <span className="amenities_val">{val}</span>)} */}
                                {room.amenities}
                            </div>
                        </div>
                        <div className="roomlist_price">
                            <div>
                                <span>Price: </span>
                                <span>{room.price} $</span>
                            </div>
                            <button className="roomlist-book" onClick={() => {
                                bookHandler(room)
                            }}>{isUpdate ? 'Edit' : 'Book'}</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    }

    const getList = () => {
        if (Array.isArray(deluxeRooms) && Array.isArray(regularRooms)) {
            return <div className="roomlist-lists">
                <div className="roomlist-type">
                    <div className="roomlist-type-name">Deluxe</div>
                    {getData(deluxeRooms, 0)}
                </div>
                <div className="roomlist-type">
                    <div className="roomlist-type-name">Regular</div>
                    {getData(regularRooms, 1)}
                </div>
            </div>
        }
    };

    const searchRooms = () => {
        if (endDate < startDate) {
            alert('End Date cannot be lesser than start date');
            return;
        }
        navigate(`?startDate=${startDate.valueOf()}&endDate=${endDate.valueOf()}`);
    };

    const getDates = () => {
        if (typeof startDate === 'object' && typeof endDate === 'object')
            return `${startDate.getDate()} ${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.toLocaleDateString('en-US', { weekday: 'long' })} - ${endDate.getDate()} ${endDate.toLocaleDateString('en-US', { month: 'long' })} ${endDate.toLocaleDateString('en-US', { weekday: 'long' })}`;
    }

    return (
        <div className="roomlist-container">
            <h1 className="roomlist-mainTitle">{title}</h1>
            <div className="purpleLine" />
            {!isUpdate && <div className="roomList-filtertop">
                <div className="roomlist-filters">
                    <div className="roomlist-filters-startDate">
                        <span>Start Date: </span>
                        <DatePicker selected={startDate} maxDate={endDate} minDate={new Date()} onChange={(date) => setStartDate(date.setHours(0, 0, 0, 0))} />
                    </div>
                    <div className="roomlist-filters-endDate">
                        <span>End Date: </span>
                        <DatePicker selected={endDate} minDate={startDate} onChange={(date) => setEndDate(date.setHours(0, 0, 0, 0))} />
                    </div>
                    {/* <div className="roomlist-filters-type">
                        <div>Type: </div>
                        <select>
                            <option>Deluxe</option>
                            <option>Luxury</option>
                            <option>All</option>
                        </select>
                    </div> */}
                </div>
                <button type="button" className="roomlist-search" onClick={searchRooms}>Search</button>
            </div>}
            {getList()}
            <Modal
                isOpen={openModal.show}
                onRequestClose={() => setOpenModal({ show: false, data: {} })}
                contentLabel="Example Modal"
            >
                <div className="modalContent">
                    <h2>Are you sure you want to book room with following details</h2>
                    <div className="modalData">
                        <div className="modalData_name">
                            <span className='modalData_name_first'>Name</span>
                            <span>{openModal.data.name}</span>
                        </div>
                        <div className="modalData_name">
                            <span className='modalData_name_first'>Type</span>
                            <span>{openModal.data.type}</span>
                        </div>
                        <div className="modalData_name">
                            <span className='modalData_name_first'>Detail</span>
                            <span>{openModal.data.detail}</span>
                        </div>
                        <div className="modalData_name">
                            <span className='modalData_name_first'>Price</span>
                            <span>{openModal.data.price} $</span>
                        </div>
                        <div className="modalData_name">
                            <span className='modalData_name_first'>Booking From</span>
                            <span>{getDates()}</span>
                        </div>
                        <div className="modalData_name">
                            <span className='modalData_name_first'>Booking id</span>
                            <span>{localStorage.getItem('email')}</span>
                        </div>
                        <button className="banner-button modal_book" onClick={modalBookHandler}>Book</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default RoomList;
