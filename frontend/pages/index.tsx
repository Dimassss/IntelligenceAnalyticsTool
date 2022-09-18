import { Flex, Button, Box, Heading, Progress, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from 'react'

import { timeToString, cutStatementText } from '../lib/formating' 
import type { Statement } from '~~/types/model/Statement'
import { loadNewStatements, getAllStatements, getLastId } from '../store/statementSlice'

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
    
      {list.map((item: Statement) => 
        (<Box key={item.id} border-width="1px" rounded="md" m='1' p='2' minW="250px" maxW="400px" flexGrow='1' boxShadow="1px 1px #eee">
            <Link href={`statement/view/${item.id}`}>
              <div>
                <Heading size='md'>
                  { item.name }
                </Heading>
                <Progress value={item.veracity} size='sm'/>
                <Flex color="grey" fontSize="xs">
                  { timeToString(item.created_at) }
                </Flex>
                <Text>{ cutStatementText(item.statement) } </Text>
              </div>
            </Link>
        </Box>)
      )}

      <Flex align="center" justify="center" minW="200px" p='2'>
          <Button variant-color="green" onClick={() => dispatch(loadNewStatements(lastId) as any)}>
              Load New Statements
          </Button>
      </Flex>
    </Flex>
  )
}
