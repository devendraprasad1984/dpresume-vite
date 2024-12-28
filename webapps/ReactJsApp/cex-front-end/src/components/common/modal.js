import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "./Button";

function getModalStyle() {
    return {
        top:'50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
    }
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: "white",
        border: '2px solid #000',
        borderRadius:'10px',
        padding: "10px",
    },
}))

// https://material-ui.com/components
export default function Modalify(props) {
    const {header, text, ok, callback, state} = props
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);

    const hide = () => {
        callback(false)
    }

    const bottomBtn = () => {
        return <div className='inrow'>
            <Button val='ok' click={ok || hide}/>
            <Button val='cancel' click={hide}/>
        </div>
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">{header}</h2>
            <span id="simple-modal-description">{text}</span>
            {bottomBtn()}
        </div>
    );

    const xchild = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">{header}</h2>
            <div id="simple-modal-description">{props.children}</div>
            {bottomBtn()}
        </div>
    );


    return <Modal
        disableBackdropClick
        open={state}
        onClose={hide}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        {typeof props.children !== "undefined" ? xchild : body}
    </Modal>
}
