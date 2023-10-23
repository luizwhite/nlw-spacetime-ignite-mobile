import Icon from '@expo/vector-icons/Feather'
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  const [isPublic, setIsPublic] = useState<boolean>(false)
  const [content, setContent] = useState<string | null>(null)
  const [preview, setImage] = useState<string | null>(null)

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (!result.canceled && result.assets[0]) setImage(result.assets[0].uri)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''
    if (preview) {
      const uploadFormData = new FormData()

      const file = {
        uri: preview,
        name: 'image.png',
        type: 'image/png',
      }

      uploadFormData.append('file', file)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      coverUrl = uploadResponse.data?.fileUrl
    }

    const Authorization = `Bearer ${token}`
    const memoryData = {
      content,
      isPublic,
      coverUrl,
    }

    api.post('/memories', memoryData, {
      headers: { Authorization },
    })

    router.push({ pathname: '/memories', params: { refresh: 'true' } })
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex flex-row items-center justify-between">
        <NLWLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ true: '#372560', false: '#56565a' }}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            ios_backgroundColor={'#56565a'}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          onPress={openImagePicker}
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {/* Upload Image */}
          {!preview && (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}

          {/* Image uploaded */}
          {preview && (
            <Image
              source={{ uri: preview }}
              alt=""
              className="h-full w-full rounded-lg object-cover"
            />
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content || ''}
          textAlignVertical="top"
          onChangeText={setContent}
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <TouchableOpacity
          onPress={handleCreateMemory}
          activeOpacity={0.7}
          className="items-center rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
