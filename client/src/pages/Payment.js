import React, { useEffect,useContext } from 'react'
import { fetchReservation,makePayment } from '../actions/ticketActions';
import {TicketContext} from '../contexts/TicketContext'


const Message = ({sucMsg,errMsg,reservation}) =>{
    if(sucMsg !== ""){
        return (
            <p>
                {sucMsg}
                <br/>
                <a href='/'> Go to home page</a>            
            </p>            
        )
    }
    else{
        return <p>{errMsg} </p>
    }
}

const Payment = (props) => {
    const {state,dispatch} = useContext(TicketContext)
    const {errMsg,sucMsg,reservation,settings} = state
    const {id,first_name,last_name,email,no_of_tickets,status} = reservation
    const {cost_per_ticket} = settings
    const amount = Number(no_of_tickets) * cost_per_ticket    
    const {token} = props.match.params
    useEffect(() => {
        // run fetch function
        fetchReservation(token,dispatch)
    },[token,dispatch]); 

    var haveSubmitted = sucMsg !== "" || errMsg !== "";
    let title = "";
    if(sucMsg !== "" || Object.keys(reservation).length !== 0){
        title = "Reservation has been made successfully!"
    }
    else{
        title = "Failed to make reservation!"
    }
    let defTitle = ""
    switch(status){
        case 0:
            defTitle = "This ticket has expired"
        break;
        case 1:
            defTitle = `Pay for your reservation #${token}`
        break;
        default: 
            defTitle = 'This ticket has been paid'
        
    }
    return (
        <div id="booking" className="section">
            <div className="section-center">
                <div className="container">
                    <div className="row">
                        <div className="booking-form">
                            <div className="form-header" style={{display:haveSubmitted === true?'none':'block'}}>
                                <h1>{defTitle}</h1>
                            </div>
                            <div className="awaiting-redirect" style={{display:haveSubmitted === true?'block':'none'}}>
                                <h1>{title}</h1>
                                <img alt="" src={errMsg?"https://img.icons8.com/material-outlined/24/fa314a/cancel--v1.png":"https://img.icons8.com/color/48/000000/double-tick.png"}/>
                                <p style={{color:"#fff",fontSize:'20px'}}>
                                    <Message sucMsg={sucMsg} errMsg={errMsg} />
                                </p>
                                
                            </div>
                            <form style={{display:haveSubmitted === true?'none':'block'}}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <span className="form-label">First name</span>
                                            <input className="form-control" type="text" value={first_name} disabled />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <span className="form-label">Last name</span>
                                            <input className="form-control" type="text" value={last_name} disabled />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <span className="form-label">E-mail</span>
                                            <input className="form-control" type="text" value={email} disabled />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <span className="form-label">No of tickets</span>						
                                            <input className="form-control" type="number" value={no_of_tickets} disabled />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <span className="form-label">Currency</span>							
                                            <select className="form-control" disabled>
                                                <option value="EUR"> EUR </option>
                                            </select>
                                        </div>
                                    </div>
                                
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <span className="form-label">Amount</span>								
                                            <input className="form-control" type="text" value={amount} disabled />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-btn" style={{display:status === 1?'block':'none'}}>
                                    <button className="submit-btn" type="button" onClick={()=>makePayment({amount,currency:"EUR",reserve_id:id,mode:"Paypal"},dispatch)}>Pay</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment