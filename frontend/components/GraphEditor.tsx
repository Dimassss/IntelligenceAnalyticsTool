import { IconButton, Flex } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import { useSelector } from "react-redux"

import { getAllStatements } from '../store/statementSlice'
import { FaLocationArrow, FaShareAlt } from 'react-icons/fa'
import GraphView from './GraphView'


export default function GraphEditor({width = 0, height = 0, onSelectNode, onPreviewNode, selectedNode, previewedNode}) {
    const list = useSelector(getAllStatements)

    const onSelectNodeHandler = (node) => {
        onSelectNode(node)
    }
    const onPreviewNodeHandler = (node) => {
        onPreviewNode(node)
    }

    const graphConf = {
        width: width * 23 / 24,
        height: Math.max(1, height)
    }

    return (
        <Grid templateColumns='repeat(24, 1fr)'>
            <GridItem colSpan={1}>
                <Flex direction={'column'}>
                    <IconButton 
                        icon={<FaLocationArrow/>}
                        aria-label="Ponter"  
                        variant-color="green" 
                        rounded="0" 
                        roundedBottomRight='md'
                        onClick={() => {}}
                        w="100%"
                    />

                    <IconButton 
                        icon={<FaShareAlt/>}
                        aria-label="Ponter"  
                        variant-color="green" 
                        rounded="0" 
                        roundedBottomRight='md'
                        onClick={() => {}}
                        w="100%"
                    />
                </Flex>
            </GridItem>
            <GridItem colSpan={23}>
                <GraphView
                    statements={list} 
                    width={graphConf.width} 
                    height={graphConf.height}
                    onPreviewedNode={onPreviewNodeHandler}
                    onSelectNode={onSelectNodeHandler}
                    selectedNode={selectedNode && selectedNode.id ? selectedNode : null}
                    previewedNode={previewedNode}
                />
            </GridItem>
        </Grid>
    )
}

