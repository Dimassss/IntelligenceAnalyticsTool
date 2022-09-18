import dayjs from 'dayjs'

export const timeToString = (time: any): string => {
    const t = dayjs(time)
    const n = dayjs()
  
    if(n.diff(t, 'minute') < 2) {
        return 'moment ago'
    } else if(n.diff(t, 'hour') < 1) {
        return `${n.diff(t, 'minute')} minutes ago`
    } else if(n.diff(t, 'day') < 1) {
        const hourDiff = n.diff(t, 'hour')
        return `${hourDiff} hour${hourDiff == 1 ? '' : 's'} ago`
    } else {
        return t.format('D MMM YYYY')
    }
}

export const cutStatementText = (st: string): string => {
    if(st.length < 150){
        return st
    } else {
        return st.substring(0, 130) + '...'
    }
}