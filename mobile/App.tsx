//Packages
import React from 'react';
import { AppLoading } from 'expo'
import { StatusBar } from 'react-native'
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto'
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu'

//Paginas
import Routes from './src/routes'

export default function App() {
  //useFont sera carregada antes ded tudo
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  })

  //se nao carregou, vai monstrar um spinning
  if(!fontsLoaded){
    return <AppLoading />
  }
  //nao consegue retirnar dois ou mais componentes no return
  //deve retonar uma VIEW ou utilizar o Fragment <>
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  )
}