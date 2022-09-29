export interface StatementType {
    id?: number, 
    name: string, 
    veracity: number, 
    created_at?: string, 
    statement: string,
    use_statements: number[],

    type?: string
}