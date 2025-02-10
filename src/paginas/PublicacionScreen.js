import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export function PublicacionScreen({ navigation, route }) {
  const { publicacion } = route.params; // Obtenemos los datos de la publicación

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={25} color="#9FC63B" />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
          <View>
            <Text style={styles.publishedBy}>Publicado por</Text>
            <Text style={styles.userName}>{publicacion.nick}</Text>
          </View>
        </View>
      </View>

      {/* Publicación */}
      <View style={styles.publicacionContainer}>
        {/* Imagen de la publicación */}
        {publicacion.image_url && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: publicacion.image_url }}
              style={styles.image}
              onError={(e) => console.log('Error al cargar la imagen:', e.nativeEvent.error)}
            />
          </View>
        )}

        {/* Contenedor de información (likes, título, descripción, etc.) */}
        <View style={styles.textContainer}>
          {/* Likes */}
          <View style={styles.likeContainer}>
            <Icon name="heart-o" size={18} color="#9FC63B" />
            <Text style={styles.likeText}>{publicacion.likes || 0} Me gusta</Text>
          </View>

          {/* Título */}
          <Text style={styles.title}>{publicacion.titulo}</Text>

          {/* Descripción */}
          <Text style={styles.description}>{publicacion.comentario}</Text>

          {/* Fecha */}
          <Text style={styles.date}>Hace 4 días</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23272A',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  backButton: {
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 25,
    marginRight: 10,
  },
  publishedBy: {
    fontSize: 14,
    color: '#ffffff',
  },
  userName: {
    fontSize: 25,
    color: '#9FC63B',
    fontWeight: 'bold',
  },
  publicacionContainer: {
    alignItems: 'center', // Centrado de todo el contenedor
  },
  imageContainer: {
    marginBottom: 20, // Espacio debajo de la imagen
  },
  image: {
    width: 400,
    height: 350,
    borderRadius: 10,
  },
  textContainer: {
    alignItems: 'flex-start', // Alineación a la izquierda para los elementos textuales
    width: '100%', // Para que ocupe todo el ancho disponible
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  likeText: {
    fontSize: 14,
    color: '#9FC63B',
    marginLeft: 5,
  },
  title: {
    fontSize: 20,
    color: '#9FC63B',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#cccccc',
    marginTop: 10,
  },
});
