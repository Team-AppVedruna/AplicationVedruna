import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../../firebase-config';

export function PublicacionScreen({ navigation, route }) {
  const { publicacion, onLikeUpdate, selectedPostId } = route.params;
  const userId = auth.currentUser.uid;
  const [likes, setLikes] = useState(publicacion.likes || 0);
  const [liked, setLiked] = useState(publicacion.like?.includes(userId) || false);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComentarios();
  }, [selectedPostId]);

  const fetchComentarios = async () => {
    try {
      if (!selectedPostId) return;
      setLoading(true);
      const response = await fetch(`http://192.168.1.147:8080/proyecto01/comentarios/${selectedPostId}`);
      if (!response.ok) throw new Error('Error al obtener comentarios');
      const data = await response.json();
      setComentarios(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const newLikedStatus = !liked;
      setLiked(newLikedStatus);
      setLikes(newLikedStatus ? likes + 1 : likes - 1);
      if (onLikeUpdate) onLikeUpdate(publicacion.id);

      await fetch(`http://192.168.1.147:8080/proyecto01/publicaciones/put/${publicacion.id}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          like: newLikedStatus ? [...(publicacion.like || []), userId] : (publicacion.like || []).filter(uid => uid !== userId),
        }),
      });
    } catch (error) {
      console.error('Error al actualizar el like:', error);
    }
  };

  const handlePublishComment = async () => {
    if (newComment.trim() === '') return;
    try {
      await fetch('http://192.168.1.147:8080/proyecto01/comentarios/put', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, idPublicacion: publicacion.id, comentario: newComment }),
      });

      setComentarios((prev) => [...prev, { id: Date.now(), user_id: 'Tú', comentario: newComment }]);
      setNewComment('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comentarios}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
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
              <Text style={styles.date}>{publicacion.createdAt}</Text>

              <Text style={styles.commentsTitle}>COMENTARIOS</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUser}>{item.user_id}</Text>
            <Text style={styles.commentText}>{item.comentario}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noComments}>No hay comentarios aún.</Text>}
        refreshing={loading}
        onRefresh={fetchComentarios}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Icon name="comment" size={30} color="#9FC63B" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comentario:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Máx 500 caracteres"
              placeholderTextColor="#888"
              multiline
              maxLength={500}
              value={newComment}
              onChangeText={setNewComment}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.publishButton} onPress={handlePublishComment}>
                <Text style={styles.publishButtonText}>PUBLICAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  commentsTitle: {
    fontSize: 18,
    color: '#9FC63B',
    fontWeight: 'bold',
    marginTop: 20,
  },
  commentContainer: {
    marginBottom: 15,
    backgroundColor: '#2f353a',
    padding: 10,
    borderRadius: 5,
  },
  commentUser: {
    color: '#9FC63B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 5,
  },
  noComments: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9FC63B',
    borderRadius: 50,
    padding: 10,
    zIndex: 999,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#2f353a',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: '#9FC63B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    height: 100,
    backgroundColor: '#444',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#9FC63B',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PublicacionScreen;