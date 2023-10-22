import { useCallback, useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'

import { api } from '../src/lib/api'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/eb823dd2c4a8a16e0085',
}

export default function App() {
  const router = useRouter()

  const [, res, signInWithGithub] = useAuthRequest(
    {
      clientId: 'eb823dd2c4a8a16e0085',
      scopes: ['identity'],
      redirectUri: `${makeRedirectUri({ scheme: 'nlwspacetime' })}`,
    },
    discovery
  )

  const handleGithubOAuthCode = useCallback(
    async function (code: string) {
      try {
        const res = await api.post('/register', {
          code,
          platform: 'mobile',
        })

        const token = res.data.token
        await SecureStore.setItemAsync('token', token)

        router.push('/memories')
      } catch (e) {
        console.log(e.response.data)
      }
    },
    [router]
  )

  useEffect(() => {
    if (res?.type === 'success') {
      const { code } = res.params

      handleGithubOAuthCode(code)
    }
  }, [res, handleGithubOAuthCode])

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
