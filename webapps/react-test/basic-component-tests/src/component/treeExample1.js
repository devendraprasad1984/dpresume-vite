import React from 'react'
import TreeMenu from 'react-simple-tree-menu'
import treeDataSet1 from "../data/treeDataSet1";

const TreeExample1 = (props) => {
    const displayTreeMenu=()=>{
        return <TreeMenu
            cacheSearch
            data={treeDataSet1}
            debounceTime={125}
            disableKeyboard={false}
            hasSearch
            initialActiveKey="reptile/squamata"
            initialOpenNodes={[
                'reptile',
                'reptile/squamata',
                'reptile/squamata/lizard'
            ]}
            onClickItem={function noRefCheck(){}}
            resetOpenNodesOnDataUpdate={false}
        />
    }
    return <div>
        {displayTreeMenu()}
    </div>
}

export default TreeExample1
