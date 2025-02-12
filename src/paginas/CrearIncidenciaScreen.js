import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

export function CrearIncidenciaScreen() {
  const [equipo, setEquipo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const enviarIncidencia = () => {
    const incidenciaData = {
      equipo: equipo,
      titulo: titulo,
      descripcion: descripcion,
    };

    fetch('http://192.168.1.150:8080/proyecto01/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidenciaData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Incidencia enviada:', data);
        // Muestra un mensaje de éxito
        Alert.alert('Éxito', 'La incidencia fue enviada correctamente');
      })
      .catch((err) => {
        console.error('Error al enviar incidencia:', err);
        // Muestra un mensaje de error
        Alert.alert('Error', 'Hubo un error al enviar la incidencia');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>INCIDENCIA</Text>
      <View style={styles.imageContainer}>
        <Image source={require('../img/Contacts.png')} style={styles.image} />
      </View>
      <Text style={styles.label}>N° del equipo / clase:</Text>
      <TextInput
        style={styles.input}
        value={equipo}
        onChangeText={setEquipo}
      />
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        maxLength={40}
        placeholder="Máx. 40 Caracteres"
        placeholderTextColor="#888"
      />
      <Text style={styles.label}>Descripción del problema:</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={descripcion}
        onChangeText={setDescripcion}
        maxLength={250}
        placeholder="Máx. 250 Caracteres"
        placeholderTextColor="#888"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={enviarIncidencia}>
        <Text style={styles.buttonText}>ENVIAR</Text>
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
    color: '#A3C567',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    tintColor: '#A3C567',
  },
  label: {
    color: '#A3C567',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: '#A3C567',
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#A3C567',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
