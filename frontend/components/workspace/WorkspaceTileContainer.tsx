import { Box } from "@chakra-ui/react"

type Props = {
    children?: JSX.Element | JSX.Element[],
    cursor?: string,
    onClick?: (e) => void,
    onDblClick?: (e) => void
}

export default function WorkspaceTileContainer({
    cursor, 
    children, 
    onClick = (e) => {}, 
    onDblClick = (e) => {}
}: Props) {
    return (<Box
        maxW="700px" 
        minW="500px" 
        borderWidth='1px' 
        borderRadius='lg' 
        m={2} 
        p={1}
        cursor={cursor ? cursor : undefined}
        onClick={onClick}
        onDoubleClick={onDblClick}
    >
        {children}
    </Box>)
}