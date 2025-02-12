import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import emailjs from 'emailjs-com';

export function CrearIncidenciaScreen() {
  const [equipo, setEquipo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const navigation = useNavigation();

  const enviarIncidencia = () => {
    // Validar si todos los campos están llenos
    if (!equipo || !titulo || !descripcion) {
      Alert.alert('Error', 'Por favor, rellene todos los campos.');
      return; // Salir de la función si algún campo está vacío
    }

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
        enviarEmail(incidenciaData);
        navigation.goBack();                
      })
      
      .catch((err) => {
        console.error('Error al enviar incidencia:', err);
        // Muestra un mensaje de error
        Alert.alert('Error', 'Hubo un error al enviar la incidencia');
      });
  };
  const enviarEmail = (incidenciaData) => {
    const templateParams = {
      equipo: incidenciaData.equipo || "No especificado",
      titulo: incidenciaData.titulo || "Sin título",
      descripcion: incidenciaData.descripcion || "Sin descripción",
    };
  
    emailjs.send('service_bpzmje8', 'template_b81ub1h', templateParams, 'ama_scebD4nY9cr_p')
      .then((response) => {
        console.log('Correo enviado:', response.status, response.text);
        Alert.alert('Éxito', 'Correo enviado correctamente');
      })
      .catch((err) => {
        console.error('Error al enviar correo:', err);
        Alert.alert('Error', 'Hubo un error al enviar el correo');
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={enviarIncidencia}>
            <Text style={styles.buttonText}>ENVIAR</Text>
        </TouchableOpacity>
      </View>
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
        marginBottom: 20,
        textAlign: 'center',
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 40,
      borderWidth: 5,
      borderColor: '#9FC63B',
      borderRadius: 20,
      padding: 20,
      width: 160,
      height: 160,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
    label: {
      color: '#9FC63B',
      fontSize: 16,
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#323639',
      color: '#FFF',
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
    },
    textarea: {
      height: 100,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      flexDirection: 'row', 
      justifyContent: 'center', // Esto centra el botón horizontalmente
      marginTop: 20,
    },
    button: {
        borderWidth: 2,
        borderColor: '#9FC63B',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        width: '50%',
        marginTop: 20,
    },
    buttonText: {
      color: '#DFDFDF',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
  
  