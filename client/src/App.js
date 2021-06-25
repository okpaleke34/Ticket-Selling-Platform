import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import TicketContextProvider from './contexts/TicketContext';

import Home from './pages/Home';
import Payment from './pages/Payment';

class App extends Component{ 
  state = { 
    loading: true
   }
  componentDidMount() { 
    this.setState({loading:false})
  } 
  render() { 
    const { loading } = this.state; 
    if(loading) { 
        return <div>Page is load.....</div>;
    } 
    return (
      <TicketContextProvider>
        <Router>
            <Route exact path="/" component={Home} />
            <Route exact path="/pay/:token" 
              render={(props) =>(
                <Payment key={props.match.params.token} {...props} />
              )} 
            />
        </Router>
      </TicketContextProvider>
      
    )
  } 
} 

export default App;