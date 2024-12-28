import {Box} from '@chakra-ui/react'
import AddTodo from "../UI/AddTodo";
import TodoList from "../UI/TodoList";
import PokemonHome from "../UI/Pokemon";


export async function getServerSideProps() {
    const resp = await fetch("https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json")
    return {
        props: {pokemon: await resp.json()}
    }
}


export default function Home(props) {
    return (
        <Box maxWidth='8x1' margin='auto' p={5}>
            <span>Hello DP next project - todo - SSR-next - mobx</span>

            <AddTodo/>
            <TodoList/>

            <PokemonHome pokemon={props.pokemon}/>
        </Box>
    )
}
