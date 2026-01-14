import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { StatusBar } from 'expo-status-bar'

import { ThemeProvider } from './src/theme/ThemeProvider'
import RootNavigator from './src/navigation/RootNavigator'
import { store } from './src/store/store'

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <SafeAreaProvider>
                    <ThemeProvider>
                        <NavigationContainer>
                            <RootNavigator />
                        </NavigationContainer>
                    </ThemeProvider>
                </SafeAreaProvider>
            </Provider>
        </GestureHandlerRootView>
    )
}
