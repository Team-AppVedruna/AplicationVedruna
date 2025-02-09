import react from "react";
import { View, Text, StyleSheet} from "react-native";

export function IncidenciasScreen() {  
    return (
        <View style={styles.container}>
            <Text>Incidencias</Text>
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