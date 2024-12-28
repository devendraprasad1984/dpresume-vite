const setDispatchStorageEvent = (type, event) => window.dispatchEvent(new StorageEvent(type, event));
const setDispatchEvent = (type, event) => window.dispatchEvent(new CustomEvent(type, event));
const dispatch = (type) => (event) => setDispatchEvent(type, event);
dispatch.setupEvent = setDispatchEvent;
dispatch.setupStorageEvent = setDispatchStorageEvent;

export default dispatch;
