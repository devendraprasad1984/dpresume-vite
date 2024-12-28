import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(4),
        },
    },
}));

export default function Progress(props) {
    const classes = useStyles();
    const {loader, val} = props
    return (
        <div className={classes.root}>
            {!loader?<CircularProgress variant="determinate" color={'primary'} value={val}/>
            :<CircularProgress color={'primary'}/>}
        </div>
    );
}
