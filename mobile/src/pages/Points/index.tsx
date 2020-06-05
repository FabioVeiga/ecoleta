import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Mapview, { Marker } from 'react-native-maps'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { SvgUri } from 'react-native-svg' //para usar SGV endereco externo
import api from '../../services/api'

interface Items{
  id: number
  title: string
  image_url: string
}

const Points = () => {
    const [items, setItems] = useState<Items[]>([])
    const navigation = useNavigation()

    useEffect(() => {
      api
      .get('items')
      .then(response => {
        setItems(response.data)
      })
    },[])

    function handleNavigationBack(){
        navigation.goBack()
    }

    function handleNavigateToDetail(){
        navigation.navigate('Detail')
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
                    <Mapview 
                        style={styles.map} 
                        initialRegion={{
                            latitude: -23.4698782,
                            longitude: -46.6829469,
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014
                        }}
                    >
                        <Marker
                            style={styles.mapMarker}
                            onPress={() => {handleNavigateToDetail()}}
                            coordinate={{
                                latitude: -23.4698782,
                                longitude: -46.6829469,
                            }} 
                        >

                            <View style={styles.mapMarkerContainer}>
                                <Image
                                    style={styles.mapMarkerImage} 
                                    source={{uri:'https://images.unsplash.com/photo-1506617420156-8e4536971650?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=80'}}
                                />
                                <Text style={styles.mapMarkerTitle}>Mercado</Text>
                            </View>
                        </Marker>
                    </Mapview>
                </View>

                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 20}}
                >
                    <View style={styles.itemsContainer}>
                        {items.map(item => (
                          //sempre  precisa ter uma key e no react-navite deve ser string
                          <TouchableOpacity key={String(item.id)} style={styles.item} onPress={() => {}} >
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