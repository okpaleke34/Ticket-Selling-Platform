import React, { createContext, useReducer, useEffect } from 'react';
import { fetchSettings } from '../actions/ticketActions';
import ticketReducer  from '../reducers/ticketReducer';

export const TicketContext = createContext();

const TicketContextProvider = (props) => {
  const initialState = {
    settings: {},
    reservation:{},
    errMsg:"",
    sucMsg:""
  }
  
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  useEffect(() => {
    fetchSettings(dispatch)
    console.log("hello from from context")
  }, []);

  return (
    <TicketContext.Provider value={{ state , dispatch }}>
      {props.children}
    </TicketContext.Provider>
  );
}
 
export default TicketContextProvider;