import c from '../actions/ticket.types'

const initialState = {
    settings: {},
    reservation:{},
    errMsg:"",
    sucMsg:""
}

const ticketReducer = (state = initialState, action) =>{
    switch(action.type){
        case c.FETCH_SETTINGS:
            return {
                ...state,
                settings: action.payload
            }        
        case c.RESERVATION_DETAILS:
            return {
                ...state,
                reservation: action.payload
            }      
        case c.ERROR_MESSAGE:
            return {
                ...state,
                errMsg: action.payload
            }     
        case c.SUCCESS_MESSAGE:
            return {
                ...state,
                sucMsg: action.payload
            } 
        default:
            return state
    }
}

export default ticketReducer