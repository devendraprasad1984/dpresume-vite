import React from 'react'
import {Drawer} from "antd";
import './drawer.css'

type Props = {
    children: JSX.Element,
    placement: 'top' | 'right' | 'bottom' | 'left',
    title?: string,
    onClose: () => void,
    visible: boolean
}
const DrawerNav: React.FC<Props> = (props): JSX.Element => {
    const {placement, title, children, onClose, visible} = props

    return <Drawer
        title={title}
        placement={placement}
        closable={false}
        onClose={onClose}
        visible={visible}
        key={placement}
    >
        {children}
    </Drawer>
}

export default React.memo(DrawerNav)