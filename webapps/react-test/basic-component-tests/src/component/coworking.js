import {useState} from "react";

const coworkers = [
    {id: 1, first_name: 'Max', last_name: 'Mustermann'},
    {id: 2, first_name: 'Vladmimir', last_name: 'Leles'},
    {id: 3, first_name: 'Tobias', last_name: 'Anhalt'},
];

const CoWorking = (props) => {
    const [workers, setWorkers] = useState(coworkers.map(worker => {
        return {...worker, status: 'offline'}
    }))

    const changeStatus = (id) => {
        let updatedWorkers = workers.map(worker => {
            if (worker.id === id) {
                worker.status = worker.status === 'offline' ? 'online' : 'offline'
            }
            return worker
        })
        setWorkers([...updatedWorkers])
    }

    return (<div>
        {
            workers.map(worker => {
                let {id, first_name, last_name, status} = worker
                return <div key={'workerid' + id}>
                    <span>{first_name} {last_name} - {status}</span>
                    <button onClick={() => changeStatus(id)}>Change Status</button>
                </div>
            })
        }
    </div>)
}


export default CoWorking