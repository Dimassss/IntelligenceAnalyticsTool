import { IconButton, Flex } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import { useSelector } from "react-redux"

import { getAllStatements } from '../store/statementSlice'
import { FaLocationArrow, FaShareAlt } from 'react-icons/fa'
import GraphView from './GraphView'
import { useState } from 'react'


export default function GraphEditor({width = 0, height = 0, onSelectNode, onPreviewNode, onEdgeMake, onEdgeDelete, selectedNode, previewedNode}) {
    const [mode, setMode] = useState('pointer')
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
                        colorScheme={mode == 'pointer' ? "blue" : null}
                        rounded="0" 
                        roundedBottomRight='md'
                        onClick={() => {
                            setMode('pointer')
                        }}
                        w="100%"
                    />

                    <IconButton 
                        icon={<FaShareAlt/>}
                        aria-label="Pointer"  
                        colorScheme={mode == 'edge-editing' ? "blue" : null}
                        rounded="0" 
                        roundedBottomRight='md'
                        onClick={() => {
                            setMode('edge-editing')
                        }}
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
                    onEdgeMake={onEdgeMake}
                    onEdgeDelete={onEdgeDelete}
                    selectedNode={selectedNode && selectedNode.id ? selectedNode : null}
                    previewedNode={previewedNode}
                    mode={mode}
                />
            </GridItem>
        </Grid>
    )
}

