import React from 'react'

function Infraction(props) {
    return (
        <label className="btn btn-block active light-background darktext">
            <input id={"infraction_" + props.id} type="checkbox" name={"infraction_" + props.id}></input>
                {props.infraction_description}
            
        </label>
    )
}

export default Infraction
