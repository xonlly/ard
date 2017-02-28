
import React from 'react'

import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

export const Devices = ({ list, value, onChange }) => (
    <DropDownMenu
        value={ value }
        onChange={ (event, index, newValue) => !newValue
            ? onChange( false )
            : onChange( list.find( x => x.deviceId == newValue ) )
        }>
            <MenuItem value={ false } primaryText="Select a camera" />
            { list.filter( x => x.kind == 'videoinput' ).map( x => (
                <MenuItem
                    key={ x.deviceId }
                    value={ x.deviceId }
                    primaryText={ x.label } />
            ) ) }
    </DropDownMenu>
)

const resolutions = [
    320,
    640,
    1024,
    1280,
    1920,
    2560,
]

export const Resolutions = ({ value, onChange }) => (
    <DropDownMenu
        value={ value }
        onChange={ (event, index, value) => onChange( value ) }>

        { resolutions.map( x => (
            <MenuItem
                key={ x }
                value={ x }
                primaryText={ x } />
        ) ) }

    </DropDownMenu>
)
