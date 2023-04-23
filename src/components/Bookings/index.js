import './index.css';
// import bookingData from '../../utilities/booking-data.json';
import { useEffect, useState } from 'react';
import axios from '../../utilities/axios';

const Bookings = () => {

    const [bookingData, setBookingData] = useState([]);

    useEffect(()=>{
        const loggedInAs = localStorage.getItem('isLoggedIn');
        const loggedInEmail = localStorage.getItem('email');
        if (loggedInAs === 'admin') {
            axios.get('/allBookings').then(res=>{
                setBookingData(res.data);
            })
        } else {
            axios.get(`/findBooking?email=${loggedInEmail}`).then(res=>{
                setBookingData(res.data);
            })
        }
    }, []);

    const getData = () => {
        if (bookingData.length === 0) {
            return <div className='booking_nobooking'>No Data Available</div>
        }
        return (
            <table>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Room Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Price</th>
                    <th>Status</th>
                </tr>
                <tbody>
                    {bookingData.map(val => (
                        <tr>
                            <td>{val.roomId}</td>
                            <td>{val.email}</td>
                            <td>{val.roomType}</td>
                            <td>{new Date(Number(val.startDate)).toISOString().slice(0, 10)}</td>
                            <td>{new Date(Number(val.endDate)).toISOString().slice(0, 10)}</td>
                            <td>{val.price}</td>
                            <td className={`booking_status ${val.status === 'accepted' ? 'booking_green' : 'booking_red'}`}>{val.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    };

    return (
        <div className="bookings">
            {getData()}
        </div>
    );
};

export default Bookings;