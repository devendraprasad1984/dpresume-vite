import React from "react";
import BinaryTree from 'family-binary-tree'
import {SubedarTree, GhanshyamTree} from '../familyTreeData.js'


const FamilyTree = () => {
    return (
        <>
            <div className='row'>
                <div className='column'>
                    <div>Sh Swargiya Subedar Maharaj Tree</div>
                    <div className='wid50'>
                        <BinaryTree allUsers={SubedarTree} rootUser={SubedarTree[0]}/>
                    </div>
                </div>


                <div className='column'>
                    <div>Sh Swargiya Ghanshyam Maharaj Tree</div>
                    <BinaryTree allUsers={GhanshyamTree} rootUser={GhanshyamTree[0]}/>
                </div>
            </div>
        </>
    )
}

export default FamilyTree