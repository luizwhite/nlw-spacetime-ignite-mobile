interface FileObject {
  uri: string
  name: string
  type: string
}

interface FormData {
  append(name: string, blobValue: Blob | FileObject, filename?: string): void
  set(name: string, blobValue: Blob | FileObject, filename?: string): void
}
