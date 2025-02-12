import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

export function AddScreen() {
  const [photoUri, setPhotoUri] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [apiEndpoint] = useState('http://192.168.1.147:8080/proyecto01/publicaciones');
  const [currentUserId, setCurrentUserId] = useState(null);

  // Verifica el estado de autenticación del usuario
  useEffect(() => {
    const authListener = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });
    return () => authListener();
  }, []);

  // Muestra las opciones para seleccionar la fuente de la imagen
  const selectImageSource = () => {
    Alert.alert(
      "Selecciona una opción",
      "¿Deseas tomar una foto o elegir una de la galería?",
      [
        { text: "Tomar foto", onPress: capturePhoto },
        { text: "Elegir de galería", onPress: handleImagePicker },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  // Captura una foto utilizando la cámara del dispositivo
  const capturePhoto = async () => {
    const permissionResponse = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResponse.granted) {
      Alert.alert("Permiso denegado", "Es necesario permitir el acceso a la cámara");
      return;
    }
    const photoResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (photoResult.canceled) {
      console.log("La toma de foto fue cancelada.");
      return;
    }
    const imageUri = photoResult.assets?.[0]?.uri;
    if (imageUri) {
      setPhotoUri(imageUri);
      console.log("Foto tomada:", imageUri);
    } else {
      console.log("No se pudo obtener la URI de la imagen.");
    }
  };

  // Selecciona una imagen desde la galería
  const handleImagePicker = async () => {
    try {
      const permissionResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResponse.granted) {
        Alert.alert("Permiso denegado", "Es necesario permitir el acceso a la galería");
        return;
      }
      const photoResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!photoResult.cancelled) {
        const imageUri = photoResult.assets?.[0]?.uri || photoResult.uri;
        setPhotoUri(imageUri);
        console.log("Imagen seleccionada:", imageUri);
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert("Error", "Hubo un problema al seleccionar la imagen");
    }
  };

  // Sube una imagen a Cloudinary y devuelve la URL de la imagen subida
  const uploadImageToCloudinary = async (uri) => {
    const formData = new FormData();
    const fileName = uri.split('/').pop();
    const fileExtension = fileName.split('.').pop();
    const mimeType = fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'image/jpeg' : `image/${fileExtension}`;
    formData.append("file", {
      uri: uri,
      type: mimeType,
      name: fileName,
    });
    formData.append("upload_preset", "example");

    try {
      console.log("Subiendo imagen a Cloudinary...");
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dtrqdsqpq/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const responseData = await uploadResponse.json();
      console.log("Respuesta de Cloudinary:", responseData);
      if (responseData.secure_url) {
        return responseData.secure_url;
      } else {
        throw new Error('Error al subir la imagen');
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Alert.alert("Error", "Hubo un problema al subir la imagen a Cloudinary");
    }
  };

  // Maneja la creación de una publicación con imagen, título y descripción
  const submitPost = async () => {
    if (!photoUri || !postTitle || !postDescription) {
      Alert.alert("Error", "Por favor, completa todos los campos y toma una foto");
      return;
    }
    if (!currentUserId) {
      Alert.alert("Error", "No estás autenticado");
      return;
    }
    console.log("Iniciando la subida de imagen...");
    const uploadedImageUrl = await uploadImageToCloudinary(photoUri);
    if (!uploadedImageUrl) {
      console.log("La imagen no se subió correctamente. Abortando la publicación.");
      return;
    }
    if (!apiEndpoint) {
      Alert.alert("Error", "La URL de la API no está configurada");
      return;
    }
    try {
      console.log("Enviando la publicación al backend...");
      console.log("Datos a enviar:", {
        titulo: postTitle,
        comentario: postDescription,
        user_id: currentUserId,
        image_url: uploadedImageUrl,
      });
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "*/*"
        },
        body: JSON.stringify({
          titulo: postTitle,
          comentario: postDescription,
          user_id: currentUserId,
          image_url: uploadedImageUrl,
        }),
      });
      console.log("Respuesta del backend:", response.status);
      if (response.ok) {
        Alert.alert("Éxito", "Publicación creada correctamente");
        setPostTitle('');
        setPostDescription('');
        setPhotoUri(null);
      } else {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        Alert.alert("Error", errorData.message || "Hubo un error al crear la publicación");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      Alert.alert("Error", "Hubo un problema al enviar la solicitud");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>PUBLICACIÓN</Text>
        {/* Al pulsar en el área de la imagen se mostrará la opción para elegir entre cámara y galería */}
        <TouchableOpacity style={styles.imageContainer} onPress={selectImageSource}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.image} />
          ) : (
            <Image source={require('../../assets/Contacts.png')} style={styles.image} />
          )}
        </TouchableOpacity>
        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          placeholder="Máx. 40 Caracteres"
          placeholderTextColor="#ccc"
          maxLength={40}
          value={postTitle}
          onChangeText={setPostTitle}
        />
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Máx. 250 Caracteres"
          placeholderTextColor="#ccc"
          maxLength={250}
          multiline
          value={postDescription}
          onChangeText={setPostDescription}
        />
        <TouchableOpacity style={styles.publishButton} onPress={submitPost}>
          <Text style={styles.publishButtonText}>PUBLICAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#23272A',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#9FC63B',
    marginBottom: 20,
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
    alignSelf: 'flex-start',
    color: '#9FC63B',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#323639',
    color: '#fff',
    width: '100%',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  textarea: {
    height: 150,
    textAlignVertical: 'top',
  },
  publishButton: {
    borderWidth: 2,
    borderColor: '#9FC63B',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: '50%',
    marginTop: 20,
  },
  publishButtonText: {
    color: '#DFDFDF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddScreen;
