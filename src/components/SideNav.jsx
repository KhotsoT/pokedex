import { useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../utils"

export function SideNav(props) {
    const { selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu } = props
    const [searchValue, setSearchValue] = useState('')
    const filteredPokemon = first151Pokemon.filter((val, valIndex) => {
        // Check by Pokedex Number
        if ((getFullPokedexNumber(valIndex)).includes(searchValue)) {
            return true
        }
        // Check by Pokedex name
        if (val.toLowerCase().includes(searchValue.toLowerCase())) {
            return true
        }
        return false

    })
    return (
        <nav className={' ' + (!showSideMenu
            ? ' open'
            : ' '
        )}>
            <div className={"header " + (!showSideMenu
                ? ' open'
                : ' '
            )}>
                <button onClick={handleCloseMenu} className="open-nav-button">
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Pokedex</h1>
            </div>
            <input placeholder="E.g 001 or bul..." value={searchValue} onChange={(e) => {
                setSearchValue(e.target.value)
            }} />

            {filteredPokemon.map((pokemon, pokemonIndex) => {
                return (
                    <button onClick={() => {
                        setSelectedPokemon(first151Pokemon.indexOf(pokemon))
                        handleCloseMenu()
                    }} key={pokemonIndex} className={'nav-card ' +
                        (pokemonIndex === selectedPokemon
                            ? 'nav-card-selected'
                            : ' '
                        )
                    }>
                        <p>{getFullPokedexNumber(first151Pokemon.indexOf(pokemon))}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}