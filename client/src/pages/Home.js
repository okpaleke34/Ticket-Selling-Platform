import React, { useState,useContext } from 'react';
import { isEmail } from '../helpers/func';
import { Link } from 'react-router-dom';
import { TicketContext } from '../contexts/TicketContext';
import { makeReservation } from '../actions/ticketActions';

const Message = ({sucMsg,errMsg,reservation}) =>{
    if(sucMsg !== "" || Object.keys(reservation).length !== 0){
        return (
            <p>
                Your reservation will expire in next 15 mins if payment is not made.
                <br/>
                <Link to={`/pay/${reservation.token}`}> Click here to go to payment page</Link>            
            </p>            
        )
    }
    else{
        return <p>{errMsg} </p>
    }
}
const Home = () => {
    const {state,dispatch} = useContext(TicketContext)
    const {errMsg,sucMsg,reservation,settings} = state
    const {total_tickets} = settings
    const [error,setError] = useState("")
    const [data,setData] = useState({
		first_name:"",
		last_name:"",
		email:"",
		no_of_tickets:0,
    })

	//changing the value of input will be updating the state with the values
	const onChange = (e) =>{
        e.persist()
        setData(prev =>({...prev,[e.target.name]:e.target.value}))
	}
    
     
    const madeReservation = sucMsg !== "" || errMsg !== "" || Object.keys(reservation).length !== 0;
    let title = "";
    if(sucMsg !== "" || Object.keys(reservation).length !== 0){
        title = "Reservation has been made successfully!"
    }
    else{
        title = "Failed to make reservation!"
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let {first_name,last_name,email,no_of_tickets} = data
        no_of_tickets = Number(no_of_tickets)
        // validate form
        if(first_name === "" || last_name === "" || email === "" || no_of_tickets === 0){
            setError("Please fill all the form");
        }
        else if(!isEmail(email)){
            setError(`${email} is not a valid email address`);
        }
        else if(no_of_tickets > total_tickets){
            setError(`There are only ${total_tickets} tickets available`);
        }
        else if(no_of_tickets % 2 !== 0 && total_tickets !== no_of_tickets){
            setError(`The number of ticket must be even`);
        }
        else if(total_tickets - no_of_tickets === 1){
            setError(`You cannot leave only one ticket avaialble, please buy a total of ${total_tickets} tickets`);
        }
        else{
            makeReservation(data,dispatch)
        }
        
    }
  
    return (
        <div id="booking" className="section">
            <div className="section-center">
                <div className="container">
                    <div className="row">
                        <div className="booking-form">
                            <div className="form-header" style={{display:madeReservation === true?'none':'block'}}>
                                <h1>Make your reservation</h1>
                            </div>
                            <div className="awaiting-redirect" style={{display:madeReservation === true?'block':'none'}}>
                                <h1>{title}</h1>
                                <img alt="" src={errMsg?"https://img.icons8.com/material-outlined/24/fa314a/cancel--v1.png":"https://img.icons8.com/color/48/000000/double-tick.png"}/>
                                <p style={{color:"#fff",fontSize:'20px'}}>
                                    <Message sucMsg={sucMsg} errMsg={errMsg} reservation={reservation} />
                                </p>
                                
                            </div>
                            <form onSubmit={handleSubmit} style={{display:madeReservation === true?'none':'block'}}>
                                <h4 
                                className="text-danger" 
                                style={{fontStyle:"italic",display:error === ''?'none':'block'}}
                                >
                                {error}
                                </h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <span className="form-label">First name</span>
                                            <input className="form-control" type="text" name="first_name" onChange={onChange} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <span className="form-label">Last name</span>
                                            <input className="form-control" type="text" name="last_name" onChange={onChange} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <span className="form-label">E-mail</span>
                                            <input className="form-control" type="text" name="email" onChange={onChange} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <span className="form-label">No of tickets</span>										
                                            <input className="form-control" type="number" name="no_of_tickets" onChange={onChange} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-btn">
                                    <button className="submit-btn">Make Reservation</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;