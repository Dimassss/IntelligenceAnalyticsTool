import { useSelector, useDispatch } from "react-redux"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Statement } from "../../types/model/Statement"
import { createStatement, getCurrentStatement, setCurrentStatement } from "../../store/statementSlice"
import StatementForm from "../../components/statement/forms/StatementForm"


export default function CreateStatement(){
    const router = useRouter()
    const dispatch = useDispatch()
    const curSt = useSelector(getCurrentStatement)
    
    dispatch(setCurrentStatement(null))

    const submitForm = async (st: Statement) => {
        dispatch(createStatement(st) as any)
    }

    useEffect(() => {
        if(curSt){ 
            if(curSt.id) router.push(`/statement/view/${curSt.id}`)
            else console.log(curSt)
        }
    }, [curSt])


    return (<StatementForm statement={null} onSubmit={submitForm}/>)
}
