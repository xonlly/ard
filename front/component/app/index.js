
import React from 'react'

import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Provider from 'material-ui/styles/MuiThemeProvider';
import Content from './app'

const App = () => {


    return (
        <Provider muiTheme={getMuiTheme(darkBaseTheme)}>
            <Content />
        </Provider>
    )
}

export default App
