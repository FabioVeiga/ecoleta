import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import Mapview, { Marker } from 'react-native-maps'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SvgUri } from 'react-native-svg' //para usar SGV endereco externo
import * as Location from 'expo-location'
import api from '../../services/api'

interface Items{
  id: number
  title: string
  image_url: string
}

interface Point{
  id: number
  image: string
  image_url: string
  name: string
  latitude: number
  longetude: number
}

interface Params{
  uf: string
  city: string
}

const Points = () => {
    const [items, setItems] = useState<Items[]>([])
    const [selectedItems, setselectedItems] = useState<number[]>([])
    const [initialPosition, setinitialPosition] = useState<[number, number]>([0,0])
    const [points, setPoints] = useState<Point[]>([])
    
    const navigation = useNavigation()

    const route = useRoute()
    const routesParams = route.params as Params 

    useEffect(() => {
      async function loadPosition(){
        //pedindo permissao do usuario para a localizacao
        const { status } = await Location.requestPermissionsAsync()
        
        if(status !== 'granted'){
          Alert.alert('Oooops... Precisamos de sua permissão para obter sua localização!')
          return
        }

        const location = await Location.getCurrentPositionAsync()
        const { latitude, longitude } = location.coords
        //setando posicao
        setinitialPosition([
          latitude,
          longitude
        ])
      }
      loadPosition()
    },[])

    useEffect(() => {
      api
      .get('items')
      .then(response => {
        setItems(response.data)
      })
    },[])

    useEffect(() => {
      api
      .get('points', {
        params:{
          city: routesParams.city,
          uf: routesParams.uf,
          items: selectedItems
        }
      })
      .then(response => {
        setPoints(response.data)
      })
    }, [selectedItems])
   

    function handleNavigationBack(){
        navigation.goBack()
    }

    function handleNavigateToDetail(id: number){
        navigation.navigate('Detail', { point_id: id })
    }

    function handleSeletedItem(id: number){
      //armazena na variavel se o ID passado ja existe no array
      const alreadySeleted = selectedItems.findIndex(item => item === id)
      //se existe retira
      if(alreadySeleted >= 0){
          //ela vai contar todos os items menos o que precisa remover
          const filteredItems = selectedItems.filter(item => item !== id)
          setselectedItems(filteredItems)
      //senao add
      }else{
          //para nao mudar o state original, deve se "copiar" com o ... o estado e add o novo
          setselectedItems([...selectedItems, id])
      }
  }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigationBack}>
                    <Icon name="arrow-left" size={20} color='#34cb79'/>
                </TouchableOpacity>
                <Text style={styles.title}>Bem vindo</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    { initialPosition[0] !== 0 && (
                      <Mapview 
                          style={styles.map}
                          loadingEnabled={initialPosition[0] === 0}
                          initialRegion={{
                              latitude: initialPosition[0],
                              longitude: initialPosition[1],
                              //latitude: -23.4698782,
                              //longitude: -46.6829469,
                              latitudeDelta: 0.014,
                              longitudeDelta: 0.014
                          }}
                      >
                          {points.map(point => (
                            <Marker
                                key={String(point.id)}
                                style={styles.mapMarker}
                                onPress={() => handleNavigateToDetail(point.id)}
                                coordinate={{
                                    latitude: point.latitude,
                                    longitude: point.longetude
                                }} 
                            >
                                <View style={styles.mapMarkerContainer}>
                                    <Image
                                        style={styles.mapMarkerImage} 
                                        source={{uri:point.image_url}}
                                    />
                                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                </View>
                            </Marker>
                          ))}
                      </Mapview>
                    ) }
                </View>

                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 20}}
                >
                    <View style={styles.itemsContainer}>
                        {items.map(item => (
                          //sempre  precisa ter uma key e no react-navite deve ser string
                          <TouchableOpacity 
                            key={String(item.id)} 
                            style={[
                              styles.item,
                              //condicao dentrto da estilizacao
                              selectedItems.includes(item.id) ? styles.selectedItem : {}
                            ]} 
                            onPress={() => {handleSeletedItem(item.id)}}
                            activeOpacity={0.6}
                          >
                            <SvgUri width={42} height={42} uri={item.image_url} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points