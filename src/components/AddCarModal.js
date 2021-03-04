import React from 'react';
import Button from '@material-ui/core/Button';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import CarForm from './CarForm'

class AddCarModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    render() {
        const car = {brand: "", model: "", color: "", year: "", price:""}
        return (
            <span>
                <Button 
                variant="contained" 
                color="primary" 
                endIcon={<DriveEtaIcon/>} 
                onClick={() => this.setState({open: true})}>
                    Add
                </Button>

                <CarForm car={car} onSubmitCar={this.props.onAddCar} open={this.state.open} onClose={() => this.setState({open: false})} />
            </span>
        );
    }
}

export default AddCarModal;