import {useContext} from "react";
import AppContext from "../context/appContext";
import {config} from "../configs/config";

const useApp=()=>{
  const {appConfig} = useContext(AppContext)
  const myAppConfig = appConfig?.config
  const myAppOrg = appConfig?.org[0]

  const allOtherConfig = myAppConfig.filter(x=>x.key!==config.enums.appGlobal.memberType)
  const memberType = myAppConfig.filter(x=>x.key===config.enums.appGlobal.memberType)

  const allConfig = {}
  for(let o of allOtherConfig){
    allConfig[o.key]=o.value
  }
  return {
    myAppConfig,
    myAppOrg,
    gconfig:{
      ...allConfig,
      memberType
    }
  }
}
export default useApp