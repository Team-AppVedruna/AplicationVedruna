import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export function IncidenciasScreen() {
  const [incidencias, setIncidencias] = useState([]);
  const navigation = useNavigation();

  const fetchIncidencias = () => {
    fetch('http://192.168.1.147:8080/proyecto01/tickets')
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
            <Text style={[styles.estado, { color: item.color || '#9FC63B' }]}>
              {item.estado || 'PENDIENTE'}
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
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9FC63B',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#323639',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9FC63B',
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