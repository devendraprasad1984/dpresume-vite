import React from 'react'
import treeDataset2 from "../data/treeDataset2"
import Tree from 'react-tree-graph'
import 'react-tree-graph/dist/headerStyle.css'

const TreeExample2 = (props) => {
    const getNodes=node=>{
        console.log(node)
    }
    return <div>
        <Tree
            data={treeDataset2}
            height={300}
            width={700}
            nodeShape='circle'
            svgProps={{className: 'custom'}}
            pathProps={{className: 'link'}}
            // margins={{ bottom : 10, left : 20, right : 150, top : 10}}
            // getChildren={node=>getNodes(node)}
        />
    </div>
}
export default TreeExample2
