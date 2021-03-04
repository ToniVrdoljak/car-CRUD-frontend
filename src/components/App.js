//(optional) TODO: implement login with React Router as in the book

//TODO: throw exceptions for all CRUD operations as is already done in readCars. Then for example you can do updateCar().readCars.catch(err => alert(err)) 
//      Multiple exceptions should be thrown. (1) For example, one should be thrown when there is no connection (fetch function fails and throws exception and this should be mapped).
//      (2) Another should be thrown if the response is unexpected (for example if it doesn't contain a property, like in case of readCars without token, or in case of login with incorrect credentials). Similar situations exist for delete and update, but error code is probably returned.
//      In the second case probably some error code is always returned, so exception should be thrown if error code is encountered. Implement this if possible.

//TODO: align Logout to right usin Grid

import React from 'react';
import '../App.css';
import IconButton from '@material-ui/core/IconButton';
import withHoverInfo from './withHoverInfo';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import { CSVLink } from 'react-csv';
import AddCarModal from './AddCarModal';
import CarForm from './CarForm';
import LoginForm from './LoginForm';
import { SERVER_URL } from '../constants';
import { Button, Grid } from '@material-ui/core';

const IconButtonWithHoverInfo = withHoverInfo(IconButton);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      access_token: null,
      count: 0,
      cars: [],
      editCar: null,
      orderBy: 'price',
      order: 'asc',
      rowsPerPage: 5,
      page: 0
      
    };

    this.readCars = this.readCars.bind(this);
    this.login = this.login.bind(this);
  }

  async createCar(car) {
    var response;
    
    try {
      response = await fetch(SERVER_URL + "api/cars", 
        {
          method:'POST', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.access_token
          },
          body: JSON.stringify(car)
        }
      );  
    } catch (error) {
      throw new Error("Unable to create car. A network error probably occurred. Original message: " + error.message);
    }

    if(!response.ok) {
      throw new Error("HTTP status code " + response.status);
    }

  }

  async readCars() {
    var response;

    try {
      response = await fetch(
        SERVER_URL + `api/cars?size=${this.state.rowsPerPage}&page=${this.state.page}&sort=${this.state.orderBy},${this.state.order}`,
        {headers: {'Authorization': 'Bearer ' + this.state.access_token}}
      );
    } catch (error) {
      throw new Error("Unable to fetch cars. A network error probably occurred. Original message: " + error.message);
    }

    if(!response.ok) {
      throw new Error("HTTP status code " + response.status);
    }
    
    const data = await response.json();

    this.setState({
      count: data.page.totalElements,
      cars: data._embedded.cars.map(
        ({ brand, model, color, year, price, _links: { self: { href } } }) => {
          return { brand: brand, model: model, color: color, year: year, price: price, url: href };
        }
      )
    });

  }

  async updateCar(car) {
    var response;

    try {
      response = await fetch(car.url, 
        {
          method:'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.access_token
          },
          body: JSON.stringify(car)
        }
      );
    } catch (error) {
      throw new Error("Unable to update car. A network error probably occurred. Original message: " + error.message);
    }

    if(!response.ok) {
      throw new Error("HTTP status code " + response.status);
    }

  }

  async delete(url) {
    var response;

    try {
      response = await fetch(url, 
        {
          method: 'DELETE', 
          headers: {
            'Authorization': 'Bearer ' + this.state.access_token
          }
        }
      );
    } catch (error) {
      throw new Error("Unable to delete car. A network error probably occurred. Original message: " + error.message);
    }

    if(!response.ok) {
      throw new Error("HTTP status code " + response.status);
    }

  }

  async login(username, password) {
    var response;
    
    try {
      response = await fetch(SERVER_URL + "authenticate", 
        {
          method:'POST', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username: username, password: password})
        }
      ); 
    } catch (error) {
      throw new Error("Unable to login. A network error probably occurred. Original message: " + error.message);
    }

    if(!response.ok) {
      throw new Error("HTTP status code " + response.status);
    }
     
    const data = await response.json();

    this.setState({access_token: data.access_token});

  }

  handleChangeSort(columnName) {
    this.setState(state => {
      return {orderBy: columnName, order: !(columnName === state.orderBy) ? 'asc':  state.order === 'asc' ? 'desc' : 'asc'}
    },
    () => this.readCars().catch(err => alert(err.message))
    )
  }

  createTableSortLabel(columnName) {
    return <TableSortLabel 
              active={this.state.orderBy === columnName} 
              direction={this.state.order} 
              onClick={() => this.handleChangeSort(columnName)}> 
                {columnName}  
           </TableSortLabel>
  }

  render() {
    return (
      <div>
        <div style={{display: 'flex'}}>
          <div style={{flex: 1, textAlign: 'center'}}>
            <AddCarModal onAddCar={car => this.createCar(car).then(r => this.readCars()).catch(err => alert(err.message))}/>
            <CSVLink filename={"car-info.csv"} data={this.state.cars} >
              Export to CSV
            </CSVLink>
          </div>
          <div style={{marginLeft: 'auto'}}>
            <Button variant="contained" color="secondary" style={{textAlign: 'right'}} onClick={() => this.setState({access_token: null})}> Logout </Button>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell> {this.createTableSortLabel('brand')} </TableCell>
                <TableCell> {this.createTableSortLabel('model')} </TableCell>
                <TableCell> {this.createTableSortLabel('color')} </TableCell>
                <TableCell> {this.createTableSortLabel('year')} </TableCell>
                <TableCell> {this.createTableSortLabel('price')} </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.cars.map((car, idx) => 
                <TableRow key={idx}>
                  <TableCell> <DriveEtaIcon/> </TableCell>
                  <TableCell>{car.brand}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.color}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>{car.price}</TableCell>
                  <TableCell>
                    <IconButtonWithHoverInfo info="Edit car" color="primary" onClick={() => this.setState({editCar: car})}> 
                      <EditIcon/> 
                    </IconButtonWithHoverInfo>
                  </TableCell>
                  <TableCell>
                    <IconButtonWithHoverInfo info="Delete car" color="secondary" onClick={() => this.delete(car.url).then(r => this.readCars()).catch(err => alert(err.message))}> 
                      <DeleteIcon/> 
                    </IconButtonWithHoverInfo>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
          rowsPerPageOptions={[2, 5, 10]}
          component="div"
          count={this.state.count}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onChangeRowsPerPage={event => this.setState({rowsPerPage: event.target.value, page: 0}, () => this.readCars().catch(err => alert(err.message)))}
          onChangePage={(event, newPage) => this.setState({page: newPage}, () => this.readCars().catch(err => alert(err.message)))}
        />
        </TableContainer>

        <CarForm 
          key={this.state.editCar ? this.state.editCar.url : undefined} 
          open={this.state.editCar !== null} 
          car={this.state.editCar} 
          onSubmitCar={car => this.updateCar(car).then(r => this.readCars()).catch(err => alert(err.message))} 
          onClose={() => this.setState({editCar: null})} 
        />

        <LoginForm open={this.state.access_token === null} onSubmitCredentials={(user, pass) => this.login(user, pass).then(r => this.readCars()).catch(err => alert(err.message))}/>

      </div>
    );
  }
}

export default App;
