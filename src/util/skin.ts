import { SHA256, enc } from 'crypto-js'
import log from './log'

type ParsedSkinType = {
    [key: string]: {
        created: string
        id: string
        name: string
        skinImage: string
        modelImage: string
        slim: boolean
        textureId: string
        updated: string
    }
}

export function sortFilesByName(files: File[]): File[] {
    return files.sort((a, b) => {
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()
        if (nameA < nameB) {
            return -1
        }
        if (nameA > nameB) {
            return 1
        }
        return 0
    })
}

export async function generateSkinFile(skins: File[]) {
    log.info('Generating skin file...')
    skins = sortFilesByName(skins)

    let index = 1
    let customSkins: ParsedSkinType = {}
    const date = new Date()
    log.info('Timestamp:', date)

    for (const skinFile of skins) {
        log.nl()
        const name = skinFile.name.split('.')[0]
        const id = `skin_${index}`
        log.info(`Generating skin "${name}" of id "${id}"`)

        const skinImage = await fileToBase64(skinFile)
        const textureId = await fileToSHA256(skinFile)
        const slim = await isSkinSlim(skinImage)
        const modelImage = await createSkinPreview(skinImage)

        index += 1

        customSkins[id] = {
            created: date.toISOString(),
            updated: date.toISOString(),
            id,
            name,
            skinImage,
            modelImage,
            slim,
            textureId,
        }

        date.setTime(date.getTime() - 1)
    }

    return {
        customSkins,
        version: 1,
    }
}

export async function fileToBase64(file: File): Promise<string> {
    log.info('Converting file to base64...')
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            log.info('Success.')
            return resolve(reader.result as string)
        }
        reader.onerror = function (err) {
            log.error('Could not convert file to base64.')
            reject(err)
        }
    })
}

export async function isSkinSlim(base64: string): Promise<boolean> {
    log.info('Detecting skin type...')
    return new Promise<boolean>((resolve) => {
        const img = new Image()
        img.src = base64

        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                log.error('Could not retrieve canvas context.')
                return resolve(false)
            }

            ctx.drawImage(img, 0, 0)
            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            )
            const data = imageData.data

            const p1 = { x: 51, y: 16 }
            const p2 = { x: 42, y: 48 }

            const index1 = (p1.y * canvas.width + p1.x) * 4
            const index2 = (p2.y * canvas.width + p2.x) * 4

            const isTransparent1 = data[index1 + 3] === 0
            const isTransparent2 = data[index2 + 3] === 0

            log.info(
                'Detected type:',
                (isTransparent1 && isTransparent2) === true ? 'slim' : 'classic'
            )
            return resolve(isTransparent1 && isTransparent2)
        }
    })
}

export async function createSkinPreview(base64: string): Promise<string> {
    log.info('Creating skin head preview...')
    return new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.src = base64
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const size = 128
            canvas.width = size
            canvas.height = size

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                log.error('Could not retrieve canvas context.')
                return reject('Failed to create canvas context')
            }

            ctx.imageSmoothingEnabled = false
            ctx.drawImage(img, 8, 8, 8, 8, 0, 0, size, size)

            const cropped = canvas.toDataURL()
            log.info('Skin head preview created.')
            return resolve(cropped)
        }
    })
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer)
    const hexParts = []
    for (let i = 0; i < byteArray.length; i++) {
        const hex = byteArray[i].toString(16)
        const paddedHex = ('00' + hex).slice(-2)
        hexParts.push(paddedHex)
    }
    return hexParts.join('')
}

export async function fileToSHA256(file: File): Promise<string> {
    log.info('Generating file hash...')
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            const hash = SHA256(
                arrayBufferToHex(reader.result as ArrayBuffer)
            ).toString()
            log.info('Generated hash:', hash.toString())
            return resolve(hash)
        }
        reader.onerror = function (err) {
            log.error('Could not generate file hash.')
            return reject(err)
        }
    })
}

export function downloadFile(name: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = name
    link.click()
    window.URL.revokeObjectURL(url)
}

export function generateRandomTextureId() {
    const str = Math.random().toString(36).substring(2)
    return SHA256(str).toString(enc.Hex)
}
