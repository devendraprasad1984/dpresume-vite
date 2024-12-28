import React from 'react'

interface IPokemon {
    id: number,
    name: string,
    image: string
}

function PokemonHome(
    {
        pokemon
    }: {
        pokemon: IPokemon[]
    }
) {
    return (
        <>
            <h1>Pokemons</h1>
            <div>{JSON.stringify(pokemon)}</div>
        </>
    )
}

export default PokemonHome

