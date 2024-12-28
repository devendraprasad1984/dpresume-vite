const nodeClick = (event, node) => {
    alert(`Clicked ${node}!`)
}

const treeDataset2 = {
    name: 'Parent',
    gProps: {
        onClick: nodeClick
    },
    children: [
        {
            name: 'Child One',
            gProps: {
                onClick: nodeClick
            },
            children: [{
                name: 'Child Three Of One',
                gProps: {
                    onClick: nodeClick
                }
            }
            ]
        }, {
            name: 'Child Two',
            gProps: {
                onClick: nodeClick
            },
            children: [{
                name: 'Child Three Of Two',
                gProps: {
                    onClick: nodeClick
                }
            }
            ]
        }, {
            name: 'Child Three',
            gProps: {
                onClick: nodeClick
            },
            children: [{
                name: 'Child four Of XX',
                gProps: {
                    onClick: nodeClick
                }
            }
            ]
        }
    ]
};
export default treeDataset2
