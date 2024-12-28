const makeDeepCopy=(objData)=>{
    return JSON.parse(JSON.stringify(objData));
}

export default makeDeepCopy;
