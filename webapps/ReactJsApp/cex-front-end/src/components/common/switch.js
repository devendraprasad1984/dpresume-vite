import React from 'react';
import {FormGroup, FormControlLabel, Switch} from '@material-ui/core';

const OnOff = React.forwardRef((props, ref) => {
    const {label, checked, toggle} = props
    return <FormGroup row>
        <FormControlLabel
            control={<Switch ref={ref} checked={checked} onChange={toggle}/>}
            label={label}
        />
    </FormGroup>
})

export default OnOff
