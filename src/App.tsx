import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { downloadFile, generateSkinFile } from './util/skin'

function App() {
    const [skinFileGenerated, setSkinFileGenerated] = useState(false)

    const onDrop = useCallback(async (files: File[]) => {
        setSkinFileGenerated(false)
        const filteredFiles = files.filter((x) => x.name.endsWith('.png'))

        if (filteredFiles.length !== files.length)
            alert('Note: non .png files found. They will be ignored.')
        if (!filteredFiles.length) return alert('No skins found!')

        const file = await generateSkinFile(filteredFiles)
        downloadFile(
            'launcher_custom_skins.json',
            JSON.stringify(file, null, 2)
        )
        setSkinFileGenerated(true)
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    return (
        <main className="max-w-screen-md p-4 mx-auto flex flex-col gap-8 py-10">
            <header className="text-center">
                <h1 className="text-4xl font-bold">
                    Minecraft Skin File Generator
                </h1>
            </header>
            <div className="text-lg text-gallery-400 flex flex-col gap-2 text-justify">
                <p>
                    This tool allows you to generate the{' '}
                    <i className="text-green-vanilla-300">
                        launcher_custom_skins.json
                    </i>{' '}
                    file.
                </p>
                <p>
                    <b>Note:</b> the 3d skin preview will not be generated (a
                    head skin preview will be used instead), you will need to
                    open the desired skin in the Minecraft launcher and click
                    "Save" (without making any changes) in order to generate the
                    3d skin preview.
                </p>
                <p>
                    All the process is done locally, no data is sent to any
                    server, so the processing speed depends on your device
                    performance. You can check the source code{' '}
                    <a
                        href="https://github.com/umgustavo/minecraft-skin-file-generator"
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-vanilla-300 underline"
                    >
                        here
                    </a>
                    .
                </p>
                <p>
                    This tool will automatically detect if your skin is slim or
                    not.
                </p>
            </div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="p-20 w-full border-2 border-green-vanilla-300 border-dashed flex items-center justify-center select-none rounded-xl">
                    <p className="text-lg text-gallery-400 text-center">
                        {skinFileGenerated && (
                            <>
                                <span className="text-green-vanilla-300">
                                    Skin file generated!
                                </span>
                                <br />
                            </>
                        )}
                        Drag your skins here or click in this area
                    </p>
                </div>
            </div>
        </main>
    )
}

export default App
