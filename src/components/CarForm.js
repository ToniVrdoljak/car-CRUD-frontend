import React from 'react'
import Button from '@material-ui/core/Button';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class CarForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.car
        
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmitCar = this.handleSubmitCar.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
    }

    handleClose() {
        this.props.onClose();
        this.setState(this.props.car);
    }

    handleSubmitCar() {
        this.props.onSubmitCar(this.state);
        this.handleClose();
    }

    render() {
        if (!this.props.open) {
            // This is done this way so if car is null nothing will render, otherwise there would be a null exception.
            return null;
        }

        return (
            <Dialog className="App" open={true} onClose={this.handleClose}>
                <DialogTitle> <DriveEtaIcon color="primary" /> </DialogTitle>
                <DialogContent>
                    <DialogContentText> Enter car information </DialogContentText>
                    <TextField id="brand" type="text" label="Brand" value={this.state.brand} onChange={this.handleChange}/>
                    <br/>
                    <TextField id="model" type="text" label="Model" value={this.state.model} onChange={this.handleChange}/>
                    <br/>
                    <TextField id="color" type="text" label="Color" value={this.state.color} onChange={this.handleChange}/>
                    <br/>
                    <TextField id="year" type="text" label="Year" value={this.state.year} onChange={this.handleChange}/>
                    <br/>
                    <TextField id="price" type="text" label="Price" value={this.state.price} onChange={this.handleChange}/>
                    <br/>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={this.handleSubmitCar}> Submit </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default CarForm;