import { Box, Heading, IconButton, Spacer, Text } from "@chakra-ui/react"
import { FaPen, FaTrash } from "react-icons/fa"
import { WorkspaceType } from "../../store/workspaceSlice"
import WorkspaceTileContainer from "./WorkspaceTileContainer"

type Props = {
    workspace: WorkspaceType,
    onDblClick?: (e) => void,
    onClick?: (e) => void,
    onDelete?: (e) => void,
    onEdit?: (e) => void,
}

export default function WorkspaceTile({
    workspace: w, 
    onDblClick = () => {}, 
    onClick = () => {},
    onDelete = () => {},
    onEdit = () => {},
}: Props) {
    return (
        <WorkspaceTileContainer
            cursor={"pointer"}
            onClick={onClick}
            onDblClick={onDblClick}
        >
            <Heading as="h4" size="md" w={"100%"}>
                {w.title}
                <IconButton
                    variant='outline'
                    colorScheme='green'
                    aria-label='Edit workspace'
                    fontSize='12px'
                    border={0}
                    size="sm"
                    onClick={onEdit}
                    icon={<FaPen />}
                />
                <IconButton
                    variant='outline'
                    colorScheme='green'
                    aria-label='Delete workspace'
                    fontSize='12px'
                    border={0}
                    size="sm"
                    onClick={onDelete}
                    icon={<FaTrash />}
                />
            </Heading>
            <Text fontSize='md'>{w.description}</Text>
        </WorkspaceTileContainer>
    )
}