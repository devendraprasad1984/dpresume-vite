import React from 'react';
import {View} from 'react-native';
import {CSS} from "../common/gcss";
import CustomInput from "../common/customInput";

export default function SearchBar(props) {
    const searchText = (val2Search) => {
        let result = props.categories.filter(x => {
                let what2search = val2Search.toLowerCase()
                return x.category.toLowerCase().indexOf(what2search) !== -1
                    || x.description.toLowerCase().indexOf(what2search) !== -1
                    || x.detail_description.toLowerCase().indexOf(what2search) !== -1
            }
        );
        props.searchRender(result);
    }

    return (
        <View style={CSS.textContainer}>
            <CustomInput placeholder='Search Categories and contents within' onChange={searchText}/>
        </View>
    );
}
