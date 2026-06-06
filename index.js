import { registerRootComponent } from "expo";
import App from "./App";

// ✅ Provider/PersistGate App.js içinde zaten var
// Burada tekrar sarmaya GEREK YOK
registerRootComponent(App);