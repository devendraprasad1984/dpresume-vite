import React from "react";
import contactList from '../../data/listOfContacts'

const ContactList = props => {
    const {searchValue} = props
    const isInputSearchGiven = searchValue !== '' && searchValue !== undefined
    const msg = isInputSearchGiven ? ` searching for ${searchValue}` : ''

    const displayList = () => {
        const contactsCopy = JSON.parse(JSON.stringify(contactList))
        let filteredContacts = []
        if (isInputSearchGiven)
            filteredContacts = contactsCopy.filter(row => row.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1)
        else
            filteredContacts = contactsCopy

        return filteredContacts.map((row, index) => {
            const {avatar, name} = row
            return <div key={'list-contact-row' + index} className={'flex-row'}>
                <div className='wid-20'><img className='img-avatar' src={avatar}/></div>
                <div className='wid-80 left'>{name}</div>
            </div>
        })
    }

    return <div>
        <h3>my list {msg} </h3>
        <div>{displayList()}</div>
    </div>
}


export default ContactList
