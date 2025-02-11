import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../../firebase-config';

const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return `Hace ${seconds} segundo${seconds > 1 ? 's' : ''}`;
};

export function PublicacionScreen({ navigation, route }) {
  const { publicacion, onLikeUpdate } = route.params; // Obtener la función de actualización
  const userId = auth.currentUser .uid;
  const [likes, setLikes] = useState(publicacion.likes || 0);
  const [liked, setLiked] = useState(publicacion.like?.includes(userId) || false);

  const handleLike = async () => {
    try {
      const newLikedStatus = !liked;
      const updatedLikes = newLikedStatus ? likes + 1 : likes - 1;

      setLiked(newLikedStatus);
      setLikes(updatedLikes);

      // Actualizar el estado en HomeScreen
      if (onLikeUpdate) {
        onLikeUpdate(publicacion.id); // Llamar a la función de actualización
      }

      const url = `http://192.168.1.147:8080/proyecto01/publicaciones/put/${publicacion.id}/${userId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          like: newLikedStatus
            ? [...(publicacion.like || []), userId]
            : (publicacion.like || []).filter(uid => uid !== userId),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el like');
      }
    } catch (error) {
      console.error('Error al actualizar el like:', error);
    }
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.publicacionContainer}>
        {publicacion.image_url && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: publicacion.image_url }} style={styles.image} />
          </View>
        )}

        <View style={styles.textContainer}>
          <View style={styles.likeContainer}>
            <TouchableOpacity onPress={handleLike}>
              <Icon name={liked ? 'heart' : 'heart-o'} size={18} color="#9FC63B" />
            </TouchableOpacity>
            <Text style={styles.likeText}>{likes} Me gusta</Text>
          </View>

          <Text style={styles.title}>{publicacion.titulo}</Text>
          <Text style={styles.description}>{publicacion.comentario}</Text>
          <Text style={styles.date}>{timeAgo(publicacion.createdAt)}</Text>
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
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 400,
    height: 350,
    borderRadius: 10,
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
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