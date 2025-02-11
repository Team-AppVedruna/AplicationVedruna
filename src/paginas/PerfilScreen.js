import React from "react";
import { View, Text, StyleSheet} from "react-native";

export function PerfilScreen() {  
    return (
        <View style={styles.container}>
            <Text>Perfil de Usuario</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',        
    },
});