import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { nowPlayingElement, updateTitle, playCurrentSong, playingArtist, playlist, skipSong, streamPlaying, togglePlay, updateNowPlayingTitle, openMixcloud, currentSong } from './audio'
import { setupUiInfoEngine, tieredFontScale, tieredModalTextWrapScale, wordWrap } from './helperFunctions'
import *  as  ui from 'dcl-ui-toolkit'

// Set Playlist to 'false' to hide the playlist UI:
let Playlist: Boolean = true


const backgroundColor = Color4.create(0, 0, 0, 0.9) // semi transparent black
const pauseIcon = 'images/pauseIcon.png';
const playIcon = 'images/playIcon.png';
const skipIcon = 'images/skipIcon.png'
let isPlaying: boolean = true;
let songData = `${nowPlayingElement}\n ${playingArtist}`
let songDataWrap = wordWrap(songData, 12 * tieredModalTextWrapScale, 6)



export function setupUi() {
    setupUiInfoEngine(),
    ReactEcsRenderer.setUiRenderer(uiComponent)
}

export const uiComponent = () => [
    playlistUI(),
    ui.render()
]

export function playlistUI() {
    if (Playlist) {
        return (
            <UiEntity
                key={'main'}
                uiTransform={{
                    height: `${UiCanvasInformation.get(engine.RootEntity).height * 0.5}`,
                    width: `${UiCanvasInformation.get(engine.RootEntity).height * 0.075}`,
                    positionType: 'absolute',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    padding: 4,
                    position: {
                        top: '8%',
                        right: '0%',
                        bottom: '0%',
                        left: '95%'
                    },
                    maxWidth: 100,
                    maxHeight: 200
                }}
                uiBackground={{
                    color: backgroundColor
                }}
            >
                <UiEntity
                    uiTransform={{
                        margin: '0 0 0 0',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                    }}
                >
                    <Label
                        uiTransform={{
                            width: `${UiCanvasInformation.get(engine.RootEntity).height * 0.05}`,
                            height: `${UiCanvasInformation.get(engine.RootEntity).height * 0.05}`,
                            margin: '0 0 5 0'
                        }}
                        value={'Playlist'}
                        fontSize={14 * tieredFontScale}
                        color={Color4.White()}
                        onMouseDown={openMixcloud}
                    />
                    <Button
                        uiTransform={{
                            width: `${UiCanvasInformation.get(engine.RootEntity).height * 0.05}`,
                            height: `${UiCanvasInformation.get(engine.RootEntity).height * 0.05}`,
                            margin: '0 0 15 0'
                        }}
                        value=''
                        variant='secondary'
                        fontSize={24 * tieredFontScale}
                        color={Color4.White()}
                        uiBackground={{
                            textureMode: 'nine-slices',
                            texture: {
                                src: streamPlaying ? pauseIcon : playIcon,
                            },
                            textureSlices: {
                                top: -0.0,
                                bottom: -0.0,
                                left: -0.0,
                                right: -0.0,
                            },
                        }}
                        onMouseDown={togglePlay}
                    />
                    <Button
                        uiTransform={{
                            width: `${UiCanvasInformation.get(engine.RootEntity).height * 0.05}`,
                            height: `${UiCanvasInformation.get(engine.RootEntity).height * 0.05}`,
                            margin: '0 0 15 0'
                        }}
                        value=''
                        variant='secondary'
                        fontSize={24 * tieredFontScale}
                        color={Color4.White()}
                        uiBackground={{
                            textureMode: 'nine-slices',
                            texture: {
                                src: skipIcon,
                            },
                            textureSlices: {
                                top: -0.0,
                                bottom: -0.0,
                                left: -0.0,
                                right: -0.0,
                            },
                        }}
                        onMouseDown={() => {
                            skipSong();
                            updateNowPlayingTitle(nowPlayingElement, playingArtist);
                        }}
                    />
                    <Button
                        uiTransform={{
                            width: `${UiCanvasInformation.get(engine.RootEntity).height * 0.07}`,
                            height: `${UiCanvasInformation.get(engine.RootEntity).height * 0.02}`,
                            margin: '0 0 5 0'
                        }}
                        value='RED ALBERT'
                        variant='primary'
                        fontSize={10 * tieredFontScale}
                        color={Color4.White()}
                        onMouseDown={openMixcloud}
                    />
                </UiEntity>
            </UiEntity>
        );
    } else {
        return null; // Return null if Playlist is false
    }
}


