import { Box, Button, Flex, Heading, IconButton, Spacer, Text } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FaArrowRight, FaPlus } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import WorkspaceForm from "../components/workspace/WorkspaceForm"
import WorkspaceFormTile from "../components/workspace/WorkspaceFormTIle"
import WorkspaceTile from "../components/workspace/WorkspaceTile"
import { deleteWorkspace, getWorkspaces, loadNewWorkspaces, saveWorkspace, WorkspaceType } from "../store/workspaceSlice"
import { DefaultLayer } from "../layers/default"


export default function Home(){
    const dispatch = useDispatch()
    const router = useRouter()
    const workspaces = useSelector(getWorkspaces)
    const [ws, setWS] = useState(null as WorkspaceType)
    const [doSubmit, setDoSubmit] = useState(false)

    useEffect(() => {
        dispatch(loadNewWorkspaces() as any)
    }, [])

    return (<DefaultLayer>
        <Flex m="3" wrap={"wrap"}>
            <IconButton
                m={2}
                alignSelf={"center"}
                colorScheme='green'
                aria-label='Create new workspace'
                icon={<FaPlus/>}
                onClick={e => {
                    setWS({
                        title: '',
                        description: ''
                    })
                }}
            />
            {
                !ws || 'id' in ws 
                    ? ''
                    : (<WorkspaceFormTile 
                        workspace={ws}
                        onCancel={() => setWS(null)}
                        onSubmit={(workspace) => {
                            setWS(null)
                            dispatch(saveWorkspace(workspace) as any)
                        }}
                    />)
            }
            {
                workspaces.map(w => {
                    if(ws && ws.id == w.id) {
                        return (<WorkspaceFormTile 
                            workspace={ws}
                            onCancel={() => setWS(null)}
                            onSubmit={(workspace) => {
                                setWS(null)
                                dispatch(saveWorkspace(workspace) as any)
                            }}
                        />)
                    }

                    return (<WorkspaceTile 
                        key={w.id}
                        workspace={w}
                        onDblClick={e => {
                            router.push(`workspace/${w.id}`)
                        }}
                        onDelete={e => {
                            dispatch(deleteWorkspace(w.id) as any)
                        }}
                        onEdit={e => {
                            setWS(w)
                        }}
                    />)
                })
            }
            <IconButton
                m={2}
                alignSelf={"center"}
                colorScheme='green'
                aria-label='Load new workspaces'
                onClick={e => {
                    dispatch(loadNewWorkspaces() as any)
                }}
                icon={<FaArrowRight/>}
            />
        </Flex>
    </DefaultLayer>)
}