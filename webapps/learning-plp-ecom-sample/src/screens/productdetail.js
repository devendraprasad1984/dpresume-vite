import React, {useEffect, useState} from "react";
import {useHistory, useParams} from 'react-router-dom'
import PropTypes from "prop-types";
import useAPI from "../hooks/useAPI";
import {config} from "../configs/config";
import NoData from "../components/common/nodata";
import Image from "../components/common/img";
import '../css/productDetail.css'

const ProductDetail = props => {
    const params = useParams()
    const history = useHistory()
    const paramId = params.id || '-1'

    const [productItem, setProductItem] = useState(null)
    const {data, loading, error} = useAPI(config.endpoints.CATALOG + '/' + paramId)
    useEffect(() => {
        if (data.length === 0) return
        setProductItem(data)
    }, [loading])

    const displayProductDetail = () => {
        if (productItem === null) return
        const {name, imageURL, price, currency, color, gender} = productItem
        return <div className='row'>
            <div className='leftPanel size400'>
                <Image src={imageURL} className='product-detail-image'/>
            </div>
            <div className='rightPanel column'>
                <h2>{name}</h2>
                <div>Item Cost: {currency}{price}, color: {color}</div>
                <div>for: {gender}</div>
            </div>
        </div>
    }

    if (loading || (error !== undefined && error !== null)) return <NoData/>
    return <div>
        <h2 className='right'><a className='click xred' onClick={() => history.goBack()}>BACK</a></h2>
        {displayProductDetail()}
    </div>
}
ProductDetail.propTypes = {
    title: PropTypes.string.isRequired
}
export default React.memo(ProductDetail)
