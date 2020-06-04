import React from 'react'
import { NavigationContainer, Route } from '@react-navigation/native'
//navegacao em pilha pode navegar sem deixar da tela anterior existir
import { createStackNavigator } from '@react-navigation/stack'

import Home from './pages/home'
import Points from './pages/Points'
import Detail from './pages/Detail'

//ele que ira funcionar como navigator
const AppStack = createStackNavigator()

const Routes = () => {
    return(
        //sempre precisa esta por volta de toda navegacao
        <NavigationContainer>
            <AppStack.Navigator 
            headerMode="none" 
            screenOptions={{
                //pra todas as telas vai aplicar o estilo
                cardStyle:{
                    backgroundColor: '#f0f0f5'
                }
            }}>
                <AppStack.Screen name="Home" component={Home}/>
                <AppStack.Screen name="Points" component={Points}/>
                <AppStack.Screen name="Detail" component={Detail} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}

export default Routes