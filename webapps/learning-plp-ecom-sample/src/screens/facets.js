import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import useAPI from "../hooks/useAPI";
import NoData from "../components/common/nodata";
import {config} from "../configs/config";
import '../css/facets.css'
import {sortByField} from "../configs/utils";
import Input from "../components/common/input";
import {connect} from 'react-redux'
import Types from "../redux/types";

const Facets = props => {
    const {title, handleLeftPane, applyFilter, filters, fltr_color, fltr_gender, fltr_price} = props
    const [facetsList, setFacetsList] = useState([])
    const {data, loading, error} = useAPI(config.endpoints.FACETS)

    useEffect(() => {
        if (data === undefined) return
        setFacetsList(sortByField(data, config.app_enums.position))
    }, [loading])

    const handleCheckChange = (e) => {
        const keyval = e.target.getAttribute(config.app_enums.keyval)
        const keyValArr = keyval.split(':')
        const key = keyValArr[0].toLowerCase()
        const val = keyValArr[1].toLowerCase()
        const checked = e.target.checked
        let tmp = {...filters}
        if (checked) {
            tmp[key].push(val)
        } else {
            tmp[key] = tmp[key].filter(it => it !== val)
        }
        applyFilter({...tmp})
    }

    const displayValueColorGender = (name, values) => {
        if (values.length === 0) return
        // console.log('set filters', fltr_color, fltr_gender)
        const isFilterSet = fltr_color.length === 0 && fltr_gender.length === 0
        return values.map((item, index) => {
            const isColorSet = fltr_color.indexOf(item.toLowerCase()) !== -1
            const isGenderSet = fltr_gender.indexOf(item.toLowerCase()) !== -1
            const isCheckBoxToBeSet = isFilterSet===false && (isColorSet === true || isGenderSet === true)
            return <div key={'item-' + index}>
                <Input type='checkbox' label={item}
                       keyval={name + ':' + item} checked={isCheckBoxToBeSet} onChange={handleCheckChange}
                />
            </div>
        })
    }
    const displayValuePrice = (name, {counts}) => {
        if (counts.length === 0) return
        let countStringFilter = counts.filter(cnt => typeof cnt === 'string')
        let countIntegerFilter = counts.filter(cnt => typeof cnt !== 'string')
        const isFilterSet = fltr_price.length === 0
        return countStringFilter.map((item, index) => {
            let endStr = ' - ' + config.chars.doller
            let keyValEndStr = item
            if (index < countStringFilter.length - 1) {
                endStr += config.dp2(countStringFilter[index + 1] - 1)
                keyValEndStr += '-' + (countStringFilter[index + 1] - 1)
            } else {
                endStr = '+'
            }
            const isPriceSet = fltr_price.indexOf(keyValEndStr.toLowerCase()) !== -1
            const isCheckBoxToBeSet = isFilterSet===false && isPriceSet === true
            return <div key={'price-item-' + index}>
                <Input type='checkbox'
                       label={config.chars.doller + config.dp2(item) + endStr + ' (' + countIntegerFilter[index] + ')'}
                       keyval={name + ':' + keyValEndStr}  checked={isCheckBoxToBeSet} onChange={handleCheckChange}
                />
            </div>
        })
    }

    const displayFacets = () => {
        if (facetsList.length === 0) return
        return facetsList.map((facet, index) => {
            const {facetId, name, values} = facet
            return <div key={'prod-item-' + facetId}>
                <div className='bg-title pad10'>{name}</div>
                {Array.isArray(values) ? displayValueColorGender(name, values) : displayValuePrice(name, values)}
            </div>
        })
    }

    if (loading || (error !== undefined && error !== null)) return <NoData/>
    return <div className='column'>
        <div className='row'>
            <span>{title}</span>
            <span className='right'>
                <a onClick={handleLeftPane}>{config.chars.close}</a>
            </span>
        </div>
        <div className='box'>{displayFacets()}</div>
    </div>
}

Facets.propTypes = {
    title: PropTypes.string.isRequired,
    handleLeftPane: PropTypes.func
}

const mapStateToProps = state => {
    const filters = state.filters.filters
    return {
        filters,
        fltr_color: filters[config.app_enums.color],
        fltr_gender: filters[config.app_enums.gender],
        fltr_price: filters[config.app_enums.price]
    }
}
const mapDispatchToProps = dispatch => {
    return {
        applyFilter: (payload) => dispatch(Types().setFilterToStore(payload)),
    }
}
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Facets))

