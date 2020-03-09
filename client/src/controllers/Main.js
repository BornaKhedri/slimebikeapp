import React, { Component } from 'react'
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom"
import socketIOClient from "socket.io-client"
import axios from 'axios'
import Classification from './Classification'
import Location from './Location'
import Identification from './Identification'
var socket;

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: false,
            endpoint: ":3006", 
            socket:'',
            city: '', 
            companies: [], 
            infractions: []
        };
    socket = socketIOClient(this.state.endpoint)
    this._populateCompanies = this._populateCompanies.bind(this);
    this._populateInfractions = this._populateInfractions.bind(this);

    }

    componentDidMount() {
        this.getAndEmitCity()
     }

    getAndEmitCity = () => {
        axios.get('https://ipapi.co/json/').then((response) => {
            let data = response.data;
            console.log(response.data);
            this.setState({
                city: data.city
            })
            if(this.state.city !== '') {
                socket.emit('city_sensed', {
                    'city': this.state.city
                });
            }

            this.getCompaniesAndInfractions()

        }).catch((error) => {
            console.log(error);
        });
    };
    
    _populateCompanies(data) {
        var {companies} = data;
        console.log(companies);
        this.setState({
            companies: companies
        })
    }

    _populateInfractions(data) {
        var {infractions} = data;
        console.log(infractions);
        this.setState({
            infractions: infractions
        })
    }

    getCompaniesAndInfractions = () => {
        socket.on('cityCompanies', this._populateCompanies);
        socket.on('cityInfractions', this._populateInfractions);
    }

    render() {
        return (
            <HashRouter>
                <div>
                    <div className='page-header'>
                        <h1>Misplaced Wheels Reporter 1.0</h1>
                    </div>
                    <ul className="header">
                        <li><NavLink exact to="/">Classification</NavLink></li>
                        <li><NavLink to="/location">Location</NavLink></li>
                        <li><NavLink to="/identification">Identification</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={Classification} infractions={this.state.infractions} companies={this.state.companies}/>
                        <Route path="/location" component={Location} />
                        <Route path="/identification" component={Identification} />

                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default Main
