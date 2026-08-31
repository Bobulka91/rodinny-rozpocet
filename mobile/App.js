import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, ImageBackground } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import PrehledSlide from './src/slides/PrehledSlide';

export default function App() {
  return (
    <AppProvider>
      <ImageBackground
        source={require('./src/assets/cosmic-bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          <PrehledSlide />
        </SafeAreaView>
      </ImageBackground>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
});