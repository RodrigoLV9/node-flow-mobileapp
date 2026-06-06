import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import Home from "./src/app/Home";
import Main from "./Main";

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
      <StatusBar style="auto" />
      <Home />
    </SafeAreaProvider>
  );
}
