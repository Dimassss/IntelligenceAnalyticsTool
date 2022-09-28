import { Flex, Button, Box, Heading, Progress, Text, IconButton } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import debounce from 'lodash.debounce';

import styles from '../styles/statement/Statement-tile.module.scss'

import type { StatementType } from '../types/model/Statement'
import { loadNewStatements, getAllStatements, getLastId, getCurrentStatement, setCurrentStatement, saveStatement, createStatement } from '../store/statementSlice'
import Statement from '../components/statement/Statement'
import StatementForm from '../components/statement/forms/StatementForm'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { FaPlus, FaRegSave } from 'react-icons/fa'
import { cutStatementText, timeToString } from '../lib/formating'
import { AppState } from '../store/store'

interface StatementNode extends StatementType{
  x: number,
  y: number
}
interface StatementLink {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  source: number,
  target: number,
  pointer: {
    x1: number
    y1: number,
    x2: number,
    y2: number
  }
}

const statementsDisplay = (svgRef, svgConf) => {
  const linksRel = {}
  const graphNodes: StatementNode[] = svgConf.nodes.map((n, i) => {
    linksRel[n.id] = i

    return {...n,
        x: Math.random() * (svgConf.w - 40) + 20,
        y: Math.random() * (svgConf.h - 40) + 20
      }
  })
  const graphLinks: StatementLink[] = graphNodes.map(n => {
    const links = n.use_statements.map(s_id => {
      if(s_id in linksRel){
        const target = graphNodes[linksRel[s_id]]
        return {
          x1: n.x,
          y1: n.y,
          x2: target.x,
          y2: target.y,
          source: s_id,
          target: n.id
        }
      }
    }).filter(el => el !== undefined)
    .map(l => {
      const vect = [l.x1-l.x2, l.y1-l.y2]
      const dist = Math.hypot(...vect)
      const redPartMaxLength = 30
      const redPartLengthRatio = Math.min(1, redPartMaxLength / dist)
      const pointerCoord = [l.x1 - redPartLengthRatio * vect[0], l.y1 - redPartLengthRatio * vect[1]]

      return {...l, 
        pointer: {
          x1: l.x1,
          y1: l.y1,
          x2: pointerCoord[0],
          y2: pointerCoord[1],
        }
      }
    })

    return links
  }).reduce((a,b) => [...a, ...b], [])

  const svg = d3.select(svgRef.current)
    .attr('width', svgConf.w)
    .attr('height', svgConf.h)
    .attr('style', 'user-select:none')

  svg.selectAll('*').remove()

  svg.append('rect')
    .attr('fill', '#3a105f')
    .attr('width', svgConf.w)
    .attr('height', svgConf.h)

  svg.append('g')
    .selectAll('line')
    .data(graphLinks)
    .join('line')
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr('stroke', (d,i) => `black`)
  
  svg.append('g')
    .selectAll('line')
    .data(graphLinks)
    .join('line')
    .attr('x1', d => d.pointer.x1)
    .attr('y1', d => d.pointer.y1)
    .attr('x2', d => d.pointer.x2)
    .attr('y2', d => d.pointer.y2)
    .attr('stroke', `red`)
  

  const nodesBorder = svg.append('g')
    .selectAll('circle')
    .data(graphNodes)
    .join('circle')
    .attr('r', svgConf.nodeRadius + 2)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('fill', 'black')

  const onClickNode = debounce((e, st) => {
    if(e.detail >= 2){
      svgConf.onSelectNode(st)
    } else {
      svgConf.onPreviewNode(st)
    }
  }, 150, true)
  const nodes = svg.append('g')
    .selectAll('circle')
    .data(graphNodes)
    .join('circle')
    .attr('r', svgConf.nodeRadius)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('fill', 'black')
    .attr('stroke', '#FF0000')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', 2*Math.PI*10)
    .attr('stroke-dashoffset', d => 2*Math.PI*10 * (3 -  d.veracity / 100))
    .attr('transform', d => `rotate(-90 ${d.x} ${d.y})`)
    .on('click', onClickNode)
  
  nodes.append('title')
      .text((d: StatementType) => d.id)

  return {
    selectNodeDraw(node: StatementType){
      nodesBorder.attr('r', d => {
        if(d.id == node.id){
          return svgConf.selectedNodeRadius + 2
        }
        return svgConf.nodeRadius + 2
      })

      nodes.attr('r', d => {
        if(d.id == node.id){
          return svgConf.selectedNodeRadius
        }
        return svgConf.nodeRadius
      })
      .attr('stroke-dasharray', d => 2*Math.PI * (d.id == node.id ? svgConf.selectedNodeRadius : svgConf.nodeRadius ))
      .attr('stroke-dashoffset', d => (3 - d.veracity / 100) * 2*Math.PI * (d.id == node.id ? svgConf.selectedNodeRadius : svgConf.nodeRadius ))
    }
  }

}

let selectNodeDraw = (node) => {
  console.log('Called empty func')
}

export default function Home() {
  const dispatch = useDispatch()
  const list = useSelector(getAllStatements)
  const selectedStatement = useSelector(getCurrentStatement)
  const lastId = useSelector(getLastId)
  const svgRef = useRef()
  const [doSubmitStatementForm, setDoSubmitStatementForm] = useState(false)
  const [previewStatement, setPreviewStatement] = useState({} as StatementType)
  
  let selectNode = (node: StatementType) => {
    selectNodeDraw(node)
    dispatch(setCurrentStatement(node))
  }

  useEffect(() => {
    dispatch(loadNewStatements(lastId) as any)
  }, [])

  useEffect(() => {
    const svgConf = {
      w: window.innerWidth / 12 * 7.95,
      h: window.innerHeight - 400,
      nodeRadius: 10,
      selectedNodeRadius: 20,
      nodes: list,
      onSelectNode: node => selectNode(node),
      onPreviewNode: node => setPreviewStatement(node)
    }

    selectNodeDraw = statementsDisplay(svgRef, svgConf).selectNodeDraw
    selectNodeDraw(selectedStatement ? selectedStatement : {})
  }, [list])

  const onStatementFormSubmit = (st: StatementType) => {
    setDoSubmitStatementForm(false)
    if(st.id === undefined){
      dispatch(createStatement(st) as any)
    } else {
      dispatch(saveStatement(st) as any)
    }
  }

  return (<Grid templateColumns='repeat(12, 1fr)' gap={2}>
    <GridItem colSpan={8}>
      <svg ref={svgRef}/>
    </GridItem>
    <GridItem colSpan={4}>
      <IconButton 
          icon={<FaPlus/>}
          aria-label="Main page"  
          variant-color="green" 
          rounded="0" 
          roundedBottomRight='md'
          onClick={() => selectNode({
            name: '',
            veracity: 0,
            statement: '',
            use_statements: []
          })}
      />
      {selectedStatement 
        ? (<>
            <IconButton 
              icon={<FaRegSave/>}
              aria-label="Main page"  
              variant-color="green" 
              rounded="0" 
              roundedBottomRight='md'
              onClick={() => setDoSubmitStatementForm(true)}
            />
            <Text ml='2' color="grey">{ timeToString(selectedStatement.created_at) }</Text>
            <StatementForm 
              onSubmit={onStatementFormSubmit} 
              doSubmit={doSubmitStatementForm} 
              statement={selectedStatement}
            />
          </>)
        : (<p>Select node with double click or create new one with plus button</p>)
      }
    </GridItem>
    <GridItem colSpan={8}>
      <Grid templateColumns='repeat(12, 1fr)' gap={2}>
        {list.map((item: StatementType) => (
          <GridItem 
            onClick={
              debounce(e => {
                if(e.detail >= 2) {
                  selectNode(item)
                } else {
                  setPreviewStatement(item);
                }
              }, 150, true)
            }
            colSpan={4} 
            key={item.id} 
            p={2} 
            className={[
              styles['statement-tile'], 
              previewStatement.id == item.id ? styles['previewed'] : undefined, 
              selectedStatement && selectedStatement.id == item.id ? styles['selected'] : undefined
            ].filter(el => el).join(' ')}
          >
            <p>{item.name}</p>
          </GridItem>))
        }
      </Grid>
    </GridItem>
    <GridItem colSpan={4}>
      {
        previewStatement.id === undefined 
        ? (<p>Select</p>)
        : (<Statement statement={previewStatement} />) 
      }
    </GridItem>
  </Grid>)
}

