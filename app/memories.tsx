import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import Icon from '@expo/vector-icons/Feather'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

dayjs.locale(ptBr)

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const { refresh } = useLocalSearchParams<{ refresh: 'true' | 'false' }>()
  const [memories, setMemories] = useState<Memory[]>([])

  async function signOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')
    const Authorization = `Bearer ${token}`

    const response = await api.get<Memory[]>('/memories', {
      headers: { Authorization },
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  useEffect(() => {
    if (refresh === 'true') {
      loadMemories()
      router.setParams({ refresh: 'false' })
    }
  }, [refresh, router])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex flex-row items-center justify-between px-8">
        <NLWLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((m) => (
          <View key={m.id} className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {dayjs(m.createdAt).format('D[ de ]MMMM[, ]YYYY')}
              </Text>
            </View>

            <View className="space-y-4 px-8">
              <Image
                source={{ uri: m.coverUrl }}
                alt=""
                className="aspect-video w-full rounded-lg"
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {m.excerpt}
              </Text>

              <Link href="/memories/id" asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
