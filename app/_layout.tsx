import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import { styled } from 'nativewind'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

const StyledStripes = styled(Stripes)

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null)

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  useEffect(() => {
    if (hasLoadedFonts) {
      ;(async () => {
        await SplashScreen.hideAsync()
      })()
    }
  }, [hasLoadedFonts])

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      setIsUserAuthenticated(!!token)
    })
  }, [])

  if (!hasLoadedFonts) return null

  return (
    <>
      <ImageBackground
        source={blurBg}
        imageStyle={{
          position: 'absolute',
          left: '-100%',
        }}
        className="relative flex-1 bg-gray-900"
      >
        <StatusBar style="light" translucent />
        <StyledStripes className="absolute left-2" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" redirect={!!isUserAuthenticated} />
          <Stack.Screen name="memories" />
          <Stack.Screen name="new" />
        </Stack>
      </ImageBackground>
    </>
  )
}
