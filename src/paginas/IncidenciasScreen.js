
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export function IncidenciasScreen() {
  const [incidencias, setIncidencias] = useState([]);
  const navigation = useNavigation();

  const fetchIncidencias = () => {
    fetch('http://192.168.1.38:8080/proyecto01/tickets')
      .then(res => res.json())
      .then(data => setIncidencias(data))
      .catch(err => {
        console.error('Error al obtener incidencias:', err);
        Alert.alert('Error', 'Hubo un problema al cargar las incidencias');
      });
  };

  useEffect(() => {
    // Cargar incidencias al iniciar
    fetchIncidencias();

    // Configurar intervalo para recargar cada 10 segundos
    const intervalId = setInterval(() => {
      fetchIncidencias();
    }, 10000); // 10000 ms = 10 segundos

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []); 

  return (
    <View style={styles.container}>
      <Text style={styles.header}>INCIDENCIAS</Text>
      <FlatList 
        data={incidencias}
        keyExtractor={(item) => item.id.toString()} // Asegúrate de convertir a string
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={[styles.estado, { color: item.color || '#F19100' }]}>
              {item.estado || 'EN TRÁMITE'}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CrearIncidenciaScreen')}
      >
        <Ionicons name="add" size={32} color="#23272A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#23272A',
      padding: 20,
      paddingTop: 60, 
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#9FC63B',
        marginBottom: 10,
        textAlign: 'center',
    },
    card: {
      backgroundColor: '#323639',
      padding: 18,
      borderRadius: 20,
      marginBottom: 10,
      marginTop: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#9FC63B',
      textTransform: 'uppercase',

    },
    estado: {
      fontSize: 14,
      marginTop: 5,
    },
    fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#9FC63B',
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowOffset: { width: 2, height: 2 },
    },
  });
