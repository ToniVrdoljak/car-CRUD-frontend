import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username: "", password: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
    }

    handleSubmit() {
        this.props.onSubmitCredentials(this.state.username, this.state.password);
        this.setState({username: "", password: ""});
    }

    render() {
        return(
            <Dialog className="App" open={this.props.open} >
                <DialogTitle> Enter user credentials </DialogTitle>
                <DialogContent>
                    <TextField id="username" type="text" label="Username" value={this.state.username} onChange={this.handleChange}/>
                    <br/>
                    <TextField id="password" type="text" label="Password" value={this.state.password} onChange={this.handleChange}/>
                    <br/>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={this.handleSubmit}> Login </Button>
                </DialogActions>
            </Dialog>

        )
    }
}

export default LoginForm;