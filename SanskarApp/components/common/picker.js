import React, {useEffect, useState} from 'react';
import {Picker, View} from 'react-native';

const PickerMenu = props => {
    const color = props.color || 'black';
    const [choosenLabel, setChoosenLabel] = useState('');
    const [choosenIndex, setChoosenIndex] = useState('0');
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    const onPickerChange = (itemValue, itemIndex) => {
        setChoosenLabel(itemValue);
        setChoosenIndex(itemIndex);
        props.onChange(itemValue, itemIndex);
    }

    const setDataToPicker = () => {
        return data.map((item, index) => {
            return <Picker.Item
                key={'itemPickerKey' + index}
                label={item}
                value={item}
                color={color}
            />
        })
    }
    return <View style={{flex: 1}}>
        <Picker
            itemStyle={{fontSize: 15, textAlign: 'center', height: 150}}
            selectedValue={choosenLabel}
            onValueChange={onPickerChange}
            mode={'dropdown'}>
            {setDataToPicker()}
        </Picker>
    </View>
};

export default PickerMenu;
