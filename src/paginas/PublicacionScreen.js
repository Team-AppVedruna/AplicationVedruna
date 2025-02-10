import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


export function PublicacionScreen({ route }) {
  const { publicacion } = route.params;

  return (
    <View style={styles.container}>
      {publicacion.image_url && (
        <Image
          source={{ uri: publicacion.image_url }}
          style={styles.image}
          onError={(e) => console.log('Error al cargar la imagen:', e.nativeEvent.error)}
        />
      )}
      <Text style={styles.title}>{publicacion.titulo}</Text>
      <Text style={styles.description}>{publicacion.comentario}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23272A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9FC63B',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'justify',
  },
});