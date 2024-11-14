import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import { TypeCard } from "./TypeCard"
import { Modal } from "./Modal"

export function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)
    const { name, height, abilities, stats, types, moves, sprites } = data || {}
    const imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) {
            return false
        }
        if (['versions', 'other'].includes(val)) {
            return false
        }
        return true
    })

    async function fetchMoveData(move, moveUrl) {
        let cachedData = {}

        if (loadingSkill || !localStorage || !moveUrl) {
            return
        }
        // Check if move is in Cache
        if (localStorage.getItem('pokemon-moves')) {
            cachedData = JSON.parse(localStorage.getItem('pokemon-moves'))
        }
        if (move in cachedData) {
            setSkill(cachedData[move])
            console.log('We Found MOVE CACHED...: ', cachedData[move])
            return
        }
        // Get move's more details from API
        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetched from API: ', moveData)
            const description = moveData?.flavor_text_entries.filter
                (val => {
                    return val.version_group.name = 'firered-leafgreen'
                })[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }

            setSkill(skillData)
            // Cache the move
            cachedData[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(cachedData))

        } catch (error) {
            console.log(error)
        } finally {
            setLoadingSkill(false)
        }

    }

    useEffect(() => {
        //  STEPS TO FOLLOW
        //  1. If loading, or no cache exists, exit logic
        if (loading || !localStorage) { return }
        //  2. Define Cache.
        let cache = {}
        // Check to see if we've cached it before
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }
        //  3. Check if the selected Pokemon data is available in the cache, otherwise fetch from API
        if (selectedPokemon in cache) {
            // Read from cache
            setData(cache[selectedPokemon])
            console.log('We found POKEMON CACHED...: ', cache)
            return
        }
        // Fetch from API
        async function fetchPokemonData() {
            setLoading(true)
            try {

                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                console.log('Fetched Pokemon Data')
                setData(pokemonData)
                //  4. Cache the fetched data
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))

            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (

        <div className="poke-card">
            {skill && (
                <Modal handleCloseModal={() => { setSkill(null) }}>
                    <div>
                        <h6>Name</h6>
                        <h2 className="skill-name">{skill.name.replaceAll('-', ' ')}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.description}</p>
                    </div>
                </Modal>
            )}

            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}
            </div>
            <img className="default-img" src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) +
                '.png'} alt={`${name}-large-img`} />
            <div className="img-container">
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
                <div>
                    <h3>Stats</h3>
                    <div className="stats-card">
                        {stats.map((statObj, statIndex) => {
                            const { stat, base_stat } = statObj
                            return (
                                <div key={statIndex} className="stat-item">
                                    <p>{stat?.name.replaceAll('-', ' ')}</p>
                                    <h4>{base_stat}</h4>
                                </div>
                            )
                        })}
                    </div>
                    <h3>Moves</h3>
                    <div className="pokemon-move-grid">
                        {moves.map((moveObj, moveIndex) => {
                            return (
                                <button className="button-card pokemon-move" key={moveIndex} onClick={() => {
                                    fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                                }}>
                                    <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                                </button>


                            )
                        })}
                    </div>
                </div>
            </div>
        </div >
    )
}