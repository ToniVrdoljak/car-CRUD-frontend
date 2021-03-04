import React from 'react';
import Popover from '@material-ui/core/Popover';

function withHoverInfo(Comp) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {hover: false, anchor: null};
            this.handleOpen = this.handleOpen.bind(this);
            this.handleClose = this.handleClose.bind(this);
        }

        handleOpen(event) {
            this.setState({hover: true, anchor: event.target});
        }

        handleClose() {
            this.setState({hover: false, anchor: null});
        }

        render() {
            return (
                <div>
                    <Comp {...this.props} onMouseEnter={this.handleOpen} onMouseLeave={this.handleClose}>
                        {this.props.children}
                    </Comp>
                    
                    <Popover 
                    style={{pointerEvents: 'none'}}
                    disableRestoreFocus
                    open={this.state.hover}
                    anchorEl={this.state.anchor} 
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}>
                        {this.props.info}
                    </Popover>
                </div>
            )
        }
    }
}

export default withHoverInfo;