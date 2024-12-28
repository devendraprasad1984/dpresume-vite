import React, {useCallback, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom'
import PropTypes from "prop-types";
import useAPI from "../hooks/useAPI";
import NoData from "../components/common/nodata";
import {config} from "../configs/config";
import '../css/products.css'
import Image from "../components/common/img";
import {sortByField} from "../configs/utils";
import {connect} from "react-redux";

const Products = props => {
    const {filters} = props

    const history = useHistory()
    const [productList, setProductList] = useState([])
    const [noFilter, setNoFilter] = useState(true)

    const {data, loading, error} = useAPI(config.endpoints.CATALOG)
    useEffect(() => {
        if (data === undefined) return
        setProductList(sortByField(data, config.app_enums.price))
    }, [loading])

    const navigateToProductDetailPage = (id) => {
        const to = `${config.navigate.productDetail}/${id}`
        // window.open(to,'_blank')
        history.push(to)
    }

    const getFilterObject = () => {
        const _colorFilter = filters[config.app_enums.color] || []
        const _genderFilter = filters[config.app_enums.gender] || []
        const _priceFilter = filters[config.app_enums.price] || []
        return {_colorFilter, _genderFilter, _priceFilter}
    }

    const checkPriceFilter = (price) => {
        const {_priceFilter} = getFilterObject()
        const priceFilterResults = _priceFilter.map((range) => {
            const hasToRange = range.indexOf('-') !== -1
            const rangeArr = hasToRange ? range.split('-') : range
            let start = 0
            let end = 0
            if (hasToRange) {
                start = parseFloat(rangeArr[0])
                end = parseFloat(rangeArr[1])
                return price >= start && price <= end
            } else {
                start = parseFloat(rangeArr)
                return price >= start
            }
        })
        return priceFilterResults.indexOf(true) !== -1
    }
    useEffect(() => {
        const {_colorFilter, _genderFilter, _priceFilter} = getFilterObject()
        const filterFlag = _colorFilter.length === 0 && _genderFilter.length === 0 && _priceFilter.length === 0
        setNoFilter(filterFlag)
    }, [filters])

    const displayProductList = useCallback(() => {
        if (productList.length === 0) return
        let canDisplayItem = true
        return productList.map((prod, index) => {
            const {id, name, imageURL, price, currency, color, gender} = prod
            const {_colorFilter, _genderFilter} = getFilterObject()
            if (noFilter === false)
                canDisplayItem = (
                    _colorFilter.indexOf(color.toLowerCase()) !== -1
                    || _genderFilter.indexOf(gender.toLowerCase()) !== -1
                    || checkPriceFilter(price)
                )
            if (canDisplayItem === false) return null
            return <div key={'prod-item-' + id} className='grid-item click'
                        onClick={() => navigateToProductDetailPage(id)}>
                <Image className='img-product' src={imageURL}/>
                <span>
                    <h3>{name}</h3>
                    <p>{currency}{price}</p>
                </span>
            </div>
        })
    }, [noFilter, filters, loading, productList])

    if (loading || (error !== undefined && error !== null)) return <NoData/>
    return <div>
        <h2 className='margin-rl'>{props.title}</h2>
        <div className='grid-container'>{displayProductList()}</div>
    </div>
}

Products.propTypes = {
    title: PropTypes.string.isRequired
}
const mapx = (state, ownProps) => {
    return {
        filters: state.filters.filters,
    }
}
export default React.memo(connect(mapx)(Products))

