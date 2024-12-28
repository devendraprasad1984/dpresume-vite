import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import {CSS} from "../common/gcss";
import TopAppName from "../common/topAppName";
import {Heading} from "../common/Heading";
import getFromAPI from "../common/getFromAPI";
import {Config, Enum} from "../common/Config";
import Loading from "../common/Loading";
import CustomInput from "../common/customInput";
import AppButton from "../common/AppButton";
import AppIcon from "../common/AppIcon";
import AppImage from "../common/AppImage";
import makeDeepCopy from "../common/makeDeepCopy";
import PopupToast from "../common/PopupToast";
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import {getSetCart} from "../redux/actionCreators";
import AlertX from "../common/alertX";


function Catalogue(props) {
    const {params} = props.route
    const {item, color, bg} = params
    const {category} = item
    const [products, setProducts] = useState([])
    const [productsClone, setProductsClone] = useState([])
    const [productsImages, setProductImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [cartObj, setCartObj] = useState({})
    let modalRef = createRef()
    const [searchVal, setSearchVal] = useState('')

    useEffect(() => {
        setLoading(true);
        getFromAPI(Config.productsEndPoint, (pr) => {
            if (pr.status === Enum.successMsg) {
                setProducts(makeDeepCopy(pr.products));
                setProductsClone(pr.products);
                setProductImages(pr.images);
                setLoading(false);
            }
        });
    }, []);

    const handleItemInfo = (info) => {
        modalRef.show('details', info, Enum.colorTypes.default, false)
    }

    const add2cart = (pr) => {
        let {id,name,price,tax,discount}=pr
        let exist=cartObj[id]
        let qty = exist===undefined ? 1 : exist.qty+1
        let calc = calcLine(pr,qty)
        let {amount, xline}=calc
        let obj= {...cartObj}
        obj[id] = {id, name, qty, amount, tax, price, discount, xline}
        props.getSetCart(obj)
        setCartObj(obj)
        setSaved(true)
        // console.log('updating....',obj)
        // modalRef.show(pr.name + ' saved to cart', '', Enum.colorTypes.success)
    }

    const calcLine = (pr,qty=1) => {
        let {price, tax, discount} = pr;
        let xline = Enum.rupee + (price*qty) + '+' + tax + Enum.perc + '-' + discount + Enum.perc
        let amount = Math.round(parseFloat(price*qty) + parseFloat(parseFloat(price) * parseFloat(tax / 100)) + parseFloat(discount), 1)
        xline += ' = ' + Enum.rupee + amount
        return {xline, amount}
    }

    const renderProducts = () => {
        const defaultUri = Enum.MedLoader;
        return productsClone.map((pr, i) => {
            if (i >= 50) return null;
            const foundImage = productsImages.filter(x => parseInt(x.productid) === parseInt(pr.id));
            let isImageAvailable = false;
            let imageUri = '';
            if (foundImage.length > 0) {
                imageUri = foundImage[0].uri;
                isImageAvailable = true;
            }
            let {id, name, description} = pr;
            return <View key={`product${id}`} style={[CSS.card]}>
                {!isImageAvailable ? <AppImage uri={defaultUri} med={true} style={CSS.imgx}/> :
                    <AppImage uri={imageUri} style={CSS.imgx}/>}
                <View style={[CSS.cardInfo]}>
                    <View style={[CSS.inrow]}>
                        <Heading val={name}/>
                        <AppIcon name={'medical-bag'} mat={true} onPress={() => add2cart(pr)}/>
                    </View>
                    <View>
                        <View style={CSS.inrow}>
                            <Heading sub={true} val={calcLine(pr).xline}/>
                            <AppIcon name={'information-outline'} mat={true}
                                     onPress={() => handleItemInfo(description)}/>
                        </View>
                        <Text style={CSS.cardDetails}>{description.substr(0, 100)}</Text>
                    </View>
                </View>
            </View>
        })
    }
    const handleSearchProduct = () => {
        let searched = products.filter(x =>
            x.name.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1
            || x.description.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1
        );
        // console.log('searched',searchVal);
        setProductsClone(searched);
    }
    const mainRender = () => {
        if (loading) return <Loading/>;
        return renderProducts();
    }
    const handleSpeak = () => {
        alert('start speaking')
        // Web(Config.voicey,res=>console.log(res));
    }
    const handleNav = (scrname) => {
        //props.navigation.navigate(scrname, {cart: cartObj})
        props.navigation.navigate(scrname, {})
    }
    return <SafeAreaView style={CSS.xview}>
        <AlertX val='saved' saved={saved} cb={(x)=>setSaved(x)}/>
        <PopupToast ref={(target) => modalRef = target}/>
        <TopAppName {...props}/>
        <Heading val={category}/>
        <View style={[CSS.inrow]}>
            <CustomInput width={250} placeholder={'Search Products'} onChange={val => setSearchVal(val)}
                         value={searchVal} submit={handleSearchProduct}/>
            <AppButton onPress={handleSearchProduct} icon='search'/>
            <AppButton onPress={() => handleNav(Enum.screenName.cart)} icon='cart' mat={true}/>
        </View>
        <View style={CSS.inrow}>
            <Text>displaying 50 result(s) only</Text>
            <AppButton icon='speaker-wireless' mat={true} onPress={handleSpeak}/>
        </View>
        <ScrollView>
            <View>{mainRender()}</View>
        </ScrollView>
    </SafeAreaView>;
}
const mapx=state=>{
    return {
        cart:state.cart.cart
    }
}
const mapd=dispatch=>{
    return {
        ...bindActionCreators({getSetCart}, dispatch)
    }
}
export default connect(mapx,mapd)(Catalogue)
