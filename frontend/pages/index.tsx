import { Flex, Button, Box, Heading, Progress, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from 'react'

import { timeToString, cutStatementText } from '../lib/formating' 
import type { StatementType } from '../types/model/Statement'
import { loadNewStatements, getAllStatements, getLastId } from '../store/statementSlice'
import Statement from '../components/statement/Statement'

export default function Home() {
  const dispatch = useDispatch()
  const list = useSelector(getAllStatements)
  const lastId = useSelector(getLastId)

  useEffect(() => {
    dispatch(loadNewStatements(lastId) as any)
  }, [])

  return (
    <Flex m='1' align="stretch" flexWrap="wrap">
      <Flex align="center" justify="center" minW="200px" p='2'>
          <Link href="statement/create">
              <Button variant-color="green">Create</Button>
          </Link>
      </Flex>
    
      {list.map((item: StatementType) => (<Statement statement={item} key={item.id} />))}

      <Flex align="center" justify="center" minW="200px" p='2'>
          <Button variant-color="green" onClick={() => dispatch(loadNewStatements(lastId) as any)}>
              Load New Statements
          </Button>
      </Flex>
    </Flex>
  )
}
