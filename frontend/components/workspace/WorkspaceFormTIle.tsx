import { Flex, Button, Spacer } from "@chakra-ui/react"
import { useState } from "react"
import { saveWorkspace, WorkspaceType } from "../../store/workspaceSlice"
import WorkspaceForm from "./WorkspaceForm"
import WorkspaceTileContainer from "./WorkspaceTileContainer"

type Props = {
    workspace: WorkspaceType,
    onSubmit: (ws: WorkspaceType) => void,
    onCancel: () => void
}

export default function WorkspaceFormTile({
    workspace,
    onSubmit = (w) => {}, 
    onCancel = () => {},
}: Props) {
    const [doSubmit, setDoSubmit] = useState(false)

    return (<WorkspaceTileContainer
        cursor={"pointer"}
    >
        <WorkspaceForm 
            workspace={workspace}
            onSubmit={(workspace) => {
                setDoSubmit(false)
                onSubmit(workspace)
            }}
            doSubmit={doSubmit}
        />
        <Flex p={2}>
            <Button colorScheme={"green"} onClick={e => setDoSubmit(true)}>Save</Button>
            <Spacer/>
            <Button onClick={onCancel}>Cancel</Button>
        </Flex>
    </WorkspaceTileContainer>)
}