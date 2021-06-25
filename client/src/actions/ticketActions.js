import c from './ticket.types'
const link = c.API_LINK

//fetch the settings details
export const fetchSettings = (dispatch) => {
    fetch(`${link}/settings`)
    .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const body = isJson && await response.json();

        // check for error response
        if (!response.ok || !body.success) {
            // get error message from body or default to response status
            const error = (body && body.message) || response.status;
            return Promise.reject(error);
        }
        dispatch({
            type: c.FETCH_SETTINGS,
            payload:body.data
        })

        if(body.success){
            dispatch({
                type: c.FETCH_SETTINGS,
                payload:body.data
            })
        }
        else{
            dispatch({
                type: c.ERROR_MESSAGE,
                payload:body.message 
            })     
            console.error('There was an error!', body.message);
        }
    })    
    .catch(error => {
        dispatch({
            type: c.ERROR_MESSAGE,
            payload: error.toString() 
        })     
        console.error('There was an error!', error);
    });
}

//fetch an event
export const fetchReservation = (token,dispatch) =>{
    fetch(`${link}/reservation/${token}`)
    .then(async res => {
        const body = await res.json();
        // check for error response
        if (!res.ok || !body.success) {
            // get error message from body or default to response status
            const error = (body && body.message) || res.status;
            return Promise.reject(error);
        }
        dispatch({
            type: c.RESERVATION_DETAILS,
            payload:body.data
        })
    })    
    .catch(error => {
        dispatch({
            type: c.ERROR_MESSAGE,
            payload: error.toString()
        })     
        console.error('There was an error!', error);
    });
}

//make a reservation
export const makeReservation = (data,dispatch) =>{
     // POST request using fetch with error handling
     const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    fetch(`${link}/reserve`, requestOptions)
    .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const body = isJson && await response.json();

        // check for error response
        if (!response.ok || !body.success) {
            // get error message from body or default to response status
            const error = (body && body.message) || response.status;
            return Promise.reject(error);
        }        
        dispatch({
            type:c.RESERVATION_DETAILS,
            payload:body.data
        })
    })
    .catch(error => {
        dispatch({
            type:c.ERROR_MESSAGE,
            payload:error.toString()
        })    
        console.error('There was an error!', error);
    });
}

// Pay fotr your reservation
export const makePayment = (data,dispatch) =>{
    // POST request using fetch with error handling
    const requestOptions = {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data)
   };
   fetch(`${link}/pay`, requestOptions)
   .then(async response => {
       const isJson = response.headers.get('content-type')?.includes('application/json');
       const body = isJson && await response.json();

       // check for error response
       if (!response.ok || !body.success) {
           // get error message from body or default to response status
           const error = (body && body.message) || response.status;
           return Promise.reject(error);
       }

       dispatch({
           type:c.SUCCESS_MESSAGE,
           payload:"Payment has been made successfully"
       })
   })
   .catch(error => {
       dispatch({
           type:c.ERROR_MESSAGE,
           payload:error.toString()
       })     
       console.error('There was an error!', error);
   });
}



export const isEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
